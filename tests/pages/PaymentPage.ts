import { Page, Locator } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly amountInput: Locator;
  readonly currencySelect: Locator;
  readonly cardNumberInput: Locator;
  readonly cardholderNameInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly cvvInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly paymentForm: Locator;
  readonly paymentHistory: Locator;
  readonly paymentHistoryTable: Locator;
  readonly refundButton: Locator;
  readonly downloadReceiptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Form elements
    this.pageTitle = page.getByRole('heading', { name: /payment/i });
    this.amountInput = page.getByLabel(/amount/i);
    this.currencySelect = page.getByLabel(/currency/i);
    this.cardNumberInput = page.getByLabel(/card number/i);
    this.cardholderNameInput = page.getByLabel(/cardholder name/i);
    this.expiryMonthInput = page.getByLabel(/expiry month/i);
    this.expiryYearInput = page.getByLabel(/expiry year/i);
    this.cvvInput = page.getByLabel(/cvv/i);
    
    // Buttons
    this.submitButton = page.getByRole('button', { name: /submit|pay|process/i });
    this.cancelButton = page.getByRole('button', { name: /cancel|back/i });
    this.refundButton = page.getByRole('button', { name: /refund/i });
    this.downloadReceiptButton = page.getByRole('button', { name: /download|receipt/i });
    
    // Messages and containers
    this.successMessage = page.getByRole('alert').filter({ hasText: /success|completed|approved/i });
    this.errorMessage = page.getByRole('alert').filter({ hasText: /error|failed|invalid/i });
    this.paymentForm = page.getByRole('form');
    this.paymentHistory = page.getByRole('region', { name: /history|transactions/i });
    this.paymentHistoryTable = page.getByRole('table');
  }

  /**
   * Navigate to the payment page
   */
  async goto() {
    await this.page.goto('/payments');
  }

  /**
   * Fill in the payment form with provided details
   */
  async fillPaymentForm(paymentData: {
    amount: number;
    currency: string;
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  }) {
    await this.amountInput.fill(paymentData.amount.toString());
    await this.currencySelect.selectOption(paymentData.currency);
    await this.cardNumberInput.fill(paymentData.cardNumber);
    await this.cardholderNameInput.fill(paymentData.cardholderName);
    await this.expiryMonthInput.fill(paymentData.expiryMonth);
    await this.expiryYearInput.fill(paymentData.expiryYear);
    await this.cvvInput.fill(paymentData.cvv);
  }

  /**
   * Submit the payment form
   */
  async submitPayment() {
    await this.submitButton.click();
  }

  /**
   * Process a complete payment
   */
  async processPayment(paymentData: {
    amount: number;
    currency: string;
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  }) {
    await this.fillPaymentForm(paymentData);
    await this.submitPayment();
  }

  /**
   * Cancel the payment form
   */
  async cancelPayment() {
    await this.cancelButton.click();
  }

  /**
   * Get the success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Clear the payment form
   */
  async clearForm() {
    await this.amountInput.clear();
    await this.cardNumberInput.clear();
    await this.cardholderNameInput.clear();
    await this.expiryMonthInput.clear();
    await this.expiryYearInput.clear();
    await this.cvvInput.clear();
  }

  /**
   * Get the current amount value
   */
  async getAmountValue(): Promise<string> {
    return await this.amountInput.inputValue();
  }

  /**
   * Get the current card number value
   */
  async getCardNumberValue(): Promise<string> {
    return await this.cardNumberInput.inputValue();
  }

  /**
   * Check if submit button is enabled
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }

  /**
   * Check if payment history is visible
   */
  async isPaymentHistoryVisible(): Promise<boolean> {
    return await this.paymentHistory.isVisible();
  }

  /**
   * Get payment history rows
   */
  async getPaymentHistoryRows() {
    return await this.paymentHistoryTable.getByRole('row').all();
  }

  /**
   * Refund a payment
   */
  async refundPayment() {
    await this.refundButton.click();
  }

  /**
   * Download receipt
   */
  async downloadReceipt() {
    await this.downloadReceiptButton.click();
  }

  /**
   * Wait for success message to appear
   */
  async waitForSuccessMessage(timeout: number = 5000) {
    await this.successMessage.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for error message to appear
   */
  async waitForErrorMessage(timeout: number = 5000) {
    await this.errorMessage.waitFor({ state: 'visible', timeout });
  }
}
