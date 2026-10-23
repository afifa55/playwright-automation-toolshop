import { Page } from '@playwright/test';

export class ContactPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/contact');
  }

  async submitContactForm(name: string, email: string, subject: string, message: string): Promise<void> {
    const [firstName, lastName] = name.split(' ');
    await this.page.getByLabel('First name').fill(firstName);
    await this.page.getByLabel('Last name').fill(lastName ?? '');
    await this.page.getByLabel('Email address').fill(email);
    await this.page.getByLabel('Subject').selectOption({ label: subject });
    await this.page.getByLabel(/message/i).fill(message);
    await this.page.getByRole('button', { name: /^send$/i }).click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.page.getByRole('button', { name: /^send$/i }).click();
  }

  async formFeedback(): Promise<string> {
    return (await this.page.getByRole('alert').allTextContents()).join(' ').trim();
  }

  async validationMessage(): Promise<string> {
    return (await this.page.getByRole('alert').allTextContents()).join(' ').trim();
  }
}
