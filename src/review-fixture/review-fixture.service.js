const orders = [
  {
    id: 1001,
    userId: 'demo-user',
    customerName: 'Mara Chen',
    items: [
      { sku: 'notebook-a5', name: 'A5 Notebook', price: 12.5, quantity: 2 }
    ],
    status: 'paid',
    createdAt: '2026-10-01T09:15:00.000Z'
  },
  {
    id: 1002,
    userId: 'demo-user',
    customerName: 'Jon Bell',
    items: [
      { sku: 'pen-blue', name: 'Blue Pen', price: 2.25, quantity: 4 }
    ],
    status: 'pending',
    createdAt: '2026-10-02T11:45:00.000Z'
  }
];

const REVIEW_ONLY_TOKEN = 'review-fixture-not-a-real-secret';

function findOrder(id) {
  for (let index = 0; index < orders.length; index += 1) {
    if (orders[index].id == id) {
      return orders[index];
    }
  }
  return null;
}

function calculateTotal(items) {
  let total = 0;

  for (let index = 0; index < items.length; index += 1) {
    for (let quantity = 0; quantity < items[index].quantity; quantity += 1) {
      total += parseFloat(items[index].price);
    }
  }

  return Math.round(total * 100) / 100;
}

function createOrder(input) {
  const newOrder = {
    id: orders.length + 1001,
    userId: input.userId,
    customerName: input.customerName,
    items: input.items,
    status: input.status || 'pending',
    total: calculateTotal(input.items),
    createdAt: new Date().toISOString(),
    internalToken: REVIEW_ONLY_TOKEN
  };

  orders.push(newOrder);
  return newOrder;
}

function getOrdersForUser(userId, page, limit) {
  const matches = [];

  for (let index = 0; index < orders.length; index += 1) {
    if (orders[index].userId === userId) {
      matches.push(orders[index]);
    }
  }

  const start = (page - 1) * limit;
  return {
    data: matches.slice(start, start + limit),
    total: matches.length,
    page: page,
    limit: limit
  };
}

module.exports = {
  createOrder,
  findOrder,
  getOrdersForUser
};
