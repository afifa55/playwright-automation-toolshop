import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  private get productNames(): Locator {
    return this.page.getByTestId('product-name');
  }

  async searchFor(term: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Search' }).fill(term);
    await this.page.getByRole('button', { name: 'Search' }).click();
  }

  async selectSort(option: string): Promise<void> {
    await expect(this.productNames.first()).toBeVisible();
    await expect(this.page.getByTestId('product-price').first()).toBeVisible();
    await this.page.getByRole('combobox', { name: 'sort' }).selectOption({ label: option });
  }

  async productNamesText(): Promise<string[]> {
    return (await this.productNames.allTextContents()).map((name) => name.trim());
  }

  async productPrices(): Promise<number[]> {
    const prices = await this.page.getByTestId('product-price').allTextContents();
    return prices.map((price) => Number(price.replace(/[^\d.]/g, ''))).filter(Number.isFinite);
  }

  async productNamesAreSorted(ascending: boolean): Promise<boolean> {
    const names = await this.productNamesText();
    const expected = [...names].sort((left, right) => left.localeCompare(right));
    if (!ascending) expected.reverse();
    return names.length > 0 && names.every((name, index) => name === expected[index]);
  }

  async productPricesAreSorted(ascending: boolean): Promise<boolean> {
    const prices = await this.productPrices();
    const expected = [...prices].sort((left, right) => ascending ? left - right : right - left);
    return prices.length > 0 && prices.every((price, index) => price === expected[index]);
  }

  async hasProduct(name: string): Promise<boolean> {
    return this.productNames.filter({ hasText: name }).first().isVisible();
  }

  async openFirstAvailableProduct(excludedNames: string[] = []): Promise<string> {
    await expect(this.productNames.first()).toBeVisible();
    const productCount = await this.productNames.count();
    for (let index = 0; index < productCount; index += 1) {
      const product = this.productNames.nth(index);
      const name = (await product.innerText()).trim();
      if (excludedNames.includes(name)) continue;

      await product.click();
      const addToCartButton = this.page.getByTestId('add-to-cart');
      await addToCartButton.waitFor();
      if (await addToCartButton.isEnabled()) return name;
      await this.goto();
    }
    throw new Error('No available products found in the current catalogue.');
  }

  async openProduct(name: string): Promise<void> {
    await this.productNames.filter({ hasText: name }).first().click();
  }

  async selectFirstCategory(): Promise<string> {
    const checkbox = this.page.getByRole('group', { name: 'Categories' }).getByRole('checkbox').first();
    const label = await checkbox.getAttribute('aria-label');
    await checkbox.check();
    return label ?? (await checkbox.locator('..').innerText()).trim();
  }

  async selectBrand(brand: string): Promise<void> {
    const checkbox = this.page.getByRole('group', { name: 'Brands' }).getByRole('checkbox', { name: brand, exact: true });
    await checkbox.check();
  }
}
