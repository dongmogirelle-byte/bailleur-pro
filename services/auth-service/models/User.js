const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schéma User pour le microservice d'authentification
 * Représente un bailleur ou un locataire
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez fournir un email valide'
    ]
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false // Ne pas retourner le mot de passe par défaut
  },
  role: {
    type: String,
    enum: ['bailleur', 'locataire'],
    default: 'bailleur'
  },
  plan: {
    type: String,
    enum: ['gratuit', 'pro'],
    default: 'gratuit'
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour optimiser les recherches
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Middleware avant sauvegarde - Hash du mot de passe
userSchema.pre('save', async function(next) {
  // Ne hasher que si le mot de passe a été modifié
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware avant mise à jour
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erreur lors de la comparaison des mots de passe');
  }
};

// Méthode pour générer un token JWT (sera utilisé dans le contrôleur)
userSchema.methods.getSignedJwtToken = function() {
  // Cette méthode sera implémentée dans le contrôleur avec jsonwebtoken
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    plan: this.plan
  };
};

// Méthode pour retourner l'utilisateur sans données sensibles
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
