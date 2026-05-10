import { test, expect } from './fixtures/paymentFixture';
import {
  validPaymentData,
  invalidCardNumberData,
  expiredCardData,
  invalidCVVData,
  largeAmountData,
  multiCurrencyData,
  emptyFieldsData,
} from './data/paymentTestData';

test.describe('Payments Feature', () => {
  test.beforeEach(async ({ paymentsPage }) => {
    // Navigate to payments page before each test
    await paymentsPage.navigateToPayments();
    // Wait for the payment form to be visible
    await expect(paymentsPage.paymentForm).toBeVisible();
  });

  test.describe('Valid Payment Scenarios', () => {
    test('TC001: Should successfully process a valid payment', async ({
      paymentsPage,
    }) => {
      // Arrange
      const { cardNumber, expiryDate, cvv, cardholderName, amount, currency, description } =
        validPaymentData;

      // Act
      await paymentsPage.fillPaymentForm(
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        amount,
        currency,
        description
      );
      await paymentsPage.submitPayment();

      // Assert
      await paymentsPage.waitForSuccessMessage();
      const isSuccessVisible = await paymentsPage.isSuccessMessageVisible();
      expect(isSuccessVisible).toBe(true);

      const successMessage = await paymentsPage.getSuccessMessage();
      expect(successMessage).toContain('Payment successful');
    });

    test('TC002: Should display payment in the payments list after successful submission', async ({
      paymentsPage,
    }) => {
      // Arrange
      const { cardNumber, expiryDate, cvv, cardholderName, amount, currency, description } =
        validPaymentData;
      const initialCount = await paymentsPage.getPaymentCount();

      // Act
      await paymentsPage.fillPaymentForm(
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        amount,
        currency,
        description
      );
      await paymentsPage.submitPayment();
      await paymentsPage.waitForSuccessMessage();

      // Assert
      const finalCount = await paymentsPage.getPaymentCount();
      expect(finalCount).toBeGreaterThan(initialCount);

      const paymentsList = await paymentsPage.getPaymentsList();
      expect(paymentsList.length).toBeGreaterThan(0);
    });

    test('TC003: Should accept multiple currency types', async ({ paymentsPage }) => {
      // Test with multiple currencies
      for (const paymentData of multiCurrencyData) {
        // Clear form for next iteration
        await paymentsPage.clearForm();

        // Act
        await paymentsPage.fillPaymentForm(
          paymentData.cardNumber,
          paymentData.expiryDate,
          paymentData.cvv,
          paymentData.cardholderName,
          paymentData.amount,
          paymentData.currency,
          paymentData.description
        );
        await paymentsPage.submitPayment();

        // Assert
        await paymentsPage.waitForSuccessMessage();
        const isSuccessVisible = await paymentsPage.isSuccessMessageVisible();
        expect(isSuccessVisible).toBe(true);
      }
    });

    test('TC004: Should handle large payment amounts', async ({ paymentsPage }) => {
      // Arrange
      const { cardNumber, expiryDate, cvv, cardholderName, amount, currency, description } =
        largeAmountData;

      // Act
      await paymentsPage.fillPaymentForm(
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        amount,
        currency,
        description
      );
      await paymentsPage.submitPayment();

      // Assert
      await paymentsPage.waitForSuccessMessage();
      const isSuccessVisible = await paymentsPage.isSuccessMessageVisible();
      expect(isSuccessVisible).toBe(true);
    });
  });

  test.describe('Invalid Payment Scenarios', () => {
    test('TC005: Should reject payment with invalid card number', async ({ paymentsPage }) => {
      // Arrange
      const { cardNumber, expiryDate, cvv, cardholderName, amount, currency, description } =
        invalidCardNumberData;

      // Act
      await paymentsPage.fillPaymentForm(
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        amount,
        currency,
        description
      );
      await paymentsPage.submitPayment();

      // Assert
      await paymentsPage.waitForErrorMessage();
      const isErrorVisible = await paymentsPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);

      const errorMessage = await paymentsPage.getErrorMessage();
      expect(errorMessage).toContain('Invalid card number');
    });

    test('TC006: Should reject payment with expired card', async ({ paymentsPage }) => {
      // Arrange
      const { cardNumber, expiryDate, cvv, cardholderName, amount, currency, description } =
        expiredCardData;

      // Act
      await paymentsPage.fillPaymentForm(
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        amount,
        currency,
        description
      );
      await paymentsPage.submitPayment();

      // Assert
      await paymentsPage.waitForErrorMessage();
      const isErrorVisible = await paymentsPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);

      const errorMessage = await paymentsPage.getErrorMessage();
      expect(errorMessage).toContain('Card expired');
    });

    test('TC007: Should reject payment with invalid CVV', async ({ paymentsPage }) => {
      // Arrange
      const { cardNumber, expiryDate, cvv, cardholderName, amount, currency, description } =
        invalidCVVData;

      // Act
      await paymentsPage.fillPaymentForm(
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        amount,
        currency,
        description
      );
      await paymentsPage.submitPayment();

      // Assert
      await paymentsPage.waitForErrorMessage();
      const isErrorVisible = await paymentsPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);

      const errorMessage = await paymentsPage.getErrorMessage();
      expect(errorMessage).toContain('Invalid CVV');
    });

    test('TC008: Should reject payment with empty required fields', async ({ paymentsPage }) => {
      // Arrange - Don't fill any fields

      // Act
      await paymentsPage.submitPayment();

      // Assert
      const isErrorVisible = await paymentsPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);

      const errorMessage = await paymentsPage.getErrorMessage();
      expect(errorMessage).toContain('Required fields');
    });
  });

  test.describe('Form Validation', () => {
    test('TC009: Should validate card number format', async ({ paymentsPage }) => {
      // Arrange
      const invalidCardNumber = 'abcd1234efgh5678';

      // Act
      await paymentsPage.cardNumberInput.fill(invalidCardNumber);
      await paymentsPage.submitPayment();

      // Assert
      const isErrorVisible = await paymentsPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);
    });

    test('TC010: Should validate expiry date format', async ({ paymentsPage }) => {
      // Arrange
      const invalidExpiryDate = '13/25'; // Invalid month

      // Act
      await paymentsPage.expiryDateInput.fill(invalidExpiryDate);
      await paymentsPage.submitPayment();

      // Assert
      const isErrorVisible = await paymentsPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);
    });

    test('TC011: Should validate CVV length', async ({ paymentsPage }) => {
      // Arrange
      const shortCVV = '12';

      // Act
      await paymentsPage.cvvInput.fill(shortCVV);
      await paymentsPage.submitPayment();

      // Assert
      const isErrorVisible = await paymentsPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);
    });

    test('TC012: Should validate amount is positive', async ({ paymentsPage }) => {
      // Arrange
      const negativeAmount = '-100.00';

      // Act
      await paymentsPage.amountInput.fill(negativeAmount);
      await paymentsPage.submitPayment();

      // Assert
      const isErrorVisible = await paymentsPage.isErrorMessageVisible();
      expect(isErrorVisible).toBe(true);
    });
  });

  test.describe('Payment Form UI', () => {
    test('TC013: Should display payment form with all required fields', async ({
      paymentsPage,
    }) => {
      // Assert
      expect(await paymentsPage.cardNumberInput).toBeVisible();
      expect(await paymentsPage.expiryDateInput).toBeVisible();
      expect(await paymentsPage.cvvInput).toBeVisible();
      expect(await paymentsPage.cardholderNameInput).toBeVisible();
      expect(await paymentsPage.amountInput).toBeVisible();
      expect(await paymentsPage.currencySelect).toBeVisible();
      expect(await paymentsPage.submitButton).toBeVisible();
    });

    test('TC014: Should clear form when clear button is clicked', async ({ paymentsPage }) => {
      // Arrange
      const { cardNumber, expiryDate, cvv, cardholderName, amount } = validPaymentData;

      // Act
      await paymentsPage.fillPaymentForm(
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        amount
      );
      await paymentsPage.clearForm();

      // Assert
      const cardNumberValue = await paymentsPage.cardNumberInput.inputValue();
      const expiryDateValue = await paymentsPage.expiryDateInput.inputValue();
      const cvvValue = await paymentsPage.cvvInput.inputValue();
      const cardholderNameValue = await paymentsPage.cardholderNameInput.inputValue();
      const amountValue = await paymentsPage.amountInput.inputValue();

      expect(cardNumberValue).toBe('');
      expect(expiryDateValue).toBe('');
      expect(cvvValue).toBe('');
      expect(cardholderNameValue).toBe('');
      expect(amountValue).toBe('');
    });

    test('TC015: Should display currency options', async ({ paymentsPage }) => {
      // Act
      const currencyOptions = await paymentsPage.currencySelect.locator('option').all();

      // Assert
      expect(currencyOptions.length).toBeGreaterThan(0);
    });
  });

  test.describe('Payment History', () => {
    test('TC016: Should display payment history list', async ({ paymentsPage }) => {
      // Assert
      const isPaymentsListVisible = await paymentsPage.paymentsList.isVisible();
      expect(isPaymentsListVisible).toBe(true);
    });

    test('TC017: Should update payment history after successful payment', async ({
      paymentsPage,
    }) => {
      // Arrange
      const { cardNumber, expiryDate, cvv, cardholderName, amount, currency, description } =
        validPaymentData;
      const initialCount = await paymentsPage.getPaymentCount();

      // Act
      await paymentsPage.fillPaymentForm(
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        amount,
        currency,
        description
      );
      await paymentsPage.submitPayment();
      await paymentsPage.waitForSuccessMessage();

      // Assert
      const finalCount = await paymentsPage.getPaymentCount();
      expect(finalCount).toBe(initialCount + 1);
    });
  });
});
