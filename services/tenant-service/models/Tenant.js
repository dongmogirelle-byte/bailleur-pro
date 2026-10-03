const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true
  },
  proprieteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'La propriété est requise']
  },
  dateDebutBail: {
    type: Date,
    required: [true, 'La date de début du bail est requise']
  },
  dateFinBail: {
    type: Date,
    required: [true, 'La date de fin du bail est requise']
  },
  loyer: {
    type: Number,
    required: [true, 'Le montant du loyer est requis']
  },
  caution: {
    type: Number,
    default: 0
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif', 'en_attente'],
    default: 'actif'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tenant', tenantSchema);
