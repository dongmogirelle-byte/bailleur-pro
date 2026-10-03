const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  proprieteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'La propriété est requise']
  },
  locataireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Le locataire est requis']
  },
  dateDebut: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  dateFin: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },
  montantLoyer: {
    type: Number,
    required: [true, 'Le montant du loyer est requis']
  },
  caution: {
    type: Number,
    default: 0
  },
  conditions: {
    type: String,
    default: ''
  },
  pdf: {
    type: String
  },
  statut: {
    type: String,
    enum: ['actif', 'expiré', 'résilié'],
    default: 'actif'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contract', contractSchema);
