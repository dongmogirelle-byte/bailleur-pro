const { body, param, query } = require('express-validator');

/**
 * Validation pour créer une propriété
 */
exports.validerCreationPropriete = [
  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Le nom de la propriété est obligatoire')
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom doit contenir entre 3 et 100 caractères'),

  body('type')
    .isIn(['maison', 'appartement', 'immeuble', 'terrain', 'bureau', 'commerce'])
    .withMessage('Type de propriété invalide'),

  body('adresse.rue')
    .trim()
    .notEmpty()
    .withMessage('La rue est obligatoire'),

  body('adresse.numero')
    .trim()
    .notEmpty()
    .withMessage('Le numéro est obligatoire'),

  body('adresse.quartier')
    .trim()
    .notEmpty()
    .withMessage('Le quartier est obligatoire'),

  body('adresse.ville')
    .trim()
    .notEmpty()
    .withMessage('La ville est obligatoire'),

  body('caracteristiques.surface')
    .isNumeric()
    .withMessage('La surface doit être un nombre')
    .isFloat({ min: 1 })
    .withMessage('La surface doit être supérieure à 0'),

  body('loyer')
    .isNumeric()
    .withMessage('Le loyer doit être un nombre')
    .isFloat({ min: 0 })
    .withMessage('Le loyer ne peut pas être négatif')
];

/**
 * Validation pour mettre à jour une propriété
 */
exports.validerMiseAJourPropriete = [
  body('nom')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Le nom de la propriété est obligatoire')
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom doit contenir entre 3 et 100 caractères'),

  body('type')
    .optional()
    .isIn(['maison', 'appartement', 'immeuble', 'terrain', 'bureau', 'commerce'])
    .withMessage('Type de propriété invalide'),

  body('loyer')
    .optional()
    .isNumeric()
    .withMessage('Le loyer doit être un nombre')
    .isFloat({ min: 0 })
    .withMessage('Le loyer ne peut pas être négatif')
];

/**
 * Validation pour changer le statut
 */
exports.validerChangementStatut = [
  body('statut')
    .isIn(['disponible', 'occupee', 'en_maintenance', 'en_vente', 'reservee'])
    .withMessage('Statut invalide')
];

/**
 * Validation pour l'ID de propriété
 */
exports.validerIdPropriete = [
  param('id')
    .isMongoId()
    .withMessage('ID de propriété invalide')
];

/**
 * Validation pour les paramètres de requête
 */
exports.validerParametresRequete = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),

  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),

  query('loyerMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le loyer minimum doit être positif'),

  query('loyerMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le loyer maximum doit être positif'),

  query('chambresMin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le nombre de chambres minimum doit être un entier positif')
];

/**
 * Validation pour ajouter une photo
 */
exports.validerAjoutPhoto = [
  body('url')
    .trim()
    .notEmpty()
    .withMessage('L\'URL de la photo est obligatoire')
    .isURL()
    .withMessage('L\'URL de la photo est invalide'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La description ne peut pas dépasser 200 caractères')
];
