export const validPaymentData = {
  cardNumber: '4532015112830366',
  expiryDate: '12/25',
  cvv: '123',
  cardholderName: 'John Doe',
  amount: '100.00',
  currency: 'USD',
  description: 'Test Payment',
};

export const invalidCardNumberData = {
  cardNumber: '1234567890123456',
  expiryDate: '12/25',
  cvv: '123',
  cardholderName: 'John Doe',
  amount: '100.00',
  currency: 'USD',
  description: 'Invalid Card Test',
};

export const expiredCardData = {
  cardNumber: '4532015112830366',
  expiryDate: '01/20',
  cvv: '123',
  cardholderName: 'John Doe',
  amount: '100.00',
  currency: 'USD',
  description: 'Expired Card Test',
};

export const invalidCVVData = {
  cardNumber: '4532015112830366',
  expiryDate: '12/25',
  cvv: '12',
  cardholderName: 'John Doe',
  amount: '100.00',
  currency: 'USD',
  description: 'Invalid CVV Test',
};

export const largeAmountData = {
  cardNumber: '4532015112830366',
  expiryDate: '12/25',
  cvv: '123',
  cardholderName: 'John Doe',
  amount: '999999.99',
  currency: 'USD',
  description: 'Large Amount Test',
};

export const multiCurrencyData = [
  {
    cardNumber: '4532015112830366',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'John Doe',
    amount: '100.00',
    currency: 'USD',
    description: 'USD Payment',
  },
  {
    cardNumber: '4532015112830366',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'Jane Smith',
    amount: '85.50',
    currency: 'EUR',
    description: 'EUR Payment',
  },
  {
    cardNumber: '4532015112830366',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'Bob Johnson',
    amount: '120.75',
    currency: 'GBP',
    description: 'GBP Payment',
  },
];

export const emptyFieldsData = {
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  amount: '',
  currency: 'USD',
  description: '',
};
