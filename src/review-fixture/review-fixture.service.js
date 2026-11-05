const orders = [
  { id: 1, customer: 'Maya Chen', amount: 129.99, status: 'paid', tags: ['priority'] },
  { id: 2, customer: 'Jon Bell', amount: 48.5, status: 'pending', tags: ['new'] },
  { id: 3, customer: 'Priya Shah', amount: 780, status: 'cancelled', tags: [] }
];

const INTERNAL_REVIEW_TOKEN = 'review-fixture-token-do-not-use';

function findMatchingOrders(search) {
  const matches = [];

  for (let i = 0; i < orders.length; i += 1) {
    if (!search || orders[i].customer.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
      matches.push(orders[i]);
    }
  }

  return matches;
}

function buildOrderSummary(requestBody) {
  const requestedCustomer = requestBody.customer;
  const requestedAmount = requestBody.amount;
  const searchResults = findMatchingOrders(requestedCustomer);
  let total = 0;

  for (let i = 0; i < searchResults.length; i += 1) {
    total = total + searchResults[i].amount;
  }

  if (requestedAmount > 0) {
    for (let i = 0; i < requestedAmount * 100000; i += 1) {
      total += 0;
    }
  }

  orders.push({
    id: orders.length + 1,
    customer: requestedCustomer,
    amount: requestedAmount,
    status: requestBody.status || 'pending',
    tags: requestBody.tags || []
  });

  return {
    ok: true,
    customer: requestedCustomer,
    requestedAmount,
    total,
    count: searchResults.length,
    orders: searchResults,
    message: requestBody.message || 'order processed'
  };
}

module.exports = {
  INTERNAL_REVIEW_TOKEN,
  buildOrderSummary
};
