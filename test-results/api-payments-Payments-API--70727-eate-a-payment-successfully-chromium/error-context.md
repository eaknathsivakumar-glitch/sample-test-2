# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/payments.spec.ts >> Payments API >> should create a payment successfully
- Location: tests/e2e/api/payments.spec.ts:6:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 404
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Payments API', () => {
  4   |   const baseURL = 'http://localhost:8080/api/v1';
  5   | 
  6   |   test('should create a payment successfully', async ({ request }) => {
  7   |     const paymentData = {
  8   |       amount: 100.00,
  9   |       currency: 'USD',
  10  |       description: 'Test payment',
  11  |       customerId: 'cust_123',
  12  |       paymentMethod: 'card'
  13  |     };
  14  | 
  15  |     const response = await request.post(`${baseURL}/payments`, {
  16  |       data: paymentData
  17  |     });
  18  | 
> 19  |     expect(response.status()).toBe(201);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  20  |     const responseBody = await response.json();
  21  |     expect(responseBody).toHaveProperty('id');
  22  |     expect(responseBody.amount).toBe(100.00);
  23  |     expect(responseBody.status).toBe('pending');
  24  |   });
  25  | 
  26  |   test('should retrieve payment details by ID', async ({ request }) => {
  27  |     // First create a payment
  28  |     const paymentData = {
  29  |       amount: 50.00,
  30  |       currency: 'USD',
  31  |       description: 'Test payment for retrieval',
  32  |       customerId: 'cust_456',
  33  |       paymentMethod: 'card'
  34  |     };
  35  | 
  36  |     const createResponse = await request.post(`${baseURL}/payments`, {
  37  |       data: paymentData
  38  |     });
  39  | 
  40  |     const createdPayment = await createResponse.json();
  41  |     const paymentId = createdPayment.id;
  42  | 
  43  |     // Now retrieve the payment
  44  |     const getResponse = await request.get(`${baseURL}/payments/${paymentId}`);
  45  | 
  46  |     expect(getResponse.status()).toBe(200);
  47  |     const retrievedPayment = await getResponse.json();
  48  |     expect(retrievedPayment.id).toBe(paymentId);
  49  |     expect(retrievedPayment.amount).toBe(50.00);
  50  |   });
  51  | 
  52  |   test('should return 404 when retrieving non-existent payment', async ({ request }) => {
  53  |     const response = await request.get(`${baseURL}/payments/non_existent_id`);
  54  | 
  55  |     expect(response.status()).toBe(404);
  56  |     const responseBody = await response.json();
  57  |     expect(responseBody).toHaveProperty('error');
  58  |   });
  59  | 
  60  |   test('should update payment status', async ({ request }) => {
  61  |     // First create a payment
  62  |     const paymentData = {
  63  |       amount: 75.00,
  64  |       currency: 'USD',
  65  |       description: 'Test payment for update',
  66  |       customerId: 'cust_789',
  67  |       paymentMethod: 'card'
  68  |     };
  69  | 
  70  |     const createResponse = await request.post(`${baseURL}/payments`, {
  71  |       data: paymentData
  72  |     });
  73  | 
  74  |     const createdPayment = await createResponse.json();
  75  |     const paymentId = createdPayment.id;
  76  | 
  77  |     // Update the payment status
  78  |     const updateResponse = await request.patch(`${baseURL}/payments/${paymentId}`, {
  79  |       data: { status: 'completed' }
  80  |     });
  81  | 
  82  |     expect(updateResponse.status()).toBe(200);
  83  |     const updatedPayment = await updateResponse.json();
  84  |     expect(updatedPayment.status).toBe('completed');
  85  |   });
  86  | 
  87  |   test('should delete a payment', async ({ request }) => {
  88  |     // First create a payment
  89  |     const paymentData = {
  90  |       amount: 25.00,
  91  |       currency: 'USD',
  92  |       description: 'Test payment for deletion',
  93  |       customerId: 'cust_delete',
  94  |       paymentMethod: 'card'
  95  |     };
  96  | 
  97  |     const createResponse = await request.post(`${baseURL}/payments`, {
  98  |       data: paymentData
  99  |     });
  100 | 
  101 |     const createdPayment = await createResponse.json();
  102 |     const paymentId = createdPayment.id;
  103 | 
  104 |     // Delete the payment
  105 |     const deleteResponse = await request.delete(`${baseURL}/payments/${paymentId}`);
  106 | 
  107 |     expect(deleteResponse.status()).toBe(204);
  108 | 
  109 |     // Verify payment is deleted
  110 |     const getResponse = await request.get(`${baseURL}/payments/${paymentId}`);
  111 |     expect(getResponse.status()).toBe(404);
  112 |   });
  113 | 
  114 |   test('should return validation error for invalid amount', async ({ request }) => {
  115 |     const paymentData = {
  116 |       amount: -100.00,
  117 |       currency: 'USD',
  118 |       description: 'Invalid payment',
  119 |       customerId: 'cust_invalid',
```