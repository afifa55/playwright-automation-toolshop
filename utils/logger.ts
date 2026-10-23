import { test } from '@playwright/test';

export const logger = {
  info(message: string): void {
    const { project, title } = test.info();
    console.info(`[INFO] [${project.name}] ${title}: ${message}`);
  },
};
