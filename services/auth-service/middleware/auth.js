const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware d'authentification JWT
 * Vérifie la validité du token et ajoute l'utilisateur à la requête
 */
exports.protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est dans le header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraire le token du header "Bearer <token>"
    token = req.headers.authorization.split(' ')[1];
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token manquant'
    });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findById(decoded.id);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Compte désactivé'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token invalide'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token expiré'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification',
      error: error.message
    });
  }
};

/**
 * Middleware pour restreindre l'accès à certains rôles
 * @param  {...string} roles - Les rôles autorisés
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Utilisateur non authentifié'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Non autorisé - Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`
      });
    }

    next();
  };
};

/**
 * Middleware optionnel - Tente d'authentifier mais n'échoue pas si pas de token
 * Utile pour les routes qui fonctionnent avec et sans authentification
 */
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Ignorer les erreurs et continuer sans authentification
  }

  next();
};
