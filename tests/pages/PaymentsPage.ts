import { Page, Locator } from '@playwright/test';

/**
 * Payments Page Object Model
 * Encapsulates all interactions with the Payments feature
 */
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
  readonly amountInput: Locator;
  readonly currencySelect: Locator;
  readonly paymentMethodSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentForm = page.getByRole('form', { name: /payment/i });
    this.cardNumberInput = page.getByLabel(/card number/i);
    this.expiryDateInput = page.getByLabel(/expiry date|exp/i);
    this.cvvInput = page.getByLabel(/cvv|cvc/i);
    this.cardholderNameInput = page.getByLabel(/cardholder name|name on card/i);
    this.amountInput = page.getByLabel(/amount|total/i);
    this.currencySelect = page.getByLabel(/currency/i);
    this.paymentMethodSelect = page.getByLabel(/payment method/i);
    this.submitButton = page.getByRole('button', { name: /pay|submit|process/i });
    this.successMessage = page.getByRole('alert').filter({ hasText: /success|completed|approved/i });
    this.errorMessage = page.getByRole('alert').filter({ hasText: /error|failed|declined/i });
  }

  /**
   * Navigate to the payments page
   */
  async goto() {
    await this.page.goto('/payments');
  }

  /**
   * Fill in the payment form with card details
   * TC001: Valid payment submission
   */
  async fillPaymentForm(
    cardNumber: string,
    expiryDate: string,
    cvv: string,
    cardholderName: string,
    amount: string
  ) {
    await this.cardNumberInput.fill(cardNumber);
    await this.expiryDateInput.fill(expiryDate);
    await this.cvvInput.fill(cvv);
    await this.cardholderNameInput.fill(cardholderName);
    await this.amountInput.fill(amount);
  }

  /**
   * Submit the payment form
   */
  async submitPayment() {
    await this.submitButton.click();
  }

  /**
   * Complete a full payment flow
   */
  async completePayment(
    cardNumber: string,
    expiryDate: string,
    cvv: string,
    cardholderName: string,
    amount: string
  ) {
    await this.fillPaymentForm(cardNumber, expiryDate, cvv, cardholderName, amount);
    await this.submitPayment();
  }

  /**
   * Select payment method from dropdown
   */
  async selectPaymentMethod(method: string) {
    await this.paymentMethodSelect.selectOption(method);
  }

  /**
   * Select currency from dropdown
   */
  async selectCurrency(currency: string) {
    await this.currencySelect.selectOption(currency);
  }

  /**
   * Verify success message is displayed
   */
  async verifySuccessMessage() {
    await this.successMessage.waitFor({ state: 'visible' });
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible' });
  }

  /**
   * Get the error message text
   */
  async getErrorMessageText(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if payment form is visible
   */
  async isPaymentFormVisible(): Promise<boolean> {
    return await this.paymentForm.isVisible();
  }
}
