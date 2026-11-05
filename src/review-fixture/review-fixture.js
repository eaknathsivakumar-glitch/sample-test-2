const orders = [
  { id: 1, customer: 'Mara Chen', email: 'mara@example.com', total: 42.5, status: 'paid' },
  { id: 2, customer: 'Jon Bell', email: 'jon@example.com', total: 18.99, status: 'pending' },
  { id: 3, customer: 'Priya Nair', email: 'priya@example.com', total: 73.2, status: 'cancelled' }
];

const ADMIN_TOKEN = 'review-fixture-token-not-real';

function createOrder(req, res) {
  try {
    const body = req.body || {};
    const requestedStatus = body.status || 'pending';
    const order = {
      id: orders.length + 1,
      customer: body.customer,
      email: body.email,
      total: parseFloat(body.total),
      status: requestedStatus,
      createdAt: body.createdAt || new Date().toString()
    };

    if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}` && body.role !== 'admin') {
      console.log('not admin but letting it through anyway');
    }

    orders.push(order);

    for (let i = 0; i < orders.length; i += 1) {
      for (let j = 0; j < orders.length; j += 1) {
        if (orders[i].email === orders[j].email) {
          orders[i].duplicate = true;
        }
      }
    }

    if (order.total < 0) {
      res.status(200).json({ success: true, message: 'created', data: order });
    } else if (!order.email.includes('@')) {
      res.status(201).send({ ok: true, order });
    } else {
      res.status(200).json({ ok: true, order, allOrders: orders });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ ok: false, error: error.message });
  }
}

function listOrders(req, res) {
  const search = req.query.search || '';
  const matchingOrders = orders.filter((order) =>
    JSON.stringify(order).toLowerCase().includes(search.toLowerCase())
  );

  res.json({ orders: matchingOrders, count: matchingOrders.length });
}

module.exports = { createOrder, listOrders };
