import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { logger } from '../utils/logger';

test.describe('Product filters and sorting @regression', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await test.step('Open the product catalogue', async () => {
      await homePage.goto();
    });
  });

  test('filters by category', async () => {
    let category = '';
    await test.step('Select a product category', async () => {
      category = await homePage.selectFirstCategory();
      expect(category).not.toBe('');
    });
    await test.step('Verify matching products are displayed', async () => {
      await expect.poll(() => homePage.productNamesText()).not.toHaveLength(0);
      await expect.poll(() => homePage.productNamesText()).toEqual(expect.arrayContaining([expect.any(String)]));
    });
    logger.info(`Selected category: ${category}`);
  });

  test('filters by brand', async () => {
    await test.step('Select the ForgeFlex Tools brand', async () => {
      await homePage.selectBrand('ForgeFlex Tools');
    });
    await test.step('Verify matching products are displayed', async () => {
      await expect.poll(() => homePage.productNamesText()).not.toHaveLength(0);
    });
    logger.info('Selected brand: ForgeFlex Tools');
  });

  test('sorts prices low to high', async () => {
    await test.step('Sort products by price ascending', async () => {
      await homePage.selectSort('Price (Low - High)');
      await expect.poll(() => homePage.productPricesAreSorted(true), { timeout: 15_000 }).toBe(true);
    });
  });

  test('sorts prices high to low', async () => {
    await test.step('Sort products by price descending', async () => {
      await homePage.selectSort('Price (High - Low)');
      await expect.poll(() => homePage.productPricesAreSorted(false), { timeout: 15_000 }).toBe(true);
    });
  });

  test('sorts names A to Z', async () => {
    await test.step('Sort product names A to Z', async () => {
      await homePage.selectSort('Name (A - Z)');
      await expect.poll(() => homePage.productNamesAreSorted(true), { timeout: 15_000 }).toBe(true);
    });
  });

  test('sorts names Z to A', async () => {
    await test.step('Sort product names Z to A', async () => {
      await homePage.selectSort('Name (Z - A)');
      await expect.poll(() => homePage.productNamesAreSorted(false), { timeout: 15_000 }).toBe(true);
    });
  });
});
