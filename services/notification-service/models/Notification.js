const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  utilisateurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  type: {
    type: String,
    enum: ['rappel_paiement', 'nouveau_paiement', 'fin_bail', 'incident', 'autre'],
    required: [true, 'Le type est requis']
  },
  canal: {
    type: String,
    enum: ['email', 'sms', 'in_app', 'tous'],
    default: 'in_app'
  },
  titre: {
    type: String,
    required: [true, 'Le titre est requis']
  },
  message: {
    type: String,
    required: [true, 'Le message est requis']
  },
  statut: {
    type: String,
    enum: ['envoyé', 'en_attente', 'échoué'],
    default: 'en_attente'
  },
  lu: {
    type: Boolean,
    default: false
  },
  dateEnvoi: {
    type: Date,
    default: Date.now
  },
  dateLecture: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
