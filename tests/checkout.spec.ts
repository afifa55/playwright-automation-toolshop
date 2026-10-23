import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { logger } from '../utils/logger';

test.describe('Checkout @regression', () => {
  test('completes checkout as a logged-in user', async ({ page }) => {
    let itemCount = 0;
    const loginPage = new LoginPage(page);
    await test.step('Verify the saved customer session is active', async () => {
      await new HomePage(page).goto();
      await expect.poll(() => loginPage.isLoggedIn()).toBe(true);
    });

    const homePage = new HomePage(page);
    await test.step('Add a product to the cart', async () => {
      await homePage.goto();
      await homePage.openFirstAvailableProduct();
      await new ProductPage(page).addToCart();
    });

    const cartPage = new CartPage(page);
    await test.step('Open the cart and proceed to checkout', async () => {
      await cartPage.goto();
      await expect.poll(() => cartPage.itemCount()).toBeGreaterThan(0);
      itemCount = await cartPage.itemCount();
      await cartPage.continueToCheckout();
    });
    const checkoutPage = new CheckoutPage(page);
    await test.step('Proceed from sign-in to billing', async () => {
      await checkoutPage.proceedToBilling();
    });
    await test.step('Complete billing and verify the next checkout stage', async () => {
      await checkoutPage.fillBillingDetails();
      await checkoutPage.submitBillingStep();
      await expect.poll(() => checkoutPage.checkoutText()).toMatch(/payment|confirm|order|checkout/i);
    });
    logger.info(`Cart contained ${itemCount} items before checkout`);
  });

  test('validates required billing fields', async ({ page }) => {
    const homePage = new HomePage(page);
    await test.step('Add a product to the cart', async () => {
      await homePage.goto();
      await homePage.openFirstAvailableProduct();
      await new ProductPage(page).addToCart();
    });

    const cartPage = new CartPage(page);
    await test.step('Open the cart and proceed to billing', async () => {
      await cartPage.goto();
      await expect.poll(() => cartPage.itemCount()).toBeGreaterThan(0);
      await cartPage.continueToCheckout();
    });
    const checkoutPage = new CheckoutPage(page);
    await test.step('Proceed from sign-in to billing', async () => {
      await checkoutPage.proceedToBilling();
    });
    await test.step('Submit billing without required fields', async () => {
      await expect.poll(() => checkoutPage.isBillingContinueDisabled()).toBe(true);
    });
  });
});
