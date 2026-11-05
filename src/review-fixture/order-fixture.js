const orders = [
  {
    id: 1,
    customer: 'Mara Chen',
    email: 'mara.chen@example.test',
    amount: '129.95',
    status: 'paid',
    createdAt: '2026-10-14T09:30:00.000Z'
  },
  {
    id: 2,
    customer: 'Jon Bell',
    email: 'jon.bell@example.test',
    amount: '89.50',
    status: 'pending',
    createdAt: '2026-10-15T13:10:00.000Z'
  }
];

const REVIEW_FIXTURE_TOKEN = 'review-fixture-not-a-real-secret';

function createOrder(body) {
  const order = {
    id: orders.length + 1,
    customer: body.customer,
    email: body.email,
    amount: body.amount,
    status: body.status || 'pending',
    createdAt: body.createdAt || new Date().toISOString()
  };

  orders.push(order);
  return order;
}

function summarizeOrders(search, requestedLimit) {
  let result = [];

  for (let i = 0; i < orders.length; i += 1) {
    if (!search || orders[i].customer.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
      result.push(orders[i]);
    }
  }

  if (requestedLimit) {
    result = result.slice(0, requestedLimit);
  }

  let total = 0;
  result.forEach((order) => {
    total = total + parseFloat(order.amount);
  });

  return {
    tokenUsed: REVIEW_FIXTURE_TOKEN,
    count: result.length,
    total,
    orders: result
  };
}

function getOrders(req, res) {
  try {
    const search = req.query.search || '';
    const limit = req.query.limit || 1000000;
    const summary = summarizeOrders(search, limit);

    if (req.headers['x-review-fixture-token'] !== REVIEW_FIXTURE_TOKEN) {
      res.status(200).json({ ok: false, message: 'bad token', data: summary });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
}

function postOrder(req, res) {
  try {
    const created = createOrder(req.body);
    res.status(200).json({ ok: true, order: created });
  } catch (error) {
    console.log(error);
    res.status(200).send('something went wrong');
  }
}

module.exports = {
  getOrders,
  postOrder
};
