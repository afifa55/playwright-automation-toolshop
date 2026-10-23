import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { registeredUser, type UserCredentials } from '../test-data/users';
import { logger } from '../utils/logger';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login @smoke @regression', () => {
  let loginPage: LoginPage;
  let user: UserCredentials;

  test.beforeAll(async () => {
    user = await registeredUser();
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await test.step('Open the login page', async () => {
      await loginPage.goto();
    });
  });

  test('logs in with valid credentials', async () => {
    await test.step('Submit valid account credentials', async () => {
      await loginPage.login(user.email, user.password);
    });
    await test.step('Verify the account is logged in', async () => {
      await expect.poll(() => loginPage.isLoggedIn()).toBe(true);
    });
    logger.info(`Logged in as ${user.email}`);
  });

  test('rejects an invalid password', async () => {
    await test.step('Submit the account with an incorrect password', async () => {
      await loginPage.login(user.email, 'incorrect-password');
    });
    await test.step('Verify the invalid-credentials message', async () => {
      await expect.poll(() => loginPage.errorMessage()).toMatch(/invalid email or password/i);
    });
  });

  test('validates empty required fields', async () => {
    await test.step('Submit the login form with empty fields', async () => {
      await loginPage.submitEmptyForm();
    });
    await test.step('Verify required-field validation is shown', async () => {
      await expect.poll(() => loginPage.requiredFieldMessage()).not.toBe('');
    });
  });

  test('allows a logged-in user to log out', async () => {
    await test.step('Log in with the valid account', async () => {
      await loginPage.login(user.email, user.password);
      await expect.poll(() => loginPage.isLoggedIn()).toBe(true);
    });
    await test.step('Sign out and verify the login form is shown', async () => {
      await loginPage.logout();
      await expect.poll(() => loginPage.isLoginPage()).toBe(true);
    });
  });
});
