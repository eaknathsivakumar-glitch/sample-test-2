import { test, expect } from '@playwright/test';
import { PaymentPage } from '../pages/PaymentPage';
import paymentData from '../fixtures/payment-data.json';

test.describe('Payments', () => {
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    paymentPage = new PaymentPage(page);
    await paymentPage.goto();
  });

  test.describe('Valid Payments', () => {
    // TC001: Process valid payment with correct card details
    test('should process valid payment with correct card details', async ({ page }) => {
      const payment = paymentData.validPayments[0];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.submitPayment();
      await paymentPage.waitForSuccessMessage();

      const isSuccessVisible = await paymentPage.isSuccessMessageVisible();
      expect(isSuccessVisible).toBe(true);

      const successMessage = await paymentPage.getSuccessMessage();
      expect(successMessage).toMatch(/success|completed|approved/i);
    });

    // TC002: Process valid payment with different currency
    test('should process valid payment with different currency', async ({ page }) => {
      const payment = paymentData.validPayments[1];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.submitPayment();
      await paymentPage.waitForSuccessMessage();

      const isSuccessVisible = await paymentPage.isSuccessMessageVisible();
      expect(isSuccessVisible).toBe(true);
    });

    // TC003: Process valid payment with high amount
    test('should process valid payment with high amount', async ({ page }) => {
      const payment = paymentData.validPayments[2];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.submitPayment();
      await paymentPage.waitForSuccessMessage();

      const isSuccessVisible = await paymentPage.isSuccessMessageVisible();
      expect(isSuccessVisible).toBe(true);
    });
  });

  test.describe('Invalid Payments', () => {
    // TC004: Reject payment with invalid card number
    test('should reject payment with invalid card number', async ({ page }) => {
      const payment = paymentData.invalidPayments[0];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.submitPayment();
      await paymentPage.waitForErrorMessage();

      const isErrorVisible = await paymentPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);

      const errorMessage = await paymentPage.getErrorMessage();
      expect(errorMessage).toMatch(/invalid|error|failed/i);
    });

    // TC005: Reject payment with expired card
    test('should reject payment with expired card', async ({ page }) => {
      const payment = paymentData.invalidPayments[1];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.submitPayment();
      await paymentPage.waitForErrorMessage();

      const isErrorVisible = await paymentPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);

      const errorMessage = await paymentPage.getErrorMessage();
      expect(errorMessage).toMatch(/expired|invalid|error/i);
    });

    // TC006: Reject payment with invalid CVV
    test('should reject payment with invalid CVV', async ({ page }) => {
      const payment = paymentData.invalidPayments[2];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.submitPayment();
      await paymentPage.waitForErrorMessage();

      const isErrorVisible = await paymentPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);

      const errorMessage = await paymentPage.getErrorMessage();
      expect(errorMessage).toMatch(/cvv|invalid|error/i);
    });
  });

  test.describe('Edge Cases', () => {
    // TC007: Process payment with minimum valid amount
    test('should process payment with minimum valid amount', async ({ page }) => {
      const payment = paymentData.edgeCases[0];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.submitPayment();
      await paymentPage.waitForSuccessMessage();

      const isSuccessVisible = await paymentPage.isSuccessMessageVisible();
      expect(isSuccessVisible).toBe(true);
    });

    // TC008: Process payment with maximum valid amount
    test('should process payment with maximum valid amount', async ({ page }) => {
      const payment = paymentData.edgeCases[1];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.submitPayment();
      await paymentPage.waitForSuccessMessage();

      const isSuccessVisible = await paymentPage.isSuccessMessageVisible();
      expect(isSuccessVisible).toBe(true);
    });

    // TC009: Reject payment with negative amount
    test('should reject payment with negative amount', async ({ page }) => {
      const payment = paymentData.edgeCases[2];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.submitPayment();
      await paymentPage.waitForErrorMessage();

      const isErrorVisible = await paymentPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);

      const errorMessage = await paymentPage.getErrorMessage();
      expect(errorMessage).toMatch(/invalid|amount|error/i);
    });
  });

  test.describe('Form Interactions', () => {
    // FROM CODE: Form validation and interaction patterns
    test('should enable submit button only when form is valid', async ({ page }) => {
      // Initially, submit button should be disabled
      let isEnabled = await paymentPage.isSubmitButtonEnabled();
      expect(isEnabled).toBe(false);

      // Fill form with valid data
      const payment = paymentData.validPayments[0];
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      // Submit button should now be enabled
      isEnabled = await paymentPage.isSubmitButtonEnabled();
      expect(isEnabled).toBe(true);
    });

    // FROM CODE: Cancel button functionality
    test('should cancel payment and clear form', async ({ page }) => {
      const payment = paymentData.validPayments[0];
      
      await paymentPage.fillPaymentForm({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      // Verify form is filled
      let amountValue = await paymentPage.getAmountValue();
      expect(amountValue).toBe(payment.amount.toString());

      // Cancel payment
      await paymentPage.cancelPayment();

      // Verify we're back at the payment page (not submitted)
      await expect(page).toHaveURL(/payments/);
    });

    // FROM CODE: Form field validation
    test('should validate amount field', async ({ page }) => {
      const amountInput = paymentPage.amountInput;
      
      // Test with invalid amount
      await amountInput.fill('-100');
      await paymentPage.submitPayment();
      
      const isErrorVisible = await paymentPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);
    });
  });

  test.describe('Payment History', () => {
    // FROM CODE: Payment history tracking
    test('should display payment in history after successful payment', async ({ page }) => {
      const payment = paymentData.validPayments[0];
      
      // Process payment
      await paymentPage.processPayment({
        amount: payment.amount,
        currency: payment.currency,
        cardNumber: payment.cardNumber,
        cardholderName: payment.cardholderName,
        expiryMonth: payment.expiryMonth,
        expiryYear: payment.expiryYear,
        cvv: payment.cvv,
      });

      await paymentPage.waitForSuccessMessage();

      // Check if payment history is visible
      const isHistoryVisible = await paymentPage.isPaymentHistoryVisible();
      expect(isHistoryVisible).toBe(true);

      // Verify payment appears in history
      const historyRows = await paymentPage.getPaymentHistoryRows();
      expect(historyRows.length).toBeGreaterThan(0);
    });
  });
});
