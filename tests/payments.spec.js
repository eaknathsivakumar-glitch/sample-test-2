const { test, expect } = require('@playwright/test');
const PaymentsPage = require('./pages/PaymentsPage');
const paymentData = require('./fixtures/paymentData');

test.describe('Payments API', () => {
  let paymentsPage;

  test.beforeEach(async ({ page }) => {
    paymentsPage = new PaymentsPage(page);
  });

  test.describe('Create Payment', () => {
    // TC001: Create payment with valid data
    test('should create payment with valid data', async () => {
      const response = await paymentsPage.createPayment(paymentData.validPaymentData);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.amount).toBe(paymentData.validPaymentData.amount);
      expect(response.data.currency).toBe(paymentData.validPaymentData.currency);
      expect(response.data.status).toBe('pending');
    });

    // TC002: Create payment with credit card
    test('should create payment with credit card details', async () => {
      const response = await paymentsPage.createPayment(paymentData.validPaymentDataWithCard);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.paymentMethod).toBe('credit_card');
    });

    // TC003: Create payment with bank transfer
    test('should create payment with bank transfer', async () => {
      const response = await paymentsPage.createPayment(paymentData.validPaymentDataBankTransfer);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.paymentMethod).toBe('bank_transfer');
    });

    // TC004: Create payment with digital wallet
    test('should create payment with digital wallet', async () => {
      const response = await paymentsPage.createPayment(paymentData.validPaymentDataDigitalWallet);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.paymentMethod).toBe('digital_wallet');
    });

    // TC005: Create payment with large amount
    test('should create payment with large amount', async () => {
      const response = await paymentsPage.createPayment(paymentData.largePaymentAmount);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.amount).toBe(paymentData.largePaymentAmount.amount);
    });

    // TC006: Create payment with small amount
    test('should create payment with small amount', async () => {
      const response = await paymentsPage.createPayment(paymentData.smallPaymentAmount);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.amount).toBe(paymentData.smallPaymentAmount.amount);
    });

    // TC007: Create payment with special characters
    test('should create payment with special characters in description', async () => {
      const response = await paymentsPage.createPayment(paymentData.paymentWithSpecialCharacters);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.description).toContain('!@#$%^&*()');
    });

    // TC008: Create payment with metadata
    test('should create payment with metadata', async () => {
      const response = await paymentsPage.createPayment(paymentData.validPaymentData);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.metadata).toBeDefined();
      expect(response.data.metadata.orderId).toBe('order_123');
    });
  });

  test.describe('Create Payment - Invalid Data', () => {
    // TC009: Create payment without amount
    test('should fail to create payment without amount', async () => {
      const response = await paymentsPage.createPayment(paymentData.invalidPaymentDataMissingAmount);
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
      expect(response.data.error).toBeDefined();
    });

    // TC010: Create payment with negative amount
    test('should fail to create payment with negative amount', async () => {
      const response = await paymentsPage.createPayment(paymentData.invalidPaymentDataNegativeAmount);
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
      expect(response.data.error).toBeDefined();
    });

    // TC011: Create payment with zero amount
    test('should fail to create payment with zero amount', async () => {
      const response = await paymentsPage.createPayment(paymentData.invalidPaymentDataZeroAmount);
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
      expect(response.data.error).toBeDefined();
    });

    // TC012: Create payment with invalid currency
    test('should fail to create payment with invalid currency', async () => {
      const response = await paymentsPage.createPayment(paymentData.invalidPaymentDataInvalidCurrency);
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
      expect(response.data.error).toBeDefined();
    });

    // TC013: Create payment without customer ID
    test('should fail to create payment without customer ID', async () => {
      const response = await paymentsPage.createPayment(paymentData.invalidPaymentDataMissingCustomerId);
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
      expect(response.data.error).toBeDefined();
    });

    // TC014: Create payment with invalid payment method
    test('should fail to create payment with invalid payment method', async () => {
      const response = await paymentsPage.createPayment(paymentData.invalidPaymentDataInvalidPaymentMethod);
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
      expect(response.data.error).toBeDefined();
    });

    // TC015: Create payment with invalid card number
    test('should fail to create payment with invalid card number', async () => {
      const response = await paymentsPage.createPayment(paymentData.invalidPaymentDataInvalidCardNumber);
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
      expect(response.data.error).toBeDefined();
    });

    // TC016: Create payment with expired card
    test('should fail to create payment with expired card', async () => {
      const response = await paymentsPage.createPayment(paymentData.invalidPaymentDataExpiredCard);
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
      expect(response.data.error).toBeDefined();
    });
  });

  test.describe('Get Payment', () => {
    let paymentId;

    test.beforeEach(async () => {
      const createResponse = await paymentsPage.createPayment(paymentData.validPaymentData);
      paymentId = createResponse.data.id;
    });

    // TC017: Get payment by valid ID
    test('should get payment by valid ID', async () => {
      const response = await paymentsPage.getPayment(paymentId);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe(paymentId);
      expect(response.data.amount).toBe(paymentData.validPaymentData.amount);
    });

    // TC018: Get payment with invalid ID
    test('should return 404 for invalid payment ID', async () => {
      const response = await paymentsPage.getPayment('invalid_id_12345');
      expect(response.status).toBe(404);
      expect(response.data).toBeDefined();
      expect(response.data.error).toBeDefined();
    });

    // TC019: Get payment with non-existent ID
    test('should return 404 for non-existent payment ID', async () => {
      const response = await paymentsPage.getPayment('pay_nonexistent_999999');
      expect(response.status).toBe(404);
    });
  });

  test.describe('Get All Payments', () => {
    // TC020: Get all payments
    test('should get all payments', async () => {
      const response = await paymentsPage.getAllPayments();
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    // TC021: Get payments with customer filter
    test('should get payments filtered by customer ID', async () => {
      const response = await paymentsPage.getAllPayments({ customerId: 'cust_123456' });
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    // TC022: Get payments with status filter
    test('should get payments filtered by status', async () => {
      const response = await paymentsPage.getAllPayments({ status: 'pending' });
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    // TC023: Get payments with currency filter
    test('should get payments filtered by currency', async () => {
      const response = await paymentsPage.getAllPayments({ currency: 'USD' });
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    // TC024: Get payments with pagination
    test('should get payments with pagination', async () => {
      const response = await paymentsPage.getAllPayments({ page: 1, limit: 10 });
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    // TC025: Get payments with multiple filters
    test('should get payments with multiple filters', async () => {
      const response = await paymentsPage.getAllPayments({
        customerId: 'cust_123456',
        status: 'completed',
        currency: 'USD',
      });
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  test.describe('Update Payment', () => {
    let paymentId;

    test.beforeEach(async () => {
      const createResponse = await paymentsPage.createPayment(paymentData.validPaymentData);
      paymentId = createResponse.data.id;
    });

    // TC026: Update payment description
    test('should update payment description', async () => {
      const updateData = { description: 'Updated description' };
      const response = await paymentsPage.updatePayment(paymentId, updateData);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.description).toBe('Updated description');
    });

    // TC027: Update payment metadata
    test('should update payment metadata', async () => {
      const updateData = { metadata: { orderId: 'order_updated' } };
      const response = await paymentsPage.updatePayment(paymentId, updateData);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.metadata.orderId).toBe('order_updated');
    });

    // TC028: Update non-existent payment
    test('should return 404 when updating non-existent payment', async () => {
      const response = await paymentsPage.updatePayment('pay_nonexistent', { description: 'Test' });
      expect(response.status).toBe(404);
    });

    // TC029: Update payment with invalid data
    test('should fail to update payment with invalid data', async () => {
      const updateData = { amount: -100 };
      const response = await paymentsPage.updatePayment(paymentId, updateData);
      expect(response.status).toBe(400);
    });
  });

  test.describe('Delete Payment', () => {
    let paymentId;

    test.beforeEach(async () => {
      const createResponse = await paymentsPage.createPayment(paymentData.validPaymentData);
      paymentId = createResponse.data.id;
    });

    // TC030: Delete payment
    test('should delete payment', async () => {
      const response = await paymentsPage.deletePayment(paymentId);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    });

    // TC031: Delete non-existent payment
    test('should return 404 when deleting non-existent payment', async () => {
      const response = await paymentsPage.deletePayment('pay_nonexistent');
      expect(response.status).toBe(404);
    });

    // TC032: Verify payment is deleted
    test('should verify payment is deleted after deletion', async () => {
      await paymentsPage.deletePayment(paymentId);
      const response = await paymentsPage.getPayment(paymentId);
      expect(response.status).toBe(404);
    });
  });

  test.describe('Process Payment', () => {
    let paymentId;

    test.beforeEach(async () => {
      const createResponse = await paymentsPage.createPayment(paymentData.validPaymentData);
      paymentId = createResponse.data.id;
    });

    // TC033: Process pending payment
    test('should process pending payment', async () => {
      const response = await paymentsPage.processPayment(paymentId);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.status).toBe('processing');
    });

    // TC034: Process non-existent payment
    test('should return 404 when processing non-existent payment', async () => {
      const response = await paymentsPage.processPayment('pay_nonexistent');
      expect(response.status).toBe(404);
    });

    // TC035: Process already processed payment
    test('should fail to process already processed payment', async () => {
      await paymentsPage.processPayment(paymentId);
      const response = await paymentsPage.processPayment(paymentId);
      expect(response.status).toBe(400);
    });
  });

  test.describe('Refund Payment', () => {
    let paymentId;

    test.beforeEach(async () => {
      const createResponse = await paymentsPage.createPayment(paymentData.validPaymentData);
      paymentId = createResponse.data.id;
      await paymentsPage.processPayment(paymentId);
    });

    // TC036: Full refund payment
    test('should refund payment in full', async () => {
      const response = await paymentsPage.refundPayment(paymentId, paymentData.refundDataFull);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.status).toBe('refunded');
    });

    // TC037: Partial refund payment
    test('should refund payment partially', async () => {
      const response = await paymentsPage.refundPayment(paymentId, paymentData.refundDataPartial);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.status).toBe('partially_refunded');
    });

    // TC038: Refund non-existent payment
    test('should return 404 when refunding non-existent payment', async () => {
      const response = await paymentsPage.refundPayment('pay_nonexistent', paymentData.refundDataFull);
      expect(response.status).toBe(404);
    });

    // TC039: Refund with invalid amount
    test('should fail to refund with invalid amount', async () => {
      const response = await paymentsPage.refundPayment(paymentId, paymentData.refundDataInvalid);
      expect(response.status).toBe(400);
    });

    // TC040: Refund more than payment amount
    test('should fail to refund more than payment amount', async () => {
      const refundData = { amount: 999999.99 };
      const response = await paymentsPage.refundPayment(paymentId, refundData);
      expect(response.status).toBe(400);
    });
  });

  test.describe('Validate Payment', () => {
    // TC041: Validate valid payment data
    test('should validate valid payment data', async () => {
      const response = await paymentsPage.validatePayment(paymentData.validPaymentData);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.valid).toBe(true);
    });

    // TC042: Validate invalid payment data
    test('should fail to validate invalid payment data', async () => {
      const response = await paymentsPage.validatePayment(paymentData.invalidPaymentDataNegativeAmount);
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
      expect(response.data.valid).toBe(false);
    });

    // TC043: Validate payment with missing required fields
    test('should fail to validate payment with missing fields', async () => {
      const response = await paymentsPage.validatePayment({});
      expect(response.status).toBe(400);
      expect(response.data).toBeDefined();
    });

    // TC044: Validate payment with card details
    test('should validate payment with card details', async () => {
      const response = await paymentsPage.validatePayment(paymentData.validPaymentDataWithCard);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.valid).toBe(true);
    });
  });

  test.describe('Get Payment Status', () => {
    let paymentId;

    test.beforeEach(async () => {
      const createResponse = await paymentsPage.createPayment(paymentData.validPaymentData);
      paymentId = createResponse.data.id;
    });

    // TC045: Get status of pending payment
    test('should get status of pending payment', async () => {
      const response = await paymentsPage.getPaymentStatus(paymentId);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.status).toBe('pending');
    });

    // TC046: Get status of processing payment
    test('should get status of processing payment', async () => {
      await paymentsPage.processPayment(paymentId);
      const response = await paymentsPage.getPaymentStatus(paymentId);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.status).toBe('processing');
    });

    // TC047: Get status of non-existent payment
    test('should return 404 for status of non-existent payment', async () => {
      const response = await paymentsPage.getPaymentStatus('pay_nonexistent');
      expect(response.status).toBe(404);
    });

    // TC048: Get status includes timestamp
    test('should include timestamp in status response', async () => {
      const response = await paymentsPage.getPaymentStatus(paymentId);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.timestamp).toBeDefined();
    });
  });

  test.describe('Payment Edge Cases', () => {
    // TC049: Create multiple payments for same customer
    test('should create multiple payments for same customer', async () => {
      const response1 = await paymentsPage.createPayment(paymentData.validPaymentData);
      const response2 = await paymentsPage.createPayment(paymentData.validPaymentData);
      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);
      expect(response1.data.id).not.toBe(response2.data.id);
    });

    // TC050: Create payment with very long description
    test('should create payment with long description', async () => {
      const response = await paymentsPage.createPayment(paymentData.paymentWithLongDescription);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
    });

    // TC051: Create payment with empty metadata
    test('should create payment with empty metadata', async () => {
      const paymentWithEmptyMetadata = {
        ...paymentData.validPaymentData,
        metadata: {},
      };
      const response = await paymentsPage.createPayment(paymentWithEmptyMetadata);
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
    });

    // TC052: Create payment with null description
    test('should create payment with null description', async () => {
      const paymentWithNullDescription = {
        ...paymentData.validPaymentData,
        description: null,
      };
      const response = await paymentsPage.createPayment(paymentWithNullDescription);
      expect([201, 400]).toContain(response.status);
    });

    // TC053: Concurrent payment creation
    test('should handle concurrent payment creation', async () => {
      const promises = [
        paymentsPage.createPayment(paymentData.validPaymentData),
        paymentsPage.createPayment(paymentData.validPaymentDataWithCard),
        paymentsPage.createPayment(paymentData.validPaymentDataBankTransfer),
      ];
      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.data.id).toBeDefined();
      });
    });
  });
});
