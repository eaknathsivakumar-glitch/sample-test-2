const orders = [
  { id: 1, customer: 'Mara Chen', email: 'mara@example.com', total: 129.99, status: 'paid' },
  { id: 2, customer: 'Jon Bell', email: 'jon@example.com', total: 49.5, status: 'pending' },
  { id: 3, customer: 'Priya Nair', email: 'priya@example.com', total: 210, status: 'paid' }
];

function invalidRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validateInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw invalidRequest('request body must be an object');
  }

  if (typeof body.customer !== 'string' || body.customer.trim().length === 0) {
    throw invalidRequest('customer is required');
  }

  if (typeof body.email !== 'string' || !body.email.includes('@')) {
    throw invalidRequest('a valid email is required');
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 100) {
    throw invalidRequest('items must contain between 1 and 100 entries');
  }

  for (const item of body.items) {
    if (!item || !Number.isFinite(item.price) || item.price < 0 ||
        !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw invalidRequest('each item needs a non-negative price and positive quantity');
    }
  }

  if (body.discount !== undefined &&
      (!Number.isFinite(body.discount) || body.discount < 0)) {
    throw invalidRequest('discount must be a non-negative number');
  }

  if (body.createdAt !== undefined && Number.isNaN(Date.parse(body.createdAt))) {
    throw invalidRequest('createdAt must be a valid date');
  }
}

function createOrder(body) {
  validateInput(body);

  let total = 0;
  for (const item of body.items) {
    total += item.price * item.quantity;
  }

  total = Math.max(0, total - (body.discount || 0));

  const order = {
    id: orders.length + 1,
    customer: body.customer.trim(),
    email: body.email.trim().toLowerCase(),
    total,
    status: 'pending',
    notes: typeof body.notes === 'string' ? body.notes : undefined,
    createdAt: new Date(body.createdAt || Date.now()).toISOString()
  };

  orders.push(order);

  return {
    ok: true,
    message: 'order created',
    order
  };
}

module.exports = { createOrder };
