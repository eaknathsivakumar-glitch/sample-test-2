import { test, expect } from '@playwright/test';

test.describe('Payments API', () => {
  const baseURL = 'http://localhost:8080/api/v1';

  test('should create a payment successfully', async ({ request }) => {
    const paymentData = {
      amount: 100.00,
      currency: 'USD',
      description: 'Test payment',
      customerId: 'cust_123',
      paymentMethod: 'card'
    };

    const response = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.amount).toBe(100.00);
    expect(responseBody.status).toBe('pending');
  });

  test('should retrieve payment details by ID', async ({ request }) => {
    // First create a payment
    const paymentData = {
      amount: 50.00,
      currency: 'USD',
      description: 'Test payment for retrieval',
      customerId: 'cust_456',
      paymentMethod: 'card'
    };

    const createResponse = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    const createdPayment = await createResponse.json();
    const paymentId = createdPayment.id;

    // Now retrieve the payment
    const getResponse = await request.get(`${baseURL}/payments/${paymentId}`);

    expect(getResponse.status()).toBe(200);
    const retrievedPayment = await getResponse.json();
    expect(retrievedPayment.id).toBe(paymentId);
    expect(retrievedPayment.amount).toBe(50.00);
  });

  test('should return 404 when retrieving non-existent payment', async ({ request }) => {
    const response = await request.get(`${baseURL}/payments/non_existent_id`);

    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error');
  });

  test('should update payment status', async ({ request }) => {
    // First create a payment
    const paymentData = {
      amount: 75.00,
      currency: 'USD',
      description: 'Test payment for update',
      customerId: 'cust_789',
      paymentMethod: 'card'
    };

    const createResponse = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    const createdPayment = await createResponse.json();
    const paymentId = createdPayment.id;

    // Update the payment status
    const updateResponse = await request.patch(`${baseURL}/payments/${paymentId}`, {
      data: { status: 'completed' }
    });

    expect(updateResponse.status()).toBe(200);
    const updatedPayment = await updateResponse.json();
    expect(updatedPayment.status).toBe('completed');
  });

  test('should delete a payment', async ({ request }) => {
    // First create a payment
    const paymentData = {
      amount: 25.00,
      currency: 'USD',
      description: 'Test payment for deletion',
      customerId: 'cust_delete',
      paymentMethod: 'card'
    };

    const createResponse = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    const createdPayment = await createResponse.json();
    const paymentId = createdPayment.id;

    // Delete the payment
    const deleteResponse = await request.delete(`${baseURL}/payments/${paymentId}`);

    expect(deleteResponse.status()).toBe(204);

    // Verify payment is deleted
    const getResponse = await request.get(`${baseURL}/payments/${paymentId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should return validation error for invalid amount', async ({ request }) => {
    const paymentData = {
      amount: -100.00,
      currency: 'USD',
      description: 'Invalid payment',
      customerId: 'cust_invalid',
      paymentMethod: 'card'
    };

    const response = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toMatch(/invalid|amount/i);
  });

  test('should return validation error for missing required fields', async ({ request }) => {
    const paymentData = {
      amount: 100.00,
      // Missing currency, description, customerId, paymentMethod
    };

    const response = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error');
  });

  test('should list all payments', async ({ request }) => {
    const response = await request.get(`${baseURL}/payments`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody.payments) || Array.isArray(responseBody)).toBe(true);
  });

  test('should filter payments by customer ID', async ({ request }) => {
    const customerId = 'cust_filter_test';

    // Create a payment for this customer
    const paymentData = {
      amount: 150.00,
      currency: 'USD',
      description: 'Test payment for filtering',
      customerId: customerId,
      paymentMethod: 'card'
    };

    await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    // Filter payments by customer ID
    const response = await request.get(`${baseURL}/payments?customerId=${customerId}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const payments = Array.isArray(responseBody.payments) ? responseBody.payments : responseBody;
    expect(payments.length).toBeGreaterThan(0);
    expect(payments.every((p: any) => p.customerId === customerId)).toBe(true);
  });

  test('should handle concurrent payment creation', async ({ request }) => {
    const paymentPromises = [];

    for (let i = 0; i < 5; i++) {
      const paymentData = {
        amount: 10.00 * (i + 1),
        currency: 'USD',
        description: `Concurrent payment ${i + 1}`,
        customerId: `cust_concurrent_${i}`,
        paymentMethod: 'card'
      };

      paymentPromises.push(
        request.post(`${baseURL}/payments`, {
          data: paymentData
        })
      );
    }

    const responses = await Promise.all(paymentPromises);

    responses.forEach((response) => {
      expect(response.status()).toBe(201);
    });
  });

  test('should return proper error for unsupported currency', async ({ request }) => {
    const paymentData = {
      amount: 100.00,
      currency: 'INVALID_CURRENCY',
      description: 'Test payment with invalid currency',
      customerId: 'cust_invalid_currency',
      paymentMethod: 'card'
    };

    const response = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error');
  });

  test('should return proper error for unsupported payment method', async ({ request }) => {
    const paymentData = {
      amount: 100.00,
      currency: 'USD',
      description: 'Test payment with invalid method',
      customerId: 'cust_invalid_method',
      paymentMethod: 'invalid_method'
    };

    const response = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error');
  });

  test('should handle payment refund', async ({ request }) => {
    // First create a payment
    const paymentData = {
      amount: 200.00,
      currency: 'USD',
      description: 'Test payment for refund',
      customerId: 'cust_refund',
      paymentMethod: 'card'
    };

    const createResponse = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    const createdPayment = await createResponse.json();
    const paymentId = createdPayment.id;

    // Refund the payment
    const refundResponse = await request.post(`${baseURL}/payments/${paymentId}/refund`, {
      data: { amount: 200.00 }
    });

    expect(refundResponse.status()).toBe(200);
    const refundedPayment = await refundResponse.json();
    expect(refundedPayment.status).toBe('refunded');
  });

  test('should return error when refunding more than payment amount', async ({ request }) => {
    // First create a payment
    const paymentData = {
      amount: 50.00,
      currency: 'USD',
      description: 'Test payment for partial refund',
      customerId: 'cust_partial_refund',
      paymentMethod: 'card'
    };

    const createResponse = await request.post(`${baseURL}/payments`, {
      data: paymentData
    });

    const createdPayment = await createResponse.json();
    const paymentId = createdPayment.id;

    // Try to refund more than the payment amount
    const refundResponse = await request.post(`${baseURL}/payments/${paymentId}/refund`, {
      data: { amount: 100.00 }
    });

    expect(refundResponse.status()).toBe(400);
    const responseBody = await refundResponse.json();
    expect(responseBody).toHaveProperty('error');
  });
});
