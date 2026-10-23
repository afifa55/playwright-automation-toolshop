import { Page } from '@playwright/test';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  password: string;
}

export class RegisterPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/auth/register');
  }

  async register(data: RegistrationData): Promise<void> {
    await this.page.getByTestId('first-name').fill(data.firstName);
    await this.page.getByTestId('last-name').fill(data.lastName);
    await this.page.getByLabel(/date of birth/i).fill(data.dateOfBirth);
    await this.page.getByLabel('Country').selectOption({ label: data.country });
    await this.page.getByLabel(/postal code/i).fill(data.postalCode);
    await this.page.getByLabel(/house number/i).fill(data.houseNumber);
    await this.page.getByLabel(/^street$/i).fill(data.street);
    await this.page.getByLabel(/^city$/i).fill(data.city);
    await this.page.getByLabel(/^state$/i).fill(data.state);
    await this.page.getByLabel(/phone/i).fill(data.phone);
    await this.page.getByTestId('email').fill(data.email);
    await this.page.getByTestId('password').fill(data.password);
    await this.page.getByRole('button', { name: /register|create account/i }).click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.page.getByRole('button', { name: /register|create account/i }).click();
  }

  async fillInvalidEmailAndSubmit(email: string): Promise<void> {
    await this.page.getByTestId('email').fill(email);
    await this.page.getByRole('button', { name: /register|create account/i }).click();
  }

  async invalidEmailMessage(): Promise<string> {
    const message = this.page.getByText(/email format is invalid/i);
    return (await message.isVisible()) ? (await message.innerText()).trim() : '';
  }

  async validationMessage(): Promise<string> {
    const invalid = this.page.locator(':invalid').first();
    if (await invalid.count()) return invalid.evaluate((element: HTMLInputElement) => element.validationMessage);
    return (await this.page.locator('body').innerText()).trim();
  }

  async registrationSucceeded(): Promise<boolean> {
    const confirmation = this.page.getByText(/account.*created|successfully registered|registration successful/i);
    return (
      (await confirmation.isVisible()) ||
      (await this.page.getByRole('heading', { name: /^login$/i }).isVisible())
    );
  }
}
