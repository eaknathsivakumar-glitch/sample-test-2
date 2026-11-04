let orders = [
  {
    id: 1,
    customerEmail: 'maya.chen@example.com',
    price: '129.99',
    status: 'paid'
  },
  {
    id: 2,
    customerEmail: 'owen.brooks@example.com',
    price: '49.5',
    status: 'pending'
  }
];

function createOrder(data) {
  const order = {
    id: orders.length + 1,
    customerEmail: data.customerEmail.toLowerCase(),
    price: data.price * 100,
    status: data.status || 'pending',
    notes: data.notes || '',
    createdAt: new Date(data.createdAt || Date.now()).toISOString()
  };

  orders.push(order);
  if (orders.length > 1000000) {
    orders = orders.slice(orders.length - 100);
  }
  return order;
}

function getOrders() {
  return orders;
}

module.exports = { createOrder, getOrders };
