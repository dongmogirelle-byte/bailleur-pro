const express = require('express');
const router = express.Router();
const {
  creerPropriete,
  obtenirProprietes,
  obtenirProprieteParId,
  mettreAJourPropriete,
  supprimerPropriete,
  obtenirProprietesBailleur,
  changerStatutPropriete,
  ajouterPhoto,
  obtenirStatistiquesBailleur
} = require('../controllers/propertyController');
const {
  validerCreationPropriete,
  validerMiseAJourPropriete,
  validerChangementStatut,
  validerIdPropriete,
  validerParametresRequete,
  validerAjoutPhoto
} = require('../middleware/validator');

// Middleware de validation centralisé
const valider = (req, res, next) => {
  const erreurs = req.validationErrors();
  if (erreurs) {
    return res.status(400).json({
      succes: false,
      message: 'Erreur de validation',
      erreurs: erreurs.map(e => ({
        champ: e.param,
        message: e.msg
      }))
    });
  }
  next();
};

/**
 * @route   POST /api/properties
 * @desc    Créer une nouvelle propriété
 * @access  Privé (bailleur)
 */
router.post('/', validerCreationPropriete, valider, creerPropriete);

/**
 * @route   GET /api/properties
 * @desc    Obtenir toutes les propriétés avec filtres
 * @access  Public
 */
router.get('/', validerParametresRequete, valider, obtenirProprietes);

/**
 * @route   GET /api/properties/bailleur/:bailleurId
 * @desc    Obtenir toutes les propriétés d'un bailleur
 * @access  Public
 */
router.get('/bailleur/:bailleurId', validerIdPropriete, valider, obtenirProprietesBailleur);

/**
 * @route   GET /api/properties/statistiques/bailleur/:bailleurId
 * @desc    Obtenir les statistiques des propriétés d'un bailleur
 * @access  Privé (bailleur)
 */
router.get('/statistiques/bailleur/:bailleurId', validerIdPropriete, valider, obtenirStatistiquesBailleur);

/**
 * @route   GET /api/properties/:id
 * @desc    Obtenir une propriété par ID
 * @access  Public
 */
router.get('/:id', validerIdPropriete, valider, obtenirProprieteParId);

/**
 * @route   PUT /api/properties/:id
 * @desc    Mettre à jour une propriété
 * @access  Privé (bailleur propriétaire)
 */
router.put('/:id', validerIdPropriete, validerMiseAJourPropriete, valider, mettreAJourPropriete);

/**
 * @route   PUT /api/properties/:id/statut
 * @desc    Changer le statut d'une propriété
 * @access  Privé (bailleur propriétaire)
 */
router.put('/:id/statut', validerIdPropriete, validerChangementStatut, valider, changerStatutPropriete);

/**
 * @route   POST /api/properties/:id/photos
 * @desc    Ajouter une photo à une propriété
 * @access  Privé (bailleur propriétaire)
 */
router.post('/:id/photos', validerIdPropriete, validerAjoutPhoto, valider, ajouterPhoto);

/**
 * @route   DELETE /api/properties/:id
 * @desc    Supprimer une propriété (désactivation)
 * @access  Privé (bailleur propriétaire)
 */
router.delete('/:id', validerIdPropriete, valider, supprimerPropriete);

module.exports = router;
