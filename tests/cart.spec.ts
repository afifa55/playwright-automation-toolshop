import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { logger } from '../utils/logger';

test.describe('Shopping cart @smoke @regression', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let firstProductName: string;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    await test.step('Add a product and open the cart', async () => {
      await homePage.goto();
      firstProductName = await homePage.openFirstAvailableProduct();
      await productPage.addToCart();
      await cartPage.goto();
      await expect.poll(() => cartPage.itemCount()).toBeGreaterThan(0);
    });
  });

  test('contains multiple added items', async () => {
    let count = 0;
    await test.step('Add a second product to the cart', async () => {
      await homePage.goto();
      await homePage.openFirstAvailableProduct([firstProductName]);
      await productPage.addToCart();
      await cartPage.goto();
    });
    await test.step('Verify both products are in the cart', async () => {
      await expect.poll(() => cartPage.itemCount()).toBeGreaterThanOrEqual(2);
      count = await cartPage.itemCount();
    });
    logger.info(`Cart contains ${count} items`);
  });

  test('updates item quantity', async () => {
    await test.step('Set the first cart item quantity to two', async () => {
      await cartPage.setFirstItemQuantity(2);
    });
    await test.step('Verify the cart reflects the updated quantity', async () => {
      await expect.poll(() => cartPage.firstItemQuantity()).toBe('2');
    });
  });

  test('removes an item', async () => {
    await test.step('Remove the first cart item', async () => {
      await cartPage.removeFirstItem();
    });
    await test.step('Verify the cart is empty', async () => {
      await expect.poll(() => cartPage.itemCount()).toBe(0);
    });
  });

  test('shows a cart total', async () => {
    let total = '';
    await test.step('Verify the cart total is displayed', async () => {
      await expect.poll(() => cartPage.totalText()).toMatch(/[$€£]\s*\d/);
      total = await cartPage.totalText();
    });
    logger.info(`Displayed cart total: ${total}`);
  });
});
