import { Page, Locator } from '@playwright/test';

export class PaymentsPage {
  readonly page: Page;
  readonly paymentForm: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvvInput: Locator;
  readonly cardholderNameInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly paymentsList: Locator;
  readonly paymentItem: Locator;
  readonly amountInput: Locator;
  readonly currencySelect: Locator;
  readonly descriptionInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentForm = page.locator('[data-testid="payment-form"]');
    this.cardNumberInput = page.locator('[data-testid="card-number"]');
    this.expiryDateInput = page.locator('[data-testid="expiry-date"]');
    this.cvvInput = page.locator('[data-testid="cvv"]');
    this.cardholderNameInput = page.locator('[data-testid="cardholder-name"]');
    this.amountInput = page.locator('[data-testid="amount"]');
    this.currencySelect = page.locator('[data-testid="currency"]');
    this.descriptionInput = page.locator('[data-testid="description"]');
    this.submitButton = page.locator('[data-testid="submit-payment"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.paymentsList = page.locator('[data-testid="payments-list"]');
    this.paymentItem = page.locator('[data-testid="payment-item"]');
  }

  async navigateToPayments(): Promise<void> {
    await this.page.goto('/payments');
  }

  async fillPaymentForm(
    cardNumber: string,
    expiryDate: string,
    cvv: string,
    cardholderName: string,
    amount: string,
    currency: string = 'USD',
    description: string = ''
  ): Promise<void> {
    await this.cardNumberInput.fill(cardNumber);
    await this.expiryDateInput.fill(expiryDate);
    await this.cvvInput.fill(cvv);
    await this.cardholderNameInput.fill(cardholderName);
    await this.amountInput.fill(amount);
    await this.currencySelect.selectOption(currency);
    if (description) {
      await this.descriptionInput.fill(description);
    }
  }

  async submitPayment(): Promise<void> {
    await this.submitButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getPaymentsList(): Promise<string[]> {
    const items = await this.paymentItem.all();
    const payments: string[] = [];
    for (const item of items) {
      const text = await item.textContent();
      if (text) {
        payments.push(text);
      }
    }
    return payments;
  }

  async getPaymentCount(): Promise<number> {
    return await this.paymentItem.count();
  }

  async waitForSuccessMessage(): Promise<void> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
  }

  async waitForErrorMessage(): Promise<void> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
  }

  async isPaymentFormVisible(): Promise<boolean> {
    return await this.paymentForm.isVisible();
  }

  async clearForm(): Promise<void> {
    await this.cardNumberInput.clear();
    await this.expiryDateInput.clear();
    await this.cvvInput.clear();
    await this.cardholderNameInput.clear();
    await this.amountInput.clear();
    await this.descriptionInput.clear();
  }
}
