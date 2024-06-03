import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testMatch: /\.axe-test.ts(x){0,1}$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], hasTouch: true },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], hasTouch: true },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], hasTouch: true },
    },
  ],
};

export default config;
