# Toolshop Playwright Test Automation

UI automation portfolio project for [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/), built with Playwright and TypeScript using the Page Object Model.

## Tech stack

- TypeScript
- Playwright Test
- Chromium, Firefox, and WebKit
- GitHub Actions

## Project structure

```text
pages/          Page Object Model classes, locators, and UI actions
tests/          Feature-based Playwright specs and assertions
test-data/      Reusable users and search terms
utils/          Shared test logger
.github/
  workflows/    Playwright GitHub Actions workflow
playwright.config.ts
tsconfig.json
playwright/.auth/  Generated authenticated browser storage (ignored by Git)
```

## Requirements and installation

- Node.js 20 or newer
- npm

Install the project dependencies and browser binaries:

```bash
npm install
npx playwright install
```

On Linux CI machines, install the browser operating-system dependencies as well:

```bash
npx playwright install --with-deps
```

## Running tests

```bash
npm test                  # Run all tests in Chromium, Firefox, and WebKit
npm run test:smoke         # Run tests tagged @smoke
npm run test:headed        # Run tests with a visible browser
npm run report             # Open the latest HTML report
npm run typecheck          # Run strict TypeScript checks
```

To run regression tests only:

```bash
npx playwright test --grep @regression
```

Tests tagged `@smoke` are also tagged `@regression`; the remaining feature tests are tagged `@regression`.

## Test configuration and reporting

The Playwright configuration sets the Toolshop base URL, runs each test project in Chromium, Firefox, and WebKit, and saves screenshots and traces for failed tests. The HTML report is written to `playwright-report/`.

Specs organize setup, UI actions, and assertions into named `test.step` entries. Contextual `logger.info` messages are written after the relevant steps, providing useful values such as selected filters, generated account email, search results, and cart or checkout status.

The `auth-setup` project runs first: it registers a unique customer, logs in once, and saves the authenticated browser storage and generated login credentials under `playwright/.auth/`. Feature tests reuse the saved session, and the positive login scenarios use the same generated account. Login and registration feature specs start with clean storage so their authentication and validation scenarios remain independent. Generated auth files are ignored by Git.

GitHub Actions runs the suite on pushes and pull requests, then uploads the HTML report as a workflow artifact even if tests fail.

## Test coverage

- **Login:** valid credentials, invalid password, required fields, and logout
- **Registration:** unique-email registration, required fields, and invalid email format
- **Search:** matching and no-result keywords
- **Filters and sorting:** category, brand, price ascending/descending, and name A-Z/Z-A
- **Product details:** product information, quantity increase/decrease, and add to cart
- **Cart:** multiple products, quantity updates, item removal, and total price
- **Checkout:** logged-in customer flow and required billing-field validation
- **Contact:** valid form submission and validation errors

The suite is UI-driven: page selectors and interactions stay in `pages/`, while specs use page methods and contain test setup, steps, and assertions.
