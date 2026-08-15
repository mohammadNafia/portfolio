/**
 * Report the built Worker size against the Cloudflare account limits.
 *
 *   node scripts/worker-size.mjs                 # defaults to production
 *   node scripts/worker-size.mjs --env staging
 *
 * The number that matters is the GZIP figure, not the raw bundle: Cloudflare
 * caps a Worker at 3 MiB compressed on the free plan and 10 MiB on paid, and
 * rejects the upload outright above it. Static assets are NOT counted — they
 * live in the asset store — so this measures only `.open-next/worker.js` and
 * whatever it pulls in.
 *
 * `wrangler deploy --dry-run` does a real bundle and prints both figures
 * without uploading anything, which makes it the honest source for this.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

/*
 * Resolved through the package graph rather than hard-coded, so a hoisted or
 * nested install still finds it. Resolution goes via `package.json` because
 * wrangler's `exports` map does not expose `bin/`, and reads the `bin` field
 * rather than assuming the filename.
 */
const require = createRequire(import.meta.url);
const wranglerPkgPath = require.resolve('wrangler/package.json');
const wranglerPkg = require(wranglerPkgPath);
const WRANGLER = path.join(path.dirname(wranglerPkgPath), wranglerPkg.bin.wrangler);

const MIB = 1024 * 1024;
const FREE_LIMIT = 3 * MIB;
const PAID_LIMIT = 10 * MIB;

/* Warn well before the cliff — a build that lands here is one dependency from failing. */
const WARN_AT = 0.8;

const envFlag = process.argv.indexOf('--env');
const env = envFlag === -1 ? 'production' : process.argv[envFlag + 1];

if (!existsSync('.open-next/worker.js')) {
  console.error('\n  No build found. Run `npm run cf:build` first.\n');
  process.exit(1);
}

let output;
try {
  /*
   * Run wrangler's entry point on this Node rather than going through `npx`.
   *
   * `npx` resolves to `npx.cmd` on Windows, and since the CVE-2024-27980 fix
   * Node refuses to execFile a `.cmd` without `shell: true` — which in turn
   * concatenates arguments instead of escaping them (DEP0190). Naming the .js
   * file sidesteps both.
   */
  output = execFileSync(
    process.execPath,
    [WRANGLER, 'deploy', '--dry-run', '--env', env],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
} catch (error) {
  console.error(`\n  wrangler dry-run failed:\n\n${error.stdout ?? ''}${error.stderr ?? ''}\n`);
  process.exit(1);
}

/* e.g. "Total Upload: 2464.62 KiB / gzip: 512.34 KiB" */
const match = output.match(/Total Upload:\s*([\d.]+)\s*KiB\s*\/\s*gzip:\s*([\d.]+)\s*KiB/i);

if (!match) {
  console.error('\n  Could not parse a size out of wrangler. Raw output:\n');
  console.error(output);
  process.exit(1);
}

const raw = Number(match[1]) * 1024;
const gzip = Number(match[2]) * 1024;
const pctFree = (gzip / FREE_LIMIT) * 100;

const mib = (bytes) => `${(bytes / MIB).toFixed(2)} MiB`;

console.log(`\n  Worker: portfolio-${env}\n`);
console.log(`    raw bundle       ${mib(raw)}`);
console.log(`    gzip (counted)   ${mib(gzip)}`);
console.log(`    free limit       ${mib(FREE_LIMIT)}   ${pctFree.toFixed(1)}% used`);
console.log(`    paid limit       ${mib(PAID_LIMIT)}   ${((gzip / PAID_LIMIT) * 100).toFixed(1)}% used`);

if (gzip > FREE_LIMIT) {
  console.error(`\n  OVER the free-tier limit by ${mib(gzip - FREE_LIMIT)}. This will not deploy on a free plan.\n`);
  process.exitCode = 1;
} else if (gzip > FREE_LIMIT * WARN_AT) {
  console.warn(`\n  Within ${(100 - pctFree).toFixed(1)}% of the free-tier ceiling. Worth watching.\n`);
} else {
  console.log(`\n  Comfortably under the free-tier ceiling.\n`);
}
