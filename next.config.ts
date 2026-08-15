import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This project lives inside a directory that is itself under a parent git
  // repo with its own lockfile; pin tracing to this project explicitly.
  outputFileTracingRoot: __dirname,
  images: {
    /*
     * Cloudflare Workers have no request-time image optimizer, so widths are
     * resolved against variants rendered by `scripts/optimize-images.mjs`.
     * See `src/lib/image-loader.ts` for what that trades away.
     *
     * These two arrays are the exact rungs of LADDER in that script. The
     * loader can only return a file that was written, so a width listed here
     * but missing from the ladder would resolve to a 404.
     */
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    imageSizes: [64, 128, 168, 210, 256, 338, 420],
    /*
     * 1080 and above exist for the case-study hero, which fills the whole
     * `.shell` measure. Without them the widest width Next would ever request
     * for that slot is 840 — a 1080px box served an 840px file, soft on every
     * display including 1x. The loader clamps any of these down to the widest
     * variant a given source actually produced, so listing a width here never
     * forces an upscale.
     */
    deviceSizes: [640, 750, 840, 1080, 1440, 1920],
  },
  // Locale-less URLs are normalised by `src/middleware.ts`, which also honours
  // the stored language preference and Accept-Language.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
