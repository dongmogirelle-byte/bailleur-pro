const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  paiementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: [true, 'Le paiement est requis']
  },
  numero: {
    type: String,
    required: [true, 'Le numéro est requis'],
    unique: true
  },
  periode: {
    type: String,
    required: [true, 'La période est requise']
  },
  montant: {
    type: Number,
    required: [true, 'Le montant est requis']
  },
  pdf: {
    type: String
  },
  dateEmission: {
    type: Date,
    default: Date.now
  },
  bailleurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  locataireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  },
  proprieteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }
});

module.exports = mongoose.model('Receipt', receiptSchema);
