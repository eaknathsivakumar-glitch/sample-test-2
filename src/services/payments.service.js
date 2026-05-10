class PaymentsService {
  constructor() {
    this.payments = new Map();
    this.nextId = 1;
  }

  createPayment(paymentData) {
    // Validate required fields
    if (!paymentData.amount || !paymentData.currency || !paymentData.customerId || !paymentData.paymentMethod) {
      throw new Error('Missing required fields');
    }

    // Validate amount
    if (paymentData.amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Validate currency
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY'];
    if (!validCurrencies.includes(paymentData.currency)) {
      throw new Error('Unsupported currency');
    }

    // Validate payment method
    const validMethods = ['card', 'bank_transfer', 'wallet'];
    if (!validMethods.includes(paymentData.paymentMethod)) {
      throw new Error('Unsupported payment method');
    }

    const id = `pay_${this.nextId++}`;
    const payment = {
      id,
      ...paymentData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      refundedAmount: 0
    };

    this.payments.set(id, payment);
    return payment;
  }

  getPayment(id) {
    const payment = this.payments.get(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  updatePayment(id, updates) {
    const payment = this.getPayment(id);
    const updated = { ...payment, ...updates };
    this.payments.set(id, updated);
    return updated;
  }

  deletePayment(id) {
    const exists = this.payments.has(id);
    if (!exists) {
      throw new Error('Payment not found');
    }
    this.payments.delete(id);
  }

  listPayments(filters = {}) {
    let payments = Array.from(this.payments.values());

    if (filters.customerId) {
      payments = payments.filter(p => p.customerId === filters.customerId);
    }

    if (filters.status) {
      payments = payments.filter(p => p.status === filters.status);
    }

    return payments;
  }

  refundPayment(id, amount) {
    const payment = this.getPayment(id);

    if (amount > payment.amount) {
      throw new Error('Refund amount exceeds payment amount');
    }

    const refundedAmount = payment.refundedAmount + amount;
    const status = refundedAmount === payment.amount ? 'refunded' : 'partially_refunded';

    const updated = {
      ...payment,
      refundedAmount,
      status
    };

    this.payments.set(id, updated);
    return updated;
  }
}

module.exports = new PaymentsService();
