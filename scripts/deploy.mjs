/**
 * Build and deploy one environment, with its own NEXT_PUBLIC_SITE_URL.
 *
 *   node scripts/deploy.mjs staging
 *   node scripts/deploy.mjs production
 *   node scripts/deploy.mjs staging --dry-run    # build, report size, do not upload
 *
 * Why this exists rather than an inline env prefix on the npm script:
 *
 * NEXT_PUBLIC_SITE_URL is a *build-time* variable. Next.js inlines it into the
 * bundle, and canonical URLs, sitemap.xml, robots.txt and og:image are all
 * baked during prerender. Setting it as a Worker secret or a `vars` entry has
 * no effect whatsoever — by the time the Worker runs, the value is already
 * frozen into the output.
 *
 * Unset, `src/lib/site.ts` falls back to the production domain. That fallback
 * is the failure this script exists to prevent: a staging deploy that silently
 * advertises production canonical URLs and an og:image on a domain that may
 * not resolve yet. Search engines and scrapers would believe it.
 *
 * `VAR=x cmd` is also not portable — it is a POSIX shell feature that Windows
 * `cmd.exe` does not parse — so passing the value through a spawned env is
 * both safer and cross-platform.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { resolveBin } from './lib/resolve-bin.mjs';

const ENVIRONMENTS = ['staging', 'production'];

const args = process.argv.slice(2);
const env = args.find((a) => !a.startsWith('-'));
const dryRun = args.includes('--dry-run');

if (!ENVIRONMENTS.includes(env)) {
  console.error(`\n  Usage: node scripts/deploy.mjs <${ENVIRONMENTS.join('|')}> [--dry-run]\n`);
  process.exit(1);
}

const config = JSON.parse(readFileSync('deploy.config.json', 'utf8'));
const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? config[env]?.siteUrl;

if (!siteUrl) {
  console.error(`\n  No siteUrl for "${env}" in deploy.config.json.\n`);
  process.exit(1);
}

/*
 * Refuse the placeholder rather than deploying a site that advertises a
 * hostname which does not resolve. This is the whole point of the script.
 */
if (siteUrl.includes('WORKERS_SUBDOMAIN')) {
  console.error(
    `\n  deploy.config.json still has the WORKERS_SUBDOMAIN placeholder for "${env}":\n` +
      `\n    ${siteUrl}\n` +
      `\n  Find the account's subdomain with:\n` +
      `\n    npx wrangler subdomain get\n` +
      `\n  then replace WORKERS_SUBDOMAIN in deploy.config.json and commit it.` +
      `\n  Once a custom domain is live, set production.siteUrl to that instead.\n`,
  );
  process.exit(1);
}

try {
  new URL(siteUrl);
} catch {
  console.error(`\n  siteUrl for "${env}" is not a valid URL: ${siteUrl}\n`);
  process.exit(1);
}

/* Trailing slashes produce `https://host//en` in canonical tags. */
if (siteUrl.endsWith('/')) {
  console.error(`\n  siteUrl for "${env}" must not end in a slash: ${siteUrl}\n`);
  process.exit(1);
}

const openNextBin = resolveBin('@opennextjs/cloudflare', 'opennextjs-cloudflare');

console.log(`\n  environment        ${env}`);
console.log(`  NEXT_PUBLIC_SITE_URL  ${siteUrl}`);
console.log(`  worker             portfolio-${env}`);
console.log(`  mode               ${dryRun ? 'build only (no upload)' : 'build and deploy'}\n`);

/*
 * Discard the previous build before rebuilding.
 *
 * NEXT_PUBLIC_SITE_URL is baked into prerendered HTML, but Next's build cache
 * keys on source files — not on the environment. Changing only the site URL
 * leaves every input looking identical, so a warm `.next` is reused and the
 * new value never reaches the output.
 *
 * That is not theoretical: a staging deploy went out carrying canonical and
 * og:image URLs from an earlier test build, and served them live. Clearing
 * `.next` costs about a minute per deploy and is the difference between
 * shipping the URL you asked for and shipping the last one you used.
 */
rmSync('.next', { recursive: true, force: true });
rmSync('.open-next', { recursive: true, force: true });

const run = (args) =>
  execFileSync(process.execPath, [openNextBin, ...args], {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: siteUrl },
  });

try {
  /*
   * `build` then `deploy` as separate steps. `deploy` does not build — it
   * expects a compiled `.open-next` to already exist and fails outright
   * without one, which is why the clean above must be paired with an
   * explicit build rather than relying on the deploy command.
   */
  run(['build']);

  if (dryRun) {
    execFileSync(process.execPath, ['scripts/worker-size.mjs', '--env', env], { stdio: 'inherit' });
  } else {
    run(['deploy', '--', '--env', env]);
  }
} catch {
  /* The child already printed whatever went wrong; do not bury it in a stack. */
  process.exit(1);
}
