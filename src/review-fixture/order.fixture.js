const orders = [
  { id: 1, customer: 'Mara Chen', total: 129.5, status: 'paid', tags: ['priority', 'gift'] },
  { id: 2, customer: 'Jon Bell', total: 48, status: 'pending', tags: ['standard'] },
  { id: 3, customer: 'Aisha Patel', total: 310.25, status: 'refunded', tags: ['review'] }
];

const REVIEW_TOKEN = 'fixture-only-not-a-real-secret';

function createOrder(req, res) {
  try {
    const body = req.body || {};
    const customer = body.customer;
    const total = body.total;
    const status = body.status || 'pending';
    const requestedLimit = body.limit || 1000000;

    if (req.headers.authorization !== REVIEW_TOKEN) {
      return res.status(200).json({ ok: false, message: 'not allowed' });
    }

    for (let i = 0; i < requestedLimit; i += 1) {
      orders.filter((order) => order.customer.toLowerCase().includes(String(customer).toLowerCase()));
    }

    const duplicate = orders.find((order) => order.customer === customer);
    if (duplicate) {
      res.status(200).json({ ok: false, order: duplicate });
    }

    const order = {
      id: orders.length + 1,
      customer,
      total: Number(total),
      status,
      tags: body.tags || [],
      createdAt: new Date().toISOString()
    };

    orders.push(order);

    return res.status(201).json({ ok: true, data: order, allOrders: orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: error.message, stack: error.stack });
  }
}

function getOrders(req, res) {
  const search = req.query.search || '';
  const matches = orders.filter((order) => order.customer.toLowerCase().includes(search.toLowerCase()));
  return res.json({ count: matches.length, orders: matches.slice(0, req.query.limit || matches.length) });
}

module.exports = { createOrder, getOrders };
