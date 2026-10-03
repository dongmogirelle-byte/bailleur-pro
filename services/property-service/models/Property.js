const mongoose = require('mongoose');

/**
 * Schéma de propriété pour Bailleur Pro
 * Gère les maisons, appartements et immeubles
 */
const propertySchema = new mongoose.Schema({
  // Informations de base
  nom: {
    type: String,
    required: [true, 'Le nom de la propriété est obligatoire'],
    trim: true
  },
  
  type: {
    type: String,
    required: [true, 'Le type de propriété est obligatoire'],
    enum: ['maison', 'appartement', 'immeuble', 'terrain', 'bureau', 'commerce'],
    default: 'maison'
  },
  
  // Adresse complète
  adresse: {
    rue: {
      type: String,
      required: [true, 'La rue est obligatoire']
    },
    numero: {
      type: String,
      required: [true, 'Le numéro est obligatoire']
    },
    quartier: {
      type: String,
      required: [true, 'Le quartier est obligatoire']
    },
    ville: {
      type: String,
      required: [true, 'La ville est obligatoire']
    },
    pays: {
      type: String,
      default: 'Cameroun'
    },
    codePostal: {
      type: String
    }
  },
  
  // Caractéristiques
  caracteristiques: {
    chambres: {
      type: Number,
      default: 0,
      min: 0
    },
    sallesDeBain: {
      type: Number,
      default: 0,
      min: 0
    },
    surface: {
      type: Number,
      required: [true, 'La surface est obligatoire'],
      min: 0
    },
    etages: {
      type: Number,
      default: 1,
      min: 1
    },
    anneeConstruction: {
      type: Number
    },
    parking: {
      type: Boolean,
      default: false
    },
    nombreParking: {
      type: Number,
      default: 0
    },
    jardin: {
      type: Boolean,
      default: false
    },
    piscine: {
      type: Boolean,
      default: false
    },
    balcon: {
      type: Boolean,
      default: false
    },
    meuble: {
      type: Boolean,
      default: false
    },
    climatisation: {
      type: Boolean,
      default: false
    },
    chauffage: {
      type: Boolean,
      default: false
    }
  },
  
  // Informations financières
  loyer: {
    type: Number,
    required: [true, 'Le montant du loyer est obligatoire'],
    min: 0
  },
  
  devise: {
    type: String,
    default: 'XAF',
    enum: ['XAF', 'EUR', 'USD']
  },
  
  caution: {
    type: Number,
    default: 0
  },
  
  // Statut de la propriété
  statut: {
    type: String,
    enum: ['disponible', 'occupee', 'en_maintenance', 'en_vente', 'reservee'],
    default: 'disponible'
  },
  
  // Propriétaire (bailleur)
  bailleurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'identifiant du bailleur est obligatoire']
  },
  
  // Locataire actuel (si occupée)
  locataireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Photos
  photos: [{
    url: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    ordre: {
      type: Number,
      default: 0
    }
  }],
  
  // Description détaillée
  description: {
    type: String,
    maxlength: 2000
  },
  
  // Équipements supplémentaires
  equipements: [{
    type: String
  }],
  
  // Règles et conditions
  regles: {
    animauxAutorises: {
      type: Boolean,
      default: false
    },
    fumeursAutorises: {
      type: Boolean,
      default: false
    },
    dureeMinimaleBail: {
      type: Number,
      default: 6
    },
    dureeMaximaleBail: {
      type: Number,
      default: 12
    }
  },
  
  // Métadonnées
  dateCreation: {
    type: Date,
    default: Date.now
  },
  
  dateModification: {
    type: Date,
    default: Date.now
  },
  
  dateDisponibilite: {
    type: Date,
    default: Date.now
  },
  
  // Statistiques
  nombreVues: {
    type: Number,
    default: 0
  },
  
  nombreInterets: {
    type: Number,
    default: 0
  },
  
  // Active/Inactive
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
propertySchema.index({ bailleurId: 1 });
propertySchema.index({ statut: 1 });
propertySchema.index({ ville: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ loyer: 1 });

// Middleware pour mettre à jour la date de modification
propertySchema.pre('save', function(next) {
  this.dateModification = Date.now();
  next();
});

// Méthode pour vérifier si la propriété est disponible
propertySchema.methods.estDisponible = function() {
  return this.statut === 'disponible';
};

// Méthode pour obtenir le loyer formaté
propertySchema.methods.getLoyerFormate = function() {
  return `${this.loyer.toLocaleString()} ${this.devise}`;
};

module.exports = mongoose.model('Property', propertySchema);
