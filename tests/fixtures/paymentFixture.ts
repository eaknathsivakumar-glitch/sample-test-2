import { test as base } from '@playwright/test';
import { PaymentsPage } from '../pages/PaymentsPage';

type PaymentFixtures = {
  paymentsPage: PaymentsPage;
};

export const test = base.extend<PaymentFixtures>({
  paymentsPage: async ({ page }, use) => {
    const paymentsPage = new PaymentsPage(page);
    await use(paymentsPage);
  },
});

export { expect } from '@playwright/test';
