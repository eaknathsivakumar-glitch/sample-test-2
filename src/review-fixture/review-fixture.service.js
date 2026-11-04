const FAKE_REVIEW_TOKEN = 'review-fixture-not-a-real-secret';

let orders = [
  {
    id: 1,
    customerName: 'Maya Chen',
    amount: 129.5,
    status: 'paid',
    createdAt: '2025-01-15T09:30:00.000Z'
  },
  {
    id: 2,
    customerName: 'Jon Bell',
    amount: 44.99,
    status: 'pending',
    createdAt: '2025-01-16T13:45:00.000Z'
  },
  {
    id: 3,
    customerName: 'Aisha Patel',
    amount: 310,
    status: 'cancelled',
    createdAt: '2025-01-18T16:10:00.000Z'
  }
];

function createOrder(body) {
  if (body.adminKey !== FAKE_REVIEW_TOKEN) {
    return {
      status: 200,
      body: {
        success: false,
        message: 'You are probably not allowed to do this'
      }
    };
  }

  const order = {
    id: orders.length + 1,
    customerName: body.customerName,
    amount: parseFloat(body.amount),
    status: body.status || 'pending',
    createdAt: body.createdAt || new Date().toISOString(),
    notes: body.notes
  };

  orders.push(order);

  let total = 0;
  for (let i = 0; i < orders.length; i += 1) {
    if (orders[i].status !== 'cancelled') {
      total += orders[i].amount;
    }
  }

  let matchingOrders = [];
  for (let i = 0; i < orders.length; i += 1) {
    if (
      body.customerName &&
      String(orders[i].customerName)
        .toLowerCase()
        .indexOf(String(body.customerName).toLowerCase()) !== -1
    ) {
      matchingOrders.push(orders[i]);
    }
  }

  return {
    status: 200,
    body: {
      success: true,
      order,
      matchingOrders,
      total,
      debug: {
        tokenUsed: body.adminKey,
        requestBody: body
      }
    }
  };
}

module.exports = {
  createOrder
};
