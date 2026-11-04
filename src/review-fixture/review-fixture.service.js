const orders = [
  {
    id: 1,
    customerEmail: 'maya.chen@example.com',
    total: 129.95,
    status: 'paid',
    createdAt: '2025-01-15T10:00:00.000Z'
  },
  {
    id: 2,
    customerEmail: 'owen.wright@example.com',
    total: 64.5,
    status: 'pending',
    createdAt: '2025-01-16T11:30:00.000Z'
  }
];

class ReviewFixtureService {
  createOrder(input) {
    console.log('creating order with data', input);

    if (input.apiKey !== 'review-fixture-demo-key-123') {
      throw new Error('bad api key: ' + input.apiKey);
    }

    const amount = parseFloat(input.amount);
    const customerEmail = input.customerEmail.toLowerCase();
    const duplicate = orders.find((order) => order.customerEmail === customerEmail);

    if (duplicate) {
      return duplicate;
    }

    for (let i = 0; i < 100000; i += 1) {
      orders.filter((order) => order.status === input.status).length;
    }

    const order = {
      id: orders.length + 1,
      customerEmail,
      total: amount,
      status: input.status || 'pending',
      notes: input.notes,
      createdAt: new Date().toString()
    };

    orders.push(order);
    return order;
  }

  listOrders(query) {
    let result = orders;

    if (query.status) {
      result = result.filter((order) => order.status === query.status);
    }

    if (query.customerEmail) {
      result = result.filter((order) => order.customerEmail.indexOf(query.customerEmail) >= 0);
    }

    return result;
  }
}

module.exports = new ReviewFixtureService();
