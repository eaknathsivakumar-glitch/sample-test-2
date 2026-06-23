import { test, expect } from '@playwright/test';
import { PaymentsPage } from './pages/PaymentsPage';
import {
  validPaymentData,
  invalidCardData,
  expiredCardData,
  invalidCVVData,
  largeAmountData,
  multiCurrencyData,
} from './fixtures/paymentTestData';

test.describe('Payments Feature', () => {
  let paymentsPage: PaymentsPage;

  test.beforeEach(async ({ page }) => {
    paymentsPage = new PaymentsPage(page);
    await paymentsPage.goto();
    // Verify payment form is loaded
    await expect(page.getByRole('heading', { name: /payment/i })).toBeVisible();
  });

  test.describe('Valid Payment Scenarios', () => {
    // TC001: Valid payment submission with correct card details
    test('TC001: Should successfully process payment with valid card details', async ({ page }) => {
      // Arrange
      const expectedSuccessMessage = /payment.*success|transaction.*completed|approved/i;

      // Act
      await paymentsPage.completePayment(
        validPaymentData.cardNumber,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        validPaymentData.cardholderName,
        validPaymentData.amount
      );

      // Assert
      await paymentsPage.verifySuccessMessage();
      const successText = await page.getByRole('alert').textContent();
      expect(successText).toMatch(expectedSuccessMessage);
    });

    // TC002: Payment with different currency
    test('TC002: Should process payment with USD currency', async ({ page }) => {
      // Arrange
      const usdData = multiCurrencyData[0];

      // Act
      await paymentsPage.selectCurrency(usdData.currency);
      await paymentsPage.completePayment(
        validPaymentData.cardNumber,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        validPaymentData.cardholderName,
        usdData.amount
      );

      // Assert
      await paymentsPage.verifySuccessMessage();
      const successText = await page.getByRole('alert').textContent();
      expect(successText).toBeTruthy();
    });

    // TC003: Payment with large amount
    test('TC003: Should process payment with large amount', async ({ page }) => {
      // Arrange
      const largeAmount = largeAmountData.amount;

      // Act
      await paymentsPage.completePayment(
        validPaymentData.cardNumber,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        validPaymentData.cardholderName,
        largeAmount
      );

      // Assert
      await paymentsPage.verifySuccessMessage();
    });
  });

  test.describe('Invalid Payment Scenarios', () => {
    // TC004: Payment with invalid card number
    test('TC004: Should reject payment with invalid card number', async ({ page }) => {
      // Arrange
      const expectedErrorPattern = /invalid.*card|card.*declined|invalid.*number/i;

      // Act
      await paymentsPage.completePayment(
        invalidCardData.cardNumber,
        invalidCardData.expiryDate,
        invalidCardData.cvv,
        invalidCardData.cardholderName,
        invalidCardData.amount
      );

      // Assert
      await paymentsPage.verifyErrorMessage();
      const errorText = await paymentsPage.getErrorMessageText();
      expect(errorText).toMatch(expectedErrorPattern);
    });

    // TC005: Payment with expired card
    test('TC005: Should reject payment with expired card', async ({ page }) => {
      // Arrange
      const expectedErrorPattern = /expired|card.*expired/i;

      // Act
      await paymentsPage.completePayment(
        expiredCardData.cardNumber,
        expiredCardData.expiryDate,
        expiredCardData.cvv,
        expiredCardData.cardholderName,
        expiredCardData.amount
      );

      // Assert
      await paymentsPage.verifyErrorMessage();
      const errorText = await paymentsPage.getErrorMessageText();
      expect(errorText).toMatch(expectedErrorPattern);
    });

    // TC006: Payment with invalid CVV
    test('TC006: Should reject payment with invalid CVV', async ({ page }) => {
      // Arrange
      const expectedErrorPattern = /invalid.*cvv|cvv.*invalid|security code/i;

      // Act
      await paymentsPage.completePayment(
        invalidCVVData.cardNumber,
        invalidCVVData.expiryDate,
        invalidCVVData.cvv,
        invalidCVVData.cardholderName,
        invalidCVVData.amount
      );

      // Assert
      await paymentsPage.verifyErrorMessage();
      const errorText = await paymentsPage.getErrorMessageText();
      expect(errorText).toMatch(expectedErrorPattern);
    });
  });

  test.describe('Form Validation', () => {
    // TC007: Empty card number field validation
    test('TC007: Should show validation error for empty card number', async ({ page }) => {
      // Arrange
      const emptyCardNumber = '';

      // Act
      await paymentsPage.cardNumberInput.fill(emptyCardNumber);
      await paymentsPage.expiryDateInput.fill(validPaymentData.expiryDate);
      await paymentsPage.cvvInput.fill(validPaymentData.cvv);
      await paymentsPage.cardholderNameInput.fill(validPaymentData.cardholderName);
      await paymentsPage.amountInput.fill(validPaymentData.amount);
      await paymentsPage.submitPayment();

      // Assert
      const validationError = page.getByText(/card number.*required|enter.*card/i);
      await expect(validationError).toBeVisible();
    });

    // TC008: Empty cardholder name validation
    test('TC008: Should show validation error for empty cardholder name', async ({ page }) => {
      // Arrange
      const emptyName = '';

      // Act
      await paymentsPage.cardNumberInput.fill(validPaymentData.cardNumber);
      await paymentsPage.expiryDateInput.fill(validPaymentData.expiryDate);
      await paymentsPage.cvvInput.fill(validPaymentData.cvv);
      await paymentsPage.cardholderNameInput.fill(emptyName);
      await paymentsPage.amountInput.fill(validPaymentData.amount);
      await paymentsPage.submitPayment();

      // Assert
      const validationError = page.getByText(/name.*required|cardholder.*required/i);
      await expect(validationError).toBeVisible();
    });

    // TC009: Invalid amount validation
    test('TC009: Should show validation error for zero or negative amount', async ({ page }) => {
      // Arrange
      const invalidAmount = '0';

      // Act
      await paymentsPage.cardNumberInput.fill(validPaymentData.cardNumber);
      await paymentsPage.expiryDateInput.fill(validPaymentData.expiryDate);
      await paymentsPage.cvvInput.fill(validPaymentData.cvv);
      await paymentsPage.cardholderNameInput.fill(validPaymentData.cardholderName);
      await paymentsPage.amountInput.fill(invalidAmount);
      await paymentsPage.submitPayment();

      // Assert
      const validationError = page.getByText(/amount.*must be|amount.*greater|invalid.*amount/i);
      await expect(validationError).toBeVisible();
    });
  });

  test.describe('UI/UX Tests', () => {
    // TC010: Payment form is visible on page load
    test('TC010: Should display payment form on page load', async ({ page }) => {
      // Assert
      const isVisible = await paymentsPage.isPaymentFormVisible();
      expect(isVisible).toBe(true);

      // Verify all required fields are present
      await expect(paymentsPage.cardNumberInput).toBeVisible();
      await expect(paymentsPage.expiryDateInput).toBeVisible();
      await expect(paymentsPage.cvvInput).toBeVisible();
      await expect(paymentsPage.cardholderNameInput).toBeVisible();
      await expect(paymentsPage.amountInput).toBeVisible();
      await expect(paymentsPage.submitButton).toBeVisible();
    });

    // TC011: Submit button is disabled when form is empty
    test('TC011: Should disable submit button when form is empty', async ({ page }) => {
      // Assert
      const isDisabled = await paymentsPage.submitButton.isDisabled();
      expect(isDisabled).toBe(true);
    });

    // TC012: Submit button is enabled when form is filled
    test('TC012: Should enable submit button when form is filled', async ({ page }) => {
      // Act
      await paymentsPage.fillPaymentForm(
        validPaymentData.cardNumber,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        validPaymentData.cardholderName,
        validPaymentData.amount
      );

      // Assert
      const isDisabled = await paymentsPage.submitButton.isDisabled();
      expect(isDisabled).toBe(false);
    });
  });

  test.describe('Payment Method Selection', () => {
    // TC013: Select credit card payment method
    test('TC013: Should allow selection of credit card payment method', async ({ page }) => {
      // Act
      await paymentsPage.selectPaymentMethod('credit_card');

      // Assert
      const selectedValue = await paymentsPage.paymentMethodSelect.inputValue();
      expect(selectedValue).toBe('credit_card');
    });

    // TC014: Form updates when payment method changes
    test('TC014: Should update form fields when payment method changes', async ({ page }) => {
      // Act
      await paymentsPage.selectPaymentMethod('credit_card');

      // Assert - Verify card-specific fields are visible
      await expect(paymentsPage.cardNumberInput).toBeVisible();
      await expect(paymentsPage.cvvInput).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    // TC015: Payment with minimum amount
    test('TC015: Should process payment with minimum valid amount', async ({ page }) => {
      // Arrange
      const minimumAmount = '0.01';

      // Act
      await paymentsPage.completePayment(
        validPaymentData.cardNumber,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        validPaymentData.cardholderName,
        minimumAmount
      );

      // Assert
      await paymentsPage.verifySuccessMessage();
    });

    // TC016: Card number with spaces should be accepted
    test('TC016: Should accept card number with spaces', async ({ page }) => {
      // Arrange
      const cardNumberWithSpaces = '4532 0151 1283 0366';

      // Act
      await paymentsPage.completePayment(
        cardNumberWithSpaces,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        validPaymentData.cardholderName,
        validPaymentData.amount
      );

      // Assert
      await paymentsPage.verifySuccessMessage();
    });

    // TC017: Cardholder name with special characters
    test('TC017: Should accept cardholder name with special characters', async ({ page }) => {
      // Arrange
      const specialCharName = "O'Brien-Smith";

      // Act
      await paymentsPage.completePayment(
        validPaymentData.cardNumber,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        specialCharName,
        validPaymentData.amount
      );

      // Assert
      await paymentsPage.verifySuccessMessage();
    });
  });

  test.describe('Multiple Currency Support', () => {
    // TC018: Process payment in EUR
    test('TC018: Should process payment in EUR currency', async ({ page }) => {
      // Arrange
      const eurData = multiCurrencyData[1];

      // Act
      await paymentsPage.selectCurrency(eurData.currency);
      await paymentsPage.completePayment(
        validPaymentData.cardNumber,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        validPaymentData.cardholderName,
        eurData.amount
      );

      // Assert
      await paymentsPage.verifySuccessMessage();
    });

    // TC019: Process payment in GBP
    test('TC019: Should process payment in GBP currency', async ({ page }) => {
      // Arrange
      const gbpData = multiCurrencyData[2];

      // Act
      await paymentsPage.selectCurrency(gbpData.currency);
      await paymentsPage.completePayment(
        validPaymentData.cardNumber,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        validPaymentData.cardholderName,
        gbpData.amount
      );

      // Assert
      await paymentsPage.verifySuccessMessage();
    });

    // TC020: Process payment in JPY
    test('TC020: Should process payment in JPY currency', async ({ page }) => {
      // Arrange
      const jpyData = multiCurrencyData[3];

      // Act
      await paymentsPage.selectCurrency(jpyData.currency);
      await paymentsPage.completePayment(
        validPaymentData.cardNumber,
        validPaymentData.expiryDate,
        validPaymentData.cvv,
        validPaymentData.cardholderName,
        jpyData.amount
      );

      // Assert
      await paymentsPage.verifySuccessMessage();
    });
  });
});
