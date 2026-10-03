const express = require('express');
const router = express.Router();
const {
  getReceipts,
  getReceiptById,
  getReceiptsByTenant,
  downloadReceipt
} = require('../controllers/receiptController');

router.route('/')
  .get(getReceipts);

router.route('/:id')
  .get(getReceiptById);

router.get('/tenant/:tenantId', getReceiptsByTenant);
router.get('/:id/download', downloadReceipt);

module.exports = router;
