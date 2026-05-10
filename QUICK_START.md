# Quick Start Guide - Payments Test Suite

## Installation

```bash
npm install
```

## Running Tests

### All Tests
```bash
npm test
```

### Payment Tests Only
```bash
npm run test:payments
```

### Debug Mode
```bash
npm run test:debug
```

### Interactive UI Mode
```bash
npm run test:ui
```

### Headed Mode (Visible Browser)
```bash
npm run test:headed
```

## Test Suite Overview

**9 Comprehensive Test Cases:**

1. ✅ Valid Payment Processing (standard amount)
2. ✅ Large Amount Payment ($9999.99)
3. ✅ Small Amount Payment ($0.99)
4. ✅ Invalid Card Number Rejection
5. ✅ Expired Card Rejection
6. ✅ Invalid CVV Rejection
7. ✅ Missing Email Validation
8. ✅ International Payment (EUR)
9. ✅ Zero Amount Rejection

## Project Structure

```
tests/
├── payments/
│   └── payments.spec.ts          # Test specifications
├── pages/
│   └── PaymentsPage.ts           # Page Object Model
├── fixtures/
│   └── payments.json             # Test data
└── README.md                     # Detailed documentation

playwright.config.ts              # Playwright configuration
tsconfig.json                     # TypeScript configuration
```

## Key Features

- **Page Object Model**: Maintainable and reusable test code
- **Role-Based Selectors**: Robust and accessible element selection
- **TypeScript**: Full type safety with strict mode
- **Test Data Fixtures**: Externalized test data in JSON
- **Comprehensive Coverage**: Valid, invalid, and edge case scenarios
- **Parallel Execution**: Tests can run in parallel for speed

## Configuration

- **Base URL**: http://localhost:8080
- **Browser**: Chromium
- **Timeout**: Default Playwright timeouts
- **Retries**: 2 retries in CI, 0 in local

## Documentation

- `tests/README.md` - Detailed test suite documentation
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- `QUICK_START.md` - This file

## Next Steps

1. Implement the `/payments` endpoint in your application
2. Create a payment form with accessible labels
3. Run tests: `npm test`
4. View results in `playwright-report/`

For more details, see `tests/README.md` and `IMPLEMENTATION_SUMMARY.md`.
