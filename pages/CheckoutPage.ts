import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async proceedToBilling(): Promise<void> {
    await this.page.getByRole('button', { name: /proceed to checkout/i }).click();
  }

  async fillBillingDetails(): Promise<void> {
    await this.page.getByLabel('Country').selectOption({ label: 'Canada' });
    await this.page.getByLabel('Postal code').fill('M5V 2T6');
    await this.page.getByLabel('House number').fill('100');
  }

  async submitBillingStep(): Promise<void> {
    await this.page.getByRole('button', { name: /proceed to checkout/i }).click();
  }

  async isBillingContinueDisabled(): Promise<boolean> {
    return this.page.getByRole('button', { name: /proceed to checkout/i }).isDisabled();
  }

  async checkoutText(): Promise<string> {
    return this.page.locator('body').innerText();
  }
}
