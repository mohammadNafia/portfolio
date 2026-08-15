import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/**
 * OpenNext adapter configuration.
 *
 * Deliberately minimal. The site is almost entirely prerendered — 22 routes,
 * of which only `/api/contact` and the `[...rest]` catch-all are dynamic — so
 * none of the optional caching layers (R2 incremental cache, D1 tag store,
 * Durable Object queue) buy anything here. They cost bindings, a paid R2
 * bucket, and configuration drift between the two environments.
 *
 * If ISR or on-demand revalidation is ever added, revisit this: that is the
 * point at which `incrementalCache` starts to matter.
 */
export default defineCloudflareConfig();
