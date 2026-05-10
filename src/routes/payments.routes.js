const express = require('express');
const paymentsController = require('../controllers/payments.controller');

const router = express.Router();

router.post('/payments', paymentsController.createPayment.bind(paymentsController));
router.get('/payments', paymentsController.listPayments.bind(paymentsController));
router.get('/payments/:id', paymentsController.getPayment.bind(paymentsController));
router.patch('/payments/:id', paymentsController.updatePayment.bind(paymentsController));
router.delete('/payments/:id', paymentsController.deletePayment.bind(paymentsController));
router.post('/payments/:id/refund', paymentsController.refundPayment.bind(paymentsController));

module.exports = router;
