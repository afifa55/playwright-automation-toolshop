import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByTestId('email').fill(email);
    await this.page.getByTestId('password').fill(password);
    await this.page.getByRole('button', { name: /^login$/i }).click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.page.getByRole('button', { name: /^login$/i }).click();
  }

  async errorMessage(): Promise<string> {
    return (await this.page.locator('body').innerText()).trim();
  }

  async isLoggedIn(): Promise<boolean> {
    const accountButton = this.page.getByRole('menubar', { name: 'Main menu' }).getByRole('button').last();
    if (!(await accountButton.count())) return false;
    const accountName = (await accountButton.innerText()).trim();
    return accountName !== '' && !/^categories$/i.test(accountName);
  }

  async logout(): Promise<void> {
    const accountButton = this.page.getByRole('menubar', { name: 'Main menu' }).getByRole('button').last();
    await accountButton.click();
    await this.page.getByText(/^sign out$/i).click();
  }

  async isLoginPage(): Promise<boolean> {
    return this.page.getByTestId('email').isVisible();
  }

  async requiredFieldMessage(): Promise<string> {
    return (await this.page.getByText(/(?:email|password) is required/i).allTextContents()).join(' ');
  }
}
