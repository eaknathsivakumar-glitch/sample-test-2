# Payments Test Suite

## Overview
This directory contains comprehensive Playwright test automation for the Payments feature. The test suite covers valid payment scenarios, error handling, form validation, UI/UX testing, and edge cases.

## Test Structure

### Files
- **payments.spec.ts** - Main test file with 20 test cases
- **pages/PaymentsPage.ts** - Page Object Model for Payments feature
- **fixtures/paymentTestData.ts** - Test data fixtures

### Test Categories

#### 1. Valid Payment Scenarios (3 tests)
- TC001: Valid payment with correct card details
- TC002: Payment with USD currency
- TC003: Payment with large amount

#### 2. Invalid Payment Scenarios (3 tests)
- TC004: Rejection of invalid card number
- TC005: Rejection of expired card
- TC006: Rejection of invalid CVV

#### 3. Form Validation (3 tests)
- TC007: Empty card number validation
- TC008: Empty cardholder name validation
- TC009: Invalid amount validation

#### 4. UI/UX Tests (3 tests)
- TC010: Payment form visibility on page load
- TC011: Submit button disabled when form is empty
- TC012: Submit button enabled when form is filled

#### 5. Payment Method Selection (2 tests)
- TC013: Credit card payment method selection
- TC014: Form update on payment method change

#### 6. Edge Cases (3 tests)
- TC015: Minimum valid amount processing
- TC016: Card number with spaces acceptance
- TC017: Cardholder name with special characters

#### 7. Multiple Currency Support (3 tests)
- TC018: EUR currency payment
- TC019: GBP currency payment
- TC020: JPY currency payment

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npx playwright test tests/payments.spec.ts
```

### Run specific test
```bash
npx playwright test -g "TC001"
```

### Run in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run in debug mode
```bash
npx playwright test --debug
```

### Run with specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Data

Test data is organized in `fixtures/paymentTestData.ts`:
- **validPaymentData** - Valid card for successful transactions
- **invalidCardData** - Invalid card number for rejection testing
- **expiredCardData** - Expired card for validation testing
- **invalidCVVData** - Invalid CVV for security testing
- **largeAmountData** - High-value transaction testing
- **multiCurrencyData** - Multi-currency support testing

## Page Object Model

The `PaymentsPage` class encapsulates all interactions with the Payments feature:
- Form filling methods
- Payment submission
- Success/error message verification
- Payment method selection
- Currency selection

## Best Practices

1. **Locator Strategy**: Uses semantic locators (getByRole, getByLabel) instead of CSS selectors
2. **Test Isolation**: Each test is independent and can run in any order
3. **Data Fixtures**: Test data is centralized and reusable
4. **Clear Naming**: Test names follow TC### convention for traceability
5. **Assertions**: Clear and specific assertions for each test scenario

## Configuration

Tests are configured in `playwright.config.ts`:
- Base URL: http://localhost:8080
- Test directory: ./tests
- Browsers: Chromium, Firefox, WebKit
- Parallel execution enabled
- HTML report generation

## Troubleshooting

### Tests fail to find elements
- Ensure the application is running on http://localhost:8080
- Verify the payment form HTML matches the locators in PaymentsPage.ts

### Timeout errors
- Increase timeout in playwright.config.ts if needed
- Check network connectivity

### Browser issues
- Run `npx playwright install` to ensure all browsers are installed
- Clear browser cache: `rm -rf .playwright`

## CI/CD Integration

For CI/CD pipelines, use:
```bash
CI=true npm test
```

This will:
- Run tests with 1 worker (sequential)
- Retry failed tests up to 2 times
- Generate HTML report in `playwright-report/`
