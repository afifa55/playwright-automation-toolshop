import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { RegistrationData } from '../pages/RegisterPage';

export interface UserCredentials {
  email: string;
  password: string;
}

export async function registeredUser(): Promise<UserCredentials> {
  const credentialsFile = path.resolve(__dirname, '..', 'playwright', '.auth', 'credentials.json');
  const parsed: unknown = JSON.parse(await readFile(credentialsFile, 'utf8'));
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('email' in parsed) ||
    typeof parsed.email !== 'string' ||
    !('password' in parsed) ||
    typeof parsed.password !== 'string'
  ) {
    throw new Error(`Invalid registered-user credentials in ${credentialsFile}`);
  }
  return { email: parsed.email, password: parsed.password };
}

export function newRegistration(): RegistrationData {
  const id = randomUUID();
  return {
    firstName: 'Taylor',
    lastName: 'Tester',
    dateOfBirth: '1990-01-01',
    postalCode: 'M5V 2T6',
    houseNumber: '100',
    street: 'Main Street',
    city: 'Toronto',
    state: 'Ontario',
    country: 'Canada',
    phone: '5551234567',
    email: `taylor.tester.${id}@example.com`,
    password: `Toolshop!${id.slice(0, 8)}A9`,
  };
}

export const searchTerms = {
  valid: 'hammer',
  noResult: 'no-such-tool-987654',
};
