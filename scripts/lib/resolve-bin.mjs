import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Absolute path to a dependency's CLI entry point.
 *
 * Used instead of `npx`, which resolves to `npx.cmd` on Windows — and since
 * the CVE-2024-27980 fix Node refuses to execFile a `.cmd` without
 * `shell: true`, which in turn concatenates arguments rather than escaping
 * them (DEP0190). Naming the .js file avoids the shell entirely.
 *
 * Resolution is two-stage because a package's `exports` map may not expose
 * `./package.json` — `@opennextjs/cloudflare` maps `./*` to `./dist/api/*.js`,
 * so asking for its package.json yields a path that does not exist. When the
 * package graph refuses, fall back to walking `node_modules` upward, which is
 * how the file would be found on disk anyway.
 */
export function resolveBin(pkgName, binName = pkgName) {
  const require = createRequire(import.meta.url);
  let pkgDir;

  try {
    pkgDir = path.dirname(require.resolve(`${pkgName}/package.json`));
  } catch {
    let dir = process.cwd();

    for (;;) {
      const candidate = path.join(dir, 'node_modules', ...pkgName.split('/'));
      if (existsSync(path.join(candidate, 'package.json'))) {
        pkgDir = candidate;
        break;
      }

      const parent = path.dirname(dir);
      if (parent === dir) throw new Error(`Cannot locate "${pkgName}". Run \`npm install\`.`);
      dir = parent;
    }
  }

  const pkg = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
  const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.[binName];

  if (!bin) throw new Error(`"${pkgName}" declares no bin named "${binName}".`);

  return path.join(pkgDir, bin);
}
