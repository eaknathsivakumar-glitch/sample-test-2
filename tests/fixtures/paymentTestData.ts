/**
 * Test data fixtures for Payments test suite
 */

export const validPaymentData = {
  cardNumber: '4532015112830366',
  expiryDate: '12/25',
  cvv: '123',
  cardholderName: 'John Doe',
  amount: '99.99',
  currency: 'USD',
  paymentMethod: 'credit_card',
};

export const invalidCardData = {
  cardNumber: '1234567890123456',
  expiryDate: '12/25',
  cvv: '123',
  cardholderName: 'Jane Smith',
  amount: '50.00',
  currency: 'USD',
  paymentMethod: 'credit_card',
};

export const expiredCardData = {
  cardNumber: '4532015112830366',
  expiryDate: '01/20',
  cvv: '123',
  cardholderName: 'Expired User',
  amount: '75.00',
  currency: 'USD',
  paymentMethod: 'credit_card',
};

export const invalidCVVData = {
  cardNumber: '4532015112830366',
  expiryDate: '12/25',
  cvv: '99',
  cardholderName: 'Invalid CVV',
  amount: '100.00',
  currency: 'USD',
  paymentMethod: 'credit_card',
};

export const largeAmountData = {
  cardNumber: '4532015112830366',
  expiryDate: '12/25',
  cvv: '123',
  cardholderName: 'High Value',
  amount: '9999.99',
  currency: 'USD',
  paymentMethod: 'credit_card',
};

export const multiCurrencyData = [
  { currency: 'USD', amount: '100.00' },
  { currency: 'EUR', amount: '85.00' },
  { currency: 'GBP', amount: '75.00' },
  { currency: 'JPY', amount: '10000.00' },
];
