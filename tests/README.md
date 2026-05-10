# Payments Test Suite

This directory contains the Playwright test suite for the Payments feature.

## Structure

- `payments/` - Payment test specifications
- `pages/` - Page Object Models
- `fixtures/` - Test data and fixtures

## Test Cases

The Payments test suite includes 9 comprehensive test cases:

1. **Valid Payment Processing** - Tests successful payment with standard amount
2. **Large Amount Payment** - Tests payment processing with large amounts (9999.99)
3. **Small Amount Payment** - Tests payment processing with small amounts (0.99)
4. **Invalid Card Number** - Tests rejection of invalid card numbers
5. **Expired Card** - Tests rejection of expired cards
6. **Invalid CVV** - Tests rejection of invalid CVV codes
7. **Missing Email Validation** - Tests validation error when email is missing
8. **International Payment** - Tests payment with different currency (EUR)
9. **Zero Amount Rejection** - Tests rejection of zero amount payments

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

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

## Test Data

Test data is stored in `fixtures/payments.json` and includes:
- Valid payment scenarios
- Invalid payment scenarios
- Edge cases (zero amount, large amounts, small amounts)
- International payments
- Validation error scenarios

## Page Objects

### PaymentsPage
Located in `pages/PaymentsPage.ts`, provides methods for:
- Navigating to payments page
- Filling payment forms
- Submitting payments
- Validating success/error messages
- Retrieving form values

## Best Practices

- Tests are independent and can run in any order
- Uses Page Object Model pattern for maintainability
- Employs role-based selectors for robustness
- Includes proper assertions and error handling
- Test data is externalized in JSON fixtures
