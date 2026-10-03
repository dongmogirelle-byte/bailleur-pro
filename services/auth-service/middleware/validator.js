const { body, validationResult } = require('express-validator');

/**
 * Middleware de validation des données d'inscription
 */
exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est obligatoire')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est obligatoire')
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est obligatoire')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),

  body('role')
    .optional()
    .isIn(['bailleur', 'locataire'])
    .withMessage('Le rôle doit être "bailleur" ou "locataire"'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware de validation des données de connexion
 */
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est obligatoire')
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est obligatoire'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware de validation de la mise à jour du profil
 */
exports.validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware de validation du changement de mot de passe
 */
exports.validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est obligatoire'),

  body('newPassword')
    .notEmpty()
    .withMessage('Le nouveau mot de passe est obligatoire')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array()
      });
    }
    next();
  }
];
