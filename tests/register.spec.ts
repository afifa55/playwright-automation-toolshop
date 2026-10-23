import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { newRegistration } from '../test-data/users';
import { logger } from '../utils/logger';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Registration @regression', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await test.step('Open the registration page', async () => {
      await registerPage.goto();
    });
  });

  test('registers a new user with a unique email', async ({ page }) => {
    const user = newRegistration();
    await test.step('Register a user with unique credentials', async () => {
      await registerPage.register(user);
      await expect.poll(() => registerPage.registrationSucceeded()).toBe(true);
    });
    const loginPage = new LoginPage(page);
    await test.step('Verify the new account can log in', async () => {
      await loginPage.login(user.email, user.password);
      await expect.poll(() => loginPage.isLoggedIn()).toBe(true);
    });
    logger.info(`Registered and logged in as ${user.email}`);
  });

  test('validates required fields', async () => {
    await test.step('Submit the empty registration form', async () => {
      await registerPage.submitEmptyForm();
    });
    await test.step('Verify required-field validation is shown', async () => {
      await expect.poll(() => registerPage.validationMessage()).not.toBe('');
    });
  });

  test('rejects an invalid email format', async () => {
    await test.step('Submit a malformed email address', async () => {
      await registerPage.fillInvalidEmailAndSubmit('not-an-email');
    });
    await test.step('Verify the email-format validation message', async () => {
      await expect.poll(() => registerPage.invalidEmailMessage()).not.toBe('');
    });
  });
});
