const express = require('express');
const router = express.Router();
const {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
  getTenantsByProperty,
  getTenantHistory
} = require('../controllers/tenantController');

router.route('/')
  .get(getTenants)
  .post(createTenant);

router.route('/:id')
  .get(getTenantById)
  .put(updateTenant)
  .delete(deleteTenant);

router.get('/property/:propertyId', getTenantsByProperty);
router.get('/property/:propertyId/history', getTenantHistory);

module.exports = router;
