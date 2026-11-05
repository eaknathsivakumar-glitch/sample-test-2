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

const MAX_ITEMS = 50;
const MAX_ITEM_QUANTITY = 1000;
const MAX_CUSTOMER_NAME_LENGTH = 200;

function validateOrderInput(input) {
  if (!input || typeof input !== 'object' || !Array.isArray(input.items)) {
    throw new Error('Invalid order payload');
  }

  if (
    typeof input.customerName !== 'string' ||
    input.customerName.trim().length === 0 ||
    input.customerName.length > MAX_CUSTOMER_NAME_LENGTH
  ) {
    throw new Error('Invalid customer name');
  }

  if (input.items.length === 0 || input.items.length > MAX_ITEMS) {
    throw new Error('Invalid order items');
  }

  for (const item of input.items) {
    if (
      !item ||
      typeof item.sku !== 'string' ||
      item.sku.trim().length === 0 ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_ITEM_QUANTITY
    ) {
      throw new Error('Invalid order item');
    }
  }
}

function findOrder(id, userId) {
  return orders.find(
    (order) => String(order.id) === String(id) && order.userId === userId
  ) || null;
}

function calculateTotal(items) {
  return Math.round(
    items.reduce((total, item) => total + item.price * item.quantity, 0) * 100
  ) / 100;
}

function createOrder(input, userId) {
  validateOrderInput(input);

  const newOrder = {
    id: orders.length + 1001,
    userId,
    customerName: input.customerName.trim(),
    items: input.items,
    status: 'pending',
    total: calculateTotal(input.items),
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  return newOrder;
}

function getOrdersForUser(userId, page, limit) {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 20;
  const matches = orders.filter((order) => order.userId === userId);
  const start = (safePage - 1) * safeLimit;

  return {
    data: matches.slice(start, start + safeLimit),
    total: matches.length,
    page: safePage,
    limit: safeLimit
  };
}

module.exports = {
  createOrder,
  findOrder,
  getOrdersForUser
};
