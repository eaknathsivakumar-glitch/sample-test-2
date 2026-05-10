# Payments Feature - Playwright Test Suite

## Overview

This test suite provides comprehensive automated testing for the Payments feature using Playwright. The suite includes 17 test cases covering valid payments, invalid payments, form validation, UI testing, and payment history.

## Test Structure

### Page Object Model
- **PaymentsPage** (`tests/pages/PaymentsPage.ts`): Encapsulates all interactions with the payments page

### Test Data
- **paymentTestData** (`tests/data/paymentTestData.ts`): Contains test data for various scenarios

### Fixtures
- **paymentFixture** (`tests/fixtures/paymentFixture.ts`): Custom Playwright fixture for PaymentsPage

### Test Specifications
- **payments.spec.ts** (`tests/payments.spec.ts`): Main test file with 17 test cases

## Test Cases

### Valid Payment Scenarios (4 tests)
- **TC001**: Successfully process a valid payment
- **TC002**: Display payment in the payments list after successful submission
- **TC003**: Accept multiple currency types
- **TC004**: Handle large payment amounts

### Invalid Payment Scenarios (4 tests)
- **TC005**: Reject payment with invalid card number
- **TC006**: Reject payment with expired card
- **TC007**: Reject payment with invalid CVV
- **TC008**: Reject payment with empty required fields

### Form Validation (4 tests)
- **TC009**: Validate card number format
- **TC010**: Validate expiry date format
- **TC011**: Validate CVV length
- **TC012**: Validate amount is positive

### Payment Form UI (3 tests)
- **TC013**: Display payment form with all required fields
- **TC014**: Clear form when clear button is clicked
- **TC015**: Display currency options

### Payment History (2 tests)
- **TC016**: Display payment history list
- **TC017**: Update payment history after successful payment

## Installation

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

## Configuration

The test suite is configured in `playwright.config.ts` with:
- Base URL: `http://localhost:8080`
- Browsers: Chromium, Firefox, WebKit
- Automatic web server startup
- HTML reporting

## Test Data

### Valid Payment
- Card Number: 4532015112830366
- Expiry Date: 12/25
- CVV: 123
- Cardholder Name: John Doe
- Amount: 100.00
- Currency: USD

### Multi-Currency Support
Tests include payments in USD, EUR, and GBP currencies.

### Edge Cases
- Large amounts (999999.99)
- Invalid card numbers
- Expired cards
- Invalid CVV
- Empty fields

## Page Object Methods

### Navigation
- `navigateToPayments()`: Navigate to the payments page

### Form Interaction
- `fillPaymentForm()`: Fill all payment form fields
- `submitPayment()`: Submit the payment form
- `clearForm()`: Clear all form fields

### Assertions
- `isSuccessMessageVisible()`: Check if success message is visible
- `isErrorMessageVisible()`: Check if error message is visible
- `getSuccessMessage()`: Get the success message text
- `getErrorMessage()`: Get the error message text
- `getPaymentCount()`: Get the number of payments in history
- `getPaymentsList()`: Get list of all payments

### Waits
- `waitForSuccessMessage()`: Wait for success message to appear
- `waitForErrorMessage()`: Wait for error message to appear

## Best Practices

1. **Isolation**: Each test is independent and can run in any order
2. **Setup/Teardown**: `beforeEach` hook ensures clean state
3. **Explicit Waits**: Uses Playwright's built-in wait mechanisms
4. **Descriptive Names**: Test names clearly describe what is being tested
5. **AAA Pattern**: Tests follow Arrange-Act-Assert pattern

## Troubleshooting

### Tests fail to start
- Ensure the application is running on `http://localhost:8080`
- Check that all dependencies are installed: `npm install`

### Timeout errors
- Increase timeout in `playwright.config.ts` if needed
- Check that the application is responding

### Element not found
- Verify that the test data attributes match the application
- Update selectors in `PaymentsPage.ts` if needed

## CI/CD Integration

The test suite is configured to run in CI environments:
- Set `CI=true` environment variable
- Tests will run with retries and single worker
- HTML report will be generated

## Future Enhancements

- Add API testing for payment endpoints
- Add performance testing
- Add accessibility testing
- Add visual regression testing
- Add load testing scenarios
