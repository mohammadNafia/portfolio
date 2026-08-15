import { defineConfig, devices } from '@playwright/test';

// Tests run against the production build, not the hot-reload dev server.
const PORT = 3211;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  // Axe scans are heavy; four workers against a single next-start server made
  // the accessibility assertions flake on whichever route lost the race.
  workers: process.env['CI'] ? 1 : 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // The mobile and reduced-motion suites define their own environments.
      testIgnore: /(mobile|reduced-motion|cross-browser)\.spec\.ts/,
    },
    {
      name: 'reduced-motion',
      use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce' },
      testMatch: /reduced-motion\.spec\.ts/,
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14 Pro'] },
      testMatch: /(mobile|screenshots)\.spec\.ts/,
    },
    {
      // Cross-browser smoke: rendering and core flows, not the full matrix.
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /cross-browser\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /cross-browser\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npx next start -p 3211',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
