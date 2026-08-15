/**
 * Restart the production server on port 3211 and wait until it serves the
 * *current* build.
 *
 * `next start` keeps running after a rebuild but its in-memory HTML references
 * the previous CSS hash, so screenshots silently capture an unstyled page. This
 * kills whatever holds the port, restarts, and verifies the served stylesheet
 * actually resolves before returning.
 */
import { execSync, spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 3211;

function killPort() {
  try {
    const out = execSync(
      `powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort ${PORT} -State Listen -ErrorAction SilentlyContinue).OwningProcess"`,
      { encoding: 'utf8' },
    ).trim();
    for (const pid of out.split(/\s+/).filter(Boolean)) {
      execSync(`powershell -NoProfile -Command "Stop-Process -Id ${pid} -Force"`, {
        stdio: 'ignore',
      });
      console.log(`killed pid ${pid} on :${PORT}`);
    }
  } catch {
    // Nothing was listening.
  }
}

killPort();
await sleep(2000);

const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  stdio: 'ignore',
  shell: true,
  detached: true,
});
server.unref();

const base = `http://localhost:${PORT}`;
let ready = false;
for (let attempt = 0; attempt < 40; attempt += 1) {
  await sleep(1000);
  try {
    const html = await (await fetch(`${base}/en`)).text();

    /*
     * Every stylesheet, not just the first.
     *
     * The page links two: the font CSS and the app CSS. The font CSS is the
     * first one and its hash never changes, so checking only `match()[0]`
     * reported a fresh build while `next start` was still serving the previous
     * app CSS — which is the exact failure this script exists to catch.
     */
    const hrefs = [...new Set(html.match(/\/_next\/static\/css\/[a-z0-9]+\.css/g) ?? [])];
    if (hrefs.length < 2) continue;

    const results = await Promise.all(
      hrefs.map(async (href) => ({ href, ok: (await fetch(`${base}${href}`)).ok })),
    );
    const stale = results.filter((result) => !result.ok);
    if (stale.length === 0) {
      console.log(`ready — serving ${hrefs.length} stylesheets:`);
      for (const href of hrefs) console.log(`  ${href}`);
      ready = true;
      break;
    }
    console.log(`unresolvable: ${stale.map((result) => result.href).join(', ')}; retrying`);
  } catch {
    // Still starting.
  }
}

if (!ready) {
  console.error('server did not become ready with a resolvable stylesheet');
  process.exitCode = 1;
}
