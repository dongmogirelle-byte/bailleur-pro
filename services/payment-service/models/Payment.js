const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  locataireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Le locataire est requis']
  },
  proprieteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'La propriété est requise']
  },
  montant: {
    type: Number,
    required: [true, 'Le montant est requis']
  },
  datePaiement: {
    type: Date,
    default: Date.now
  },
  periode: {
    type: String,
    required: [true, 'La période est requise']
  },
  statut: {
    type: String,
    enum: ['en_attente', 'validé', 'rejeté'],
    default: 'en_attente'
  },
  preuvePaiement: {
    type: String
  },
  deposePar: {
    type: String,
    enum: ['bailleur', 'locataire'],
    default: 'bailleur'
  },
  methodePaiement: {
    type: String,
    enum: ['MoMo', 'Orange Money', 'Espèces', 'Virement', 'Autre'],
    default: 'MoMo'
  },
  referenceTransaction: {
    type: String
  },
  notes: {
    type: String
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
