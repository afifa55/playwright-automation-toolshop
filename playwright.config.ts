import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const authFile = path.resolve(__dirname, 'playwright', '.auth', 'user.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://practicesoftwaretesting.com',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'auth-setup',
      testMatch: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: 'chromium',
      dependencies: ['auth-setup'],
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: authFile },
    },

    {
      name: 'firefox',
      dependencies: ['auth-setup'],
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Firefox'], storageState: authFile },
    },

    {
      name: 'webkit',
      dependencies: ['auth-setup'],
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Safari'], storageState: authFile },
    },
  ],
});
