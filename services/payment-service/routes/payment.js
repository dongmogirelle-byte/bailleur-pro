const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  validatePayment,
  rejectPayment,
  getPaymentsByTenant,
  getPaymentsByProperty,
  getUnpaidPayments,
  uploadProof
} = require('../controllers/paymentController');

router.route('/')
  .get(getPayments)
  .post(createPayment);

router.route('/:id')
  .get(getPaymentById);

router.put('/:id/validate', validatePayment);
router.put('/:id/reject', rejectPayment);
router.put('/:id/proof', uploadProof);

router.get('/tenant/:tenantId', getPaymentsByTenant);
router.get('/property/:propertyId', getPaymentsByProperty);
router.get('/unpaid', getUnpaidPayments);

module.exports = router;
