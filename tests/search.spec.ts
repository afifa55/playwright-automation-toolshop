import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { searchTerms } from '../test-data/users';
import { logger } from '../utils/logger';

test.describe('Product search @smoke @regression', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await test.step('Open the product catalogue', async () => {
      await homePage.goto();
    });
  });

  test('finds products for a valid keyword', async () => {
    let productCount = 0;
    await test.step(`Search for "${searchTerms.valid}"`, async () => {
      await homePage.searchFor(searchTerms.valid);
    });
    await test.step('Verify matching products are shown', async () => {
      await expect.poll(() => homePage.productNamesText()).toContainEqual(expect.stringMatching(/hammer/i));
      productCount = (await homePage.productNamesText()).length;
    });
    logger.info(`Search returned ${productCount} products`);
  });

  test('shows no matching products for an unknown keyword', async () => {
    await test.step(`Search for "${searchTerms.noResult}"`, async () => {
      await homePage.searchFor(searchTerms.noResult);
    });
    await test.step('Verify no products match the search', async () => {
      await expect.poll(() => homePage.productNamesText()).toHaveLength(0);
    });
  });
});
