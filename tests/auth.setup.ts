import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { newRegistration } from '../test-data/users';
import { logger } from '../utils/logger';

const authFile = path.resolve(__dirname, '..', 'playwright', '.auth', 'user.json');
const credentialsFile = path.resolve(__dirname, '..', 'playwright', '.auth', 'credentials.json');

test('registers a customer and saves the logged-in session', async ({ page }) => {
  const user = newRegistration();
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);

  await test.step('Register a unique customer account', async () => {
    await registerPage.goto();
    await registerPage.register(user);
    await expect.poll(() => registerPage.registrationSucceeded()).toBe(true);
  });

  await test.step('Log in once with the new account', async () => {
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await expect.poll(() => loginPage.isLoggedIn()).toBe(true);
  });

  await test.step('Save authenticated browser storage for feature specs', async () => {
    await mkdir(path.dirname(authFile), { recursive: true });
    await page.context().storageState({ path: authFile });
    await writeFile(credentialsFile, JSON.stringify({ email: user.email, password: user.password }));
  });

  logger.info('Registered customer and saved authenticated browser storage');
});
