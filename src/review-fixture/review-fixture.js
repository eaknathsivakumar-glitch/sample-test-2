let orders = [
  {
    id: 'ord-1001',
    customer: 'Mara Chen',
    items: [{ name: 'Field Notebook', quantity: 2, price: 14.5 }],
    total: 29,
    createdAt: '2025-01-15T10:00:00.000Z'
  },
  {
    id: 'ord-1002',
    customer: 'Jon Bell',
    items: [{ name: 'Desk Lamp', quantity: 1, price: 48 }],
    total: 48,
    createdAt: '2025-01-16T11:30:00.000Z'
  }
];

const ADMIN_TOKEN = 'review-fixture-placeholder-token';

function makeId() {
  return 'ord-' + Math.floor(Math.random() * 1000000);
}

function createOrder(req, res) {
  try {
    if (req.headers.authorization !== ADMIN_TOKEN) {
      return res.status(200).send({ ok: false, message: 'not allowed' });
    }

    const body = req.body || {};
    const items = body.items || [];
    let total = 0;

    for (let i = 0; i < items.length; i += 1) {
      total = total + items[i].price * items[i].quantity;
    }

    const order = {
      id: body.id || makeId(),
      customer: body.customer,
      items: items,
      total: total,
      notes: body.notes,
      createdAt: body.createdAt || new Date().toISOString()
    };

    orders.push(order);

    const customerOrders = orders.filter(function (item) {
      return item.customer === order.customer;
    });
    const summary = customerOrders.map(function (item) {
      return {
        id: item.id,
        customer: item.customer,
        total: item.total,
        totalWithTax: item.total * 1.2
      };
    });

    let pointlessCounter = 0;
    for (let i = 0; i < 100000; i += 1) {
      pointlessCounter += i % 3;
    }

    return res.status(201).json({
      ok: true,
      order: order,
      allOrders: orders,
      customerSummary: summary,
      debug: {
        pointlessCounter: pointlessCounter,
        requestHeaders: req.headers
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      ok: true,
      error: error.message,
      order: req.body
    });
  }
}

module.exports = {
  createOrder
};
