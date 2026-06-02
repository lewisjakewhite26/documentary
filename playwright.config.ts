import { defineConfig, devices } from '@playwright/test';

const e2eEnv = {
  VITE_SUPABASE_URL: 'https://e2e-test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e2e-test-key-xx',
};

const previewHost = '127.0.0.1';
const previewPort = 4173;
const baseURL = `http://${previewHost}:${previewPort}`;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? `npm run preview -- --host ${previewHost} --port ${previewPort}`
      : `npm run build && npm run preview -- --host ${previewHost} --port ${previewPort}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: process.env.CI ? undefined : e2eEnv,
  },
});
