import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { logger } from '../utils/logger';

test.describe('Product details @smoke @regression', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    await test.step('Open the first product from the catalogue', async () => {
      await homePage.goto();
      await homePage.openFirstAvailableProduct();
    });
  });

  test('shows product details', async () => {
    await test.step('Verify the product details are displayed', async () => {
      await expect.poll(() => productPage.detailsText()).toMatch(/description|price|quantity/i);
    });
  });

  test('increases and decreases quantity', async () => {
    await test.step('Increase the quantity and verify it is two', async () => {
      await productPage.increaseQuantity();
      await expect.poll(() => productPage.quantity()).toBe('2');
    });
    await test.step('Decrease the quantity and verify it returns to one', async () => {
      await productPage.decreaseQuantity();
      await expect.poll(() => productPage.quantity()).toBe('1');
    });
  });

  test('adds a product to the cart', async () => {
    let confirmation = '';
    await test.step('Add the selected product to the cart', async () => {
      await homePage.goto();
      await homePage.openFirstAvailableProduct();
      await productPage.addToCart();
    });
    await test.step('Verify the add-to-cart confirmation', async () => {
      await expect.poll(() => productPage.addToCartConfirmation()).not.toBe('');
      confirmation = await productPage.addToCartConfirmation();
    });
    logger.info(`Add-to-cart response: ${confirmation}`);
  });
});
