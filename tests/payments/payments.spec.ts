import { test, expect } from '@playwright/test';
import { PaymentsPage } from '../pages/PaymentsPage';
import paymentsData from '../fixtures/payments.json';

test.describe('Payments Test Suite', () => {
  let paymentsPage: PaymentsPage;

  test.beforeEach(async ({ page }) => {
    paymentsPage = new PaymentsPage(page);
    await paymentsPage.goto();
  });

  test('should successfully process a valid payment with standard amount', async () => {
    // Arrange
    const paymentData = paymentsData.validPayment;

    // Act
    await paymentsPage.fillPaymentForm(paymentData);
    await paymentsPage.submitPayment();

    // Assert
    await expect(paymentsPage.successMessage).toBeVisible();
    const successText = await paymentsPage.successMessage.textContent();
    expect(successText).toContain('success');
  });

  test('should successfully process a payment with large amount', async () => {
    // Arrange
    const paymentData = paymentsData.largeAmountPayment;

    // Act
    await paymentsPage.fillPaymentForm(paymentData);
    await paymentsPage.submitPayment();

    // Assert
    await expect(paymentsPage.successMessage).toBeVisible();
    const amountValue = await paymentsPage.getAmountValue();
    expect(amountValue).toBe('9999.99');
  });

  test('should successfully process a payment with small amount', async () => {
    // Arrange
    const paymentData = paymentsData.smallAmountPayment;

    // Act
    await paymentsPage.fillPaymentForm(paymentData);
    await paymentsPage.submitPayment();

    // Assert
    await expect(paymentsPage.successMessage).toBeVisible();
    const amountValue = await paymentsPage.getAmountValue();
    expect(amountValue).toBe('0.99');
  });

  test('should reject payment with invalid card number', async () => {
    // Arrange
    const paymentData = paymentsData.invalidCardNumber;

    // Act
    await paymentsPage.fillPaymentForm(paymentData);
    await paymentsPage.submitPayment();

    // Assert
    await expect(paymentsPage.errorMessage).toBeVisible();
    const errorText = await paymentsPage.getErrorMessage();
    expect(errorText).toContain('invalid');
  });

  test('should reject payment with expired card', async () => {
    // Arrange
    const paymentData = paymentsData.expiredCard;

    // Act
    await paymentsPage.fillPaymentForm(paymentData);
    await paymentsPage.submitPayment();

    // Assert
    await expect(paymentsPage.errorMessage).toBeVisible();
    const errorText = await paymentsPage.getErrorMessage();
    expect(errorText?.toLowerCase()).toContain('expired');
  });

  test('should reject payment with invalid CVV', async () => {
    // Arrange
    const paymentData = paymentsData.invalidCVV;

    // Act
    await paymentsPage.fillPaymentForm(paymentData);
    await paymentsPage.submitPayment();

    // Assert
    await expect(paymentsPage.errorMessage).toBeVisible();
    const errorText = await paymentsPage.getErrorMessage();
    expect(errorText?.toLowerCase()).toContain('cvv');
  });

  test('should show validation error when email is missing', async () => {
    // Arrange
    const paymentData = paymentsData.missingEmail;

    // Act
    await paymentsPage.fillPaymentForm(paymentData);
    await paymentsPage.submitPayment();

    // Assert
    const validationErrors = await paymentsPage.getValidationErrors();
    expect(validationErrors.length).toBeGreaterThan(0);
    const errorMessages = validationErrors.join(' ').toLowerCase();
    expect(errorMessages).toContain('email');
  });

  test('should successfully process an international payment with EUR currency', async () => {
    // Arrange
    const paymentData = paymentsData.internationalPayment;

    // Act
    await paymentsPage.fillPaymentForm(paymentData);
    await paymentsPage.submitPayment();

    // Assert
    await expect(paymentsPage.successMessage).toBeVisible();
    const successText = await paymentsPage.successMessage.textContent();
    expect(successText).toContain('success');
  });

  test('should reject payment with zero amount', async () => {
    // Arrange
    const paymentData = paymentsData.zeroAmountPayment;

    // Act
    await paymentsPage.fillPaymentForm(paymentData);
    await paymentsPage.submitPayment();

    // Assert
    const validationErrors = await paymentsPage.getValidationErrors();
    expect(validationErrors.length).toBeGreaterThan(0);
    const errorMessages = validationErrors.join(' ').toLowerCase();
    expect(errorMessages).toContain('amount');
  });
});
