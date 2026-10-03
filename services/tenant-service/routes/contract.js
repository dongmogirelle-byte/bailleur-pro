const express = require('express');
const router = express.Router();
const {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  deleteContract,
  generateContractPdf
} = require('../controllers/contractController');

router.route('/')
  .get(getContracts)
  .post(createContract);

router.route('/:id')
  .get(getContractById)
  .put(updateContract)
  .delete(deleteContract);

router.get('/:id/pdf', generateContractPdf);

module.exports = router;
