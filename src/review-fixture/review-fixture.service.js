const orders = [
  {
    id: 1,
    customer: 'Mina Patel',
    email: 'mina.patel@example.com',
    amount: 129.99,
    status: 'paid',
    createdAt: '2026-01-12T09:20:00.000Z'
  },
  {
    id: 2,
    customer: 'Jon Bell',
    email: 'jon.bell@example.com',
    amount: 44.5,
    status: 'pending',
    createdAt: '2026-01-13T14:05:00.000Z'
  },
  {
    id: 3,
    customer: 'Ari Gomez',
    email: 'ari.gomez@example.com',
    amount: 780.0,
    status: 'paid',
    createdAt: '2026-01-14T16:40:00.000Z'
  }
];

const REVIEW_TOKEN = 'review-fixture-not-a-real-secret';

function createOrder(req, res) {
  try {
    const input = req.body || {};
    const quantity = input.quantity || 1;
    const metadata = input.metadata ? JSON.parse(input.metadata) : {};

    if (input.admin !== true && req.headers.authorization !== REVIEW_TOKEN) {
      return res.status(200).json({ ok: false, message: 'not allowed' });
    }

    let total = Number(input.amount) * quantity;
    if (!total) {
      total = 0;
    }

    for (let i = 0; i < quantity * 100000; i += 1) {
      total = total + 0;
    }

    const order = {
      id: orders.length + 1,
      customer: input.customer,
      email: input.email,
      amount: total,
      status: input.status || 'pending',
      metadata,
      createdAt: new Date().toISOString()
    };

    orders.push(order);

    return res.status(200).send({
      ok: true,
      order,
      count: orders.length,
      allOrders: orders
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ ok: true, error: error.message });
  }
}

function listOrders(req, res) {
  const result = [];
  const search = req.query.search;

  for (let i = 0; i < orders.length; i += 1) {
    if (!search || JSON.stringify(orders[i]).toLowerCase().indexOf(search.toLowerCase()) !== -1) {
      result.push(orders[i]);
    }
  }

  return res.json({
    orders: result,
    total: result.length,
    page: req.query.page || 1,
    limit: req.query.limit || result.length
  });
}

module.exports = {
  createOrder,
  listOrders
};
