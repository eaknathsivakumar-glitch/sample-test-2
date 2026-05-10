const paymentsService = require('../services/payments.service');

class PaymentsController {
  createPayment(req, res) {
    try {
      const payment = paymentsService.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  getPayment(req, res) {
    try {
      const payment = paymentsService.getPayment(req.params.id);
      res.status(200).json(payment);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  updatePayment(req, res) {
    try {
      const payment = paymentsService.updatePayment(req.params.id, req.body);
      res.status(200).json(payment);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  deletePayment(req, res) {
    try {
      paymentsService.deletePayment(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  listPayments(req, res) {
    try {
      const payments = paymentsService.listPayments(req.query);
      res.status(200).json({ payments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  refundPayment(req, res) {
    try {
      const payment = paymentsService.refundPayment(req.params.id, req.body.amount);
      res.status(200).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PaymentsController();
