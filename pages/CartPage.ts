import { Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  private get cartItems() {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('spinbutton') });
  }

  async goto(): Promise<void> {
    await this.page.getByRole('link', { name: /^cart\b/i }).click();
  }

  async cartText(): Promise<string> {
    return this.page.locator('body').innerText();
  }

  async firstItemQuantity(): Promise<string> {
    return (await this.firstItem()).getByRole('spinbutton').inputValue();
  }

  async itemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async setFirstItemQuantity(quantity: number): Promise<void> {
    const item = await this.firstItem();
    const quantityInput = item.getByRole('spinbutton');
    await quantityInput.fill(String(quantity));
    await quantityInput.press('Enter');
  }

  async removeFirstItem(): Promise<void> {
    const item = await this.firstItem();
    await item.getByRole('cell').last().locator('a').click();
  }

  async totalText(): Promise<string> {
    const taggedTotal = this.page.getByTestId('cart-total');
    if (await taggedTotal.count()) return (await taggedTotal.innerText()).trim();
    return (await this.page.getByText(/total/i).last().innerText()).trim();
  }

  async continueToCheckout(): Promise<void> {
    await this.page.getByRole('button', { name: /proceed to checkout|checkout|next/i }).click();
  }

  private async firstItem() {
    return this.cartItems.first();
  }
}
