import { Page, Locator } from '@playwright/test';

export class PaymentsPage {
  readonly page: Page;
  readonly amountInput: Locator;
  readonly currencySelect: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly cvvInput: Locator;
  readonly cardholderNameInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Form inputs using role-based selectors
    this.amountInput = page.getByLabel(/amount/i);
    this.currencySelect = page.getByLabel(/currency/i);
    this.cardNumberInput = page.getByLabel(/card number/i);
    this.expiryMonthInput = page.getByLabel(/expiry month/i);
    this.expiryYearInput = page.getByLabel(/expiry year/i);
    this.cvvInput = page.getByLabel(/cvv|cvc/i);
    this.cardholderNameInput = page.getByLabel(/cardholder name/i);
    this.emailInput = page.getByLabel(/email/i);
    
    // Buttons
    this.submitButton = page.getByRole('button', { name: /submit|pay|process/i });
    
    // Messages
    this.successMessage = page.getByText(/success|payment successful|transaction completed/i);
    this.errorMessage = page.getByText(/error|failed|invalid/i);
    this.validationError = page.locator('[role="alert"]');
  }

  async goto() {
    await this.page.goto('/payments');
  }

  async fillPaymentForm(paymentData: {
    amount: number;
    currency: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
    email: string;
  }) {
    await this.amountInput.fill(paymentData.amount.toString());
    await this.currencySelect.selectOption(paymentData.currency);
    await this.cardNumberInput.fill(paymentData.cardNumber);
    await this.expiryMonthInput.fill(paymentData.expiryMonth);
    await this.expiryYearInput.fill(paymentData.expiryYear);
    await this.cvvInput.fill(paymentData.cvv);
    await this.cardholderNameInput.fill(paymentData.cardholderName);
    await this.emailInput.fill(paymentData.email);
  }

  async submitPayment() {
    await this.submitButton.click();
  }

  async isSuccessMessageVisible() {
    return await this.successMessage.isVisible();
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async getValidationErrors() {
    const errors = await this.validationError.all();
    return Promise.all(errors.map(error => error.textContent()));
  }

  async clearForm() {
    await this.amountInput.clear();
    await this.cardNumberInput.clear();
    await this.expiryMonthInput.clear();
    await this.expiryYearInput.clear();
    await this.cvvInput.clear();
    await this.cardholderNameInput.clear();
    await this.emailInput.clear();
  }

  async getAmountValue() {
    return await this.amountInput.inputValue();
  }

  async getCardNumberValue() {
    return await this.cardNumberInput.inputValue();
  }

  async getEmailValue() {
    return await this.emailInput.inputValue();
  }
}
