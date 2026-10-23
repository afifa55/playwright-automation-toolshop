import { expect, test } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage';
import { logger } from '../utils/logger';

test.describe('Contact form @regression', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await test.step('Open the contact form', async () => {
      await contactPage.goto();
    });
  });

  test('submits a valid contact request', async () => {
    let feedback = '';
    await test.step('Fill in and submit a valid contact request', async () => {
      await contactPage.submitContactForm(
        'Taylor Tester',
        'taylor@example.com',
        'Customer service',
        'I need help with an order and would appreciate your guidance on the next steps.',
      );
    });
    await test.step('Verify the submission confirmation', async () => {
      await expect.poll(() => contactPage.formFeedback()).toMatch(/thanks for your message|success|message.*sent|thank you/i);
      feedback = await contactPage.formFeedback();
    });
    logger.info(`Contact form response: ${feedback}`);
  });

  test('validates required fields', async () => {
    await test.step('Submit the empty contact form', async () => {
      await contactPage.submitEmptyForm();
    });
    await test.step('Verify required-field messages are displayed', async () => {
      await expect.poll(() => contactPage.validationMessage()).not.toBe('');
    });
  });
});
