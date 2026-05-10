# Payments Test Suite

This directory contains the Playwright test suite for the Payments feature.

## Structure

```
tests/
├── pages/
│   └── PaymentPage.ts          # Page Object Model for payment page
├── fixtures/
│   └── payment-data.json       # Test data for payment scenarios
├── payments/
│   └── payments.spec.ts        # Payment test specifications
└── README.md                   # This file
```

## Test Coverage

The test suite covers **9 test cases** across multiple scenarios:

### Valid Payments (TC001-TC003)
- **TC001**: Process valid payment with correct card details
- **TC002**: Process valid payment with different currency
- **TC003**: Process valid payment with high amount

### Invalid Payments (TC004-TC006)
- **TC004**: Reject payment with invalid card number
- **TC005**: Reject payment with expired card
- **TC006**: Reject payment with invalid CVV

### Edge Cases (TC007-TC009)
- **TC007**: Process payment with minimum valid amount
- **TC008**: Process payment with maximum valid amount
- **TC009**: Reject payment with negative amount

### Additional Coverage (Code Gaps)
- Form validation and submit button state
- Cancel payment functionality
- Amount field validation
- Payment history tracking

## Running Tests

### Run all tests
```bash
npm test
```

### Run only payment tests
```bash
npm run test:payments
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI
```bash
npm run test:ui
```

### View test report
```bash
npm run test:report
```

### Run specific test
```bash
npx playwright test tests/payments/payments.spec.ts --grep "should process valid payment"
```

## Test Data

Test data is organized in `tests/fixtures/payment-data.json`:

- **validPayments**: Array of 3 valid payment scenarios
- **invalidPayments**: Array of 3 invalid payment scenarios
- **edgeCases**: Array of 3 edge case scenarios

Each payment object includes:
- `id`: Unique identifier
- `amount`: Payment amount
- `currency`: Currency code (USD, EUR, GBP)
- `cardNumber`: Card number for testing
- `cardholderName`: Name on card
- `expiryMonth`: Card expiry month
- `expiryYear`: Card expiry year
- `cvv`: Card CVV
- `expectedError`: Expected error message (for invalid payments)
- `description`: Test scenario description

## Page Object Model

The `PaymentPage` class provides methods for:

### Form Interactions
- `fillPaymentForm()`: Fill payment form with data
- `submitPayment()`: Submit the payment form
- `cancelPayment()`: Cancel payment
- `clearForm()`: Clear all form fields

### Validation & Status
- `isSuccessMessageVisible()`: Check if success message is visible
- `isErrorMessageVisible()`: Check if error message is visible
- `isSubmitButtonEnabled()`: Check if submit button is enabled
- `getSuccessMessage()`: Get success message text
- `getErrorMessage()`: Get error message text

### History & Actions
- `isPaymentHistoryVisible()`: Check if payment history is visible
- `getPaymentHistoryRows()`: Get payment history rows
- `refundPayment()`: Refund a payment
- `downloadReceipt()`: Download receipt

### Waits
- `waitForSuccessMessage()`: Wait for success message to appear
- `waitForErrorMessage()`: Wait for error message to appear

## Selectors

The test suite uses role-based selectors following Playwright best practices:

- `getByRole()`: For buttons, headings, forms, alerts
- `getByLabel()`: For form inputs
- `getByText()`: For text content matching

This ensures tests are resilient to DOM changes and more maintainable.

## Configuration

Tests are configured in `playwright.config.ts`:

- **Base URL**: `http://localhost:8080` (configurable via `BASE_URL` env var)
- **Browsers**: Chromium, Firefox, WebKit
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Reporter**: HTML report

## Environment Variables

- `BASE_URL`: Base URL for the application (default: `http://localhost:8080`)
- `CI`: Set to `true` for CI environments

## Best Practices

1. **Independent Tests**: Each test is independent and doesn't rely on others
2. **Page Object Model**: All selectors are in `PaymentPage.ts`
3. **Descriptive Names**: Test names clearly describe what they test
4. **Test Data**: All test data is in JSON fixtures
5. **No Hardcoded Values**: Credentials and URLs come from environment
6. **Proper Waits**: Uses Playwright's auto-wait and explicit waits for async operations
7. **Role-Based Selectors**: Prefers accessible selectors over CSS/XPath

## Troubleshooting

### Tests fail with "Page not found"
Ensure the application is running on the configured `BASE_URL`.

### Selectors not found
Check that the payment page HTML matches the expected structure. Update selectors in `PaymentPage.ts` if needed.

### Timeout errors
Increase timeout in `playwright.config.ts` or specific tests if the application is slow.

### Payment processing fails
Verify that the payment API is working correctly and test data is valid.
