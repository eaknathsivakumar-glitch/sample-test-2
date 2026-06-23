/**
 * Payment test data fixtures
 */

const validPaymentData = {
  amount: 100.00,
  currency: 'USD',
  description: 'Test payment',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
  metadata: {
    orderId: 'order_123',
    invoiceId: 'inv_456',
  },
};

const validPaymentDataWithCard = {
  amount: 250.50,
  currency: 'USD',
  description: 'Payment with card details',
  paymentMethod: 'credit_card',
  customerId: 'cust_789012',
  cardDetails: {
    cardNumber: '4111111111111111',
    expiryMonth: 12,
    expiryYear: 2025,
    cvv: '123',
    cardholderName: 'John Doe',
  },
};

const validPaymentDataBankTransfer = {
  amount: 500.00,
  currency: 'EUR',
  description: 'Bank transfer payment',
  paymentMethod: 'bank_transfer',
  customerId: 'cust_345678',
  bankDetails: {
    accountNumber: '1234567890',
    routingNumber: '021000021',
    accountHolderName: 'Jane Smith',
    bankName: 'Test Bank',
  },
};

const validPaymentDataDigitalWallet = {
  amount: 75.25,
  currency: 'GBP',
  description: 'Digital wallet payment',
  paymentMethod: 'digital_wallet',
  customerId: 'cust_567890',
  walletDetails: {
    walletType: 'apple_pay',
    walletToken: 'wallet_token_xyz',
  },
};

const invalidPaymentDataMissingAmount = {
  currency: 'USD',
  description: 'Missing amount',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
};

const invalidPaymentDataNegativeAmount = {
  amount: -100.00,
  currency: 'USD',
  description: 'Negative amount',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
};

const invalidPaymentDataZeroAmount = {
  amount: 0,
  currency: 'USD',
  description: 'Zero amount',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
};

const invalidPaymentDataInvalidCurrency = {
  amount: 100.00,
  currency: 'INVALID',
  description: 'Invalid currency',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
};

const invalidPaymentDataMissingCustomerId = {
  amount: 100.00,
  currency: 'USD',
  description: 'Missing customer ID',
  paymentMethod: 'credit_card',
};

const invalidPaymentDataInvalidPaymentMethod = {
  amount: 100.00,
  currency: 'USD',
  description: 'Invalid payment method',
  paymentMethod: 'invalid_method',
  customerId: 'cust_123456',
};

const invalidPaymentDataInvalidCardNumber = {
  amount: 100.00,
  currency: 'USD',
  description: 'Invalid card number',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
  cardDetails: {
    cardNumber: '1234567890123456',
    expiryMonth: 12,
    expiryYear: 2025,
    cvv: '123',
    cardholderName: 'John Doe',
  },
};

const invalidPaymentDataExpiredCard = {
  amount: 100.00,
  currency: 'USD',
  description: 'Expired card',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
  cardDetails: {
    cardNumber: '4111111111111111',
    expiryMonth: 1,
    expiryYear: 2020,
    cvv: '123',
    cardholderName: 'John Doe',
  },
};

const largePaymentAmount = {
  amount: 999999.99,
  currency: 'USD',
  description: 'Large payment amount',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
};

const smallPaymentAmount = {
  amount: 0.01,
  currency: 'USD',
  description: 'Small payment amount',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
};

const paymentWithSpecialCharacters = {
  amount: 150.00,
  currency: 'USD',
  description: 'Payment with special chars: !@#$%^&*()',
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
  metadata: {
    orderId: 'order_!@#$%',
  },
};

const paymentWithLongDescription = {
  amount: 100.00,
  currency: 'USD',
  description: 'A'.repeat(500),
  paymentMethod: 'credit_card',
  customerId: 'cust_123456',
};

const refundDataPartial = {
  amount: 50.00,
  reason: 'Partial refund',
};

const refundDataFull = {
  reason: 'Full refund - customer request',
};

const refundDataInvalid = {
  amount: -50.00,
  reason: 'Invalid refund amount',
};

module.exports = {
  validPaymentData,
  validPaymentDataWithCard,
  validPaymentDataBankTransfer,
  validPaymentDataDigitalWallet,
  invalidPaymentDataMissingAmount,
  invalidPaymentDataNegativeAmount,
  invalidPaymentDataZeroAmount,
  invalidPaymentDataInvalidCurrency,
  invalidPaymentDataMissingCustomerId,
  invalidPaymentDataInvalidPaymentMethod,
  invalidPaymentDataInvalidCardNumber,
  invalidPaymentDataExpiredCard,
  largePaymentAmount,
  smallPaymentAmount,
  paymentWithSpecialCharacters,
  paymentWithLongDescription,
  refundDataPartial,
  refundDataFull,
  refundDataInvalid,
};
