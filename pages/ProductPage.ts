import { expect, Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  async detailsText(): Promise<string> {
    return this.page.locator('body').innerText();
  }

  async increaseQuantity(amount = 1): Promise<void> {
    for (let index = 0; index < amount; index += 1) {
      await this.page.getByRole('button', { name: /increase|plus/i }).click();
    }
  }

  async decreaseQuantity(amount = 1): Promise<void> {
    for (let index = 0; index < amount; index += 1) {
      await this.page.getByRole('button', { name: /decrease|minus/i }).click();
    }
  }

  async quantity(): Promise<string> {
    const input = this.page.getByRole('spinbutton');
    if (await input.count()) return input.inputValue();
    return (await this.page.getByTestId('quantity').innerText()).trim();
  }

  async addToCart(): Promise<void> {
    await this.page.getByTestId('add-to-cart').click();
    await expect(this.page.getByRole('alert')).toContainText(/product added to shopping cart/i);
  }

  async addToCartConfirmation(): Promise<string> {
    const confirmation = this.page.getByRole('alert');
    return (await confirmation.isVisible()) ? (await confirmation.innerText()).trim() : '';
  }
}
