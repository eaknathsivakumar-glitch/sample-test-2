# Payments API Test Suite

This document describes the automated test suite for the Payments API using Playwright.

## Overview

The test suite contains **53 comprehensive test cases** covering all aspects of the Payments API functionality, including:
- Payment creation with various payment methods
- Payment retrieval and listing
- Payment updates and deletion
- Payment processing and refunds
- Payment validation
- Error handling and edge cases

## Test Structure

### Files

- **`tests/payments.spec.js`** - Main test suite with 53 test cases
- **`tests/pages/PaymentsPage.js`** - Page Object Model for Payments API
- **`tests/fixtures/paymentData.js`** - Test data fixtures
- **`playwright.config.js`** - Playwright configuration

## Test Cases

### 1. Create Payment (TC001-TC008)
- TC001: Create payment with valid data
- TC002: Create payment with credit card details
- TC003: Create payment with bank transfer
- TC004: Create payment with digital wallet
- TC005: Create payment with large amount
- TC006: Create payment with small amount
- TC007: Create payment with special characters
- TC008: Create payment with metadata

### 2. Create Payment - Invalid Data (TC009-TC016)
- TC009: Fail without amount
- TC010: Fail with negative amount
- TC011: Fail with zero amount
- TC012: Fail with invalid currency
- TC013: Fail without customer ID
- TC014: Fail with invalid payment method
- TC015: Fail with invalid card number
- TC016: Fail with expired card

### 3. Get Payment (TC017-TC019)
- TC017: Get payment by valid ID
- TC018: Return 404 for invalid ID
- TC019: Return 404 for non-existent ID

### 4. Get All Payments (TC020-TC025)
- TC020: Get all payments
- TC021: Filter by customer ID
- TC022: Filter by status
- TC023: Filter by currency
- TC024: Pagination support
- TC025: Multiple filters

### 5. Update Payment (TC026-TC029)
- TC026: Update description
- TC027: Update metadata
- TC028: Return 404 for non-existent payment
- TC029: Fail with invalid data

### 6. Delete Payment (TC030-TC032)
- TC030: Delete payment
- TC031: Return 404 for non-existent payment
- TC032: Verify deletion

### 7. Process Payment (TC033-TC035)
- TC033: Process pending payment
- TC034: Return 404 for non-existent payment
- TC035: Fail to process already processed payment

### 8. Refund Payment (TC036-TC040)
- TC036: Full refund
- TC037: Partial refund
- TC038: Return 404 for non-existent payment
- TC039: Fail with invalid amount
- TC040: Fail when refund exceeds payment amount

### 9. Validate Payment (TC041-TC044)
- TC041: Validate valid payment data
- TC042: Fail to validate invalid data
- TC043: Fail with missing required fields
- TC044: Validate payment with card details

### 10. Get Payment Status (TC045-TC048)
- TC045: Get status of pending payment
- TC046: Get status of processing payment
- TC047: Return 404 for non-existent payment
- TC048: Include timestamp in response

### 11. Edge Cases (TC049-TC053)
- TC049: Create multiple payments for same customer
- TC050: Create payment with long description
- TC051: Create payment with empty metadata
- TC052: Create payment with null description
- TC053: Concurrent payment creation

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in UI Mode
```bash
npm run test:ui
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Specific Test File
```bash
npx playwright test tests/payments.spec.js
```

### Run Specific Test Suite
```bash
npx playwright test -g "Create Payment"
```

## Test Data

The test suite uses comprehensive test data fixtures covering:

### Valid Payment Data
- Basic payment with all required fields
- Payment with credit card details
- Payment with bank transfer details
- Payment with digital wallet
- Large and small amounts
- Special characters and long descriptions

### Invalid Payment Data
- Missing required fields (amount, customer ID)
- Invalid values (negative/zero amounts, invalid currencies)
- Invalid card details (invalid numbers, expired cards)
- Invalid payment methods

### Refund Data
- Full refund
- Partial refund
- Invalid refund amounts

## Page Object Model

The `PaymentsPage` class provides methods for all API operations:

```javascript
// Create payment
await paymentsPage.createPayment(paymentData);

// Get payment
await paymentsPage.getPayment(paymentId);

// Get all payments
await paymentsPage.getAllPayments(filters);

// Update payment
await paymentsPage.updatePayment(paymentId, updateData);

// Delete payment
await paymentsPage.deletePayment(paymentId);

// Process payment
await paymentsPage.processPayment(paymentId);

// Refund payment
await paymentsPage.refundPayment(paymentId, refundData);

// Validate payment
await paymentsPage.validatePayment(paymentData);

// Get payment status
await paymentsPage.getPaymentStatus(paymentId);
```

## Configuration

The Playwright configuration (`playwright.config.js`) includes:
- Base URL: `http://localhost:8080`
- Test directory: `./tests`
- Reporter: HTML report
- Web server: Automatically starts the Express server
- Trace: Enabled on first retry

## Expected API Endpoints

The test suite expects the following API endpoints to be implemented:

```
POST   /api/v1/payments                    - Create payment
GET    /api/v1/payments                    - Get all payments
GET    /api/v1/payments/:id                - Get payment by ID
PUT    /api/v1/payments/:id                - Update payment
DELETE /api/v1/payments/:id                - Delete payment
POST   /api/v1/payments/:id/process        - Process payment
POST   /api/v1/payments/:id/refund         - Refund payment
POST   /api/v1/payments/validate           - Validate payment
GET    /api/v1/payments/:id/status         - Get payment status
```

## Notes

- All tests are independent and can run in any order
- Tests use Playwright's built-in request API for HTTP calls
- Test data is isolated using fixtures
- Each test has clear assertions for success and failure scenarios
- Tests follow the Page Object Model pattern for maintainability
