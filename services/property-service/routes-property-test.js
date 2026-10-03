const express = require('express');
const router = express.Router();

/**
 * Routes de test pour le Property Service (sans MongoDB)
 * Ces routes sont utilisées quand MongoDB n'est pas disponible
 */

// Stockage en mémoire pour les tests
const testProperties = [];

/**
 * @desc    Créer une propriété (mode test)
 * @route   POST /api/properties
 * @access  Privé
 */
router.post('/', (req, res) => {
  try {
    const propriete = {
      id: 'prop_' + Date.now(),
      ...req.body,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      nombreVues: 0,
      nombreInterets: 0,
      active: true
    };

    testProperties.push(propriete);

    res.status(201).json({
      succes: true,
      message: 'Propriété créée avec succès (Mode Test - Sans MongoDB)',
      donnees: propriete
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la création',
      erreur: erreur.message
    });
  }
});

/**
 * @desc    Obtenir toutes les propriétés (mode test)
 * @route   GET /api/properties
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    // Filtres
    let resultats = testProperties.filter(p => p.active !== false);

    if (req.query.bailleurId) {
      resultats = resultats.filter(p => p.bailleurId === req.query.bailleurId);
    }

    if (req.query.ville) {
      resultats = resultats.filter(p => p.adresse?.ville === req.query.ville);
    }

    if (req.query.type) {
      resultats = resultats.filter(p => p.type === req.query.type);
    }

    if (req.query.statut) {
      resultats = resultats.filter(p => p.statut === req.query.statut);
    }

    if (req.query.loyerMin) {
      resultats = resultats.filter(p => p.loyer >= parseFloat(req.query.loyerMin));
    }

    if (req.query.loyerMax) {
      resultats = resultats.filter(p => p.loyer <= parseFloat(req.query.loyerMax));
    }

    res.status(200).json({
      succes: true,
      nombre: resultats.length,
      total: resultats.length,
      donnees: resultats
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération',
      erreur: erreur.message
    });
  }
});

/**
 * @desc    Obtenir les propriétés d'un bailleur (mode test)
 * @route   GET /api/properties/bailleur/:bailleurId
 * @access  Public
 */
router.get('/bailleur/:bailleurId', (req, res) => {
  try {
    const proprietes = testProperties.filter(
      p => p.bailleurId === req.params.bailleurId && p.active !== false
    );

    res.status(200).json({
      succes: true,
      nombre: proprietes.length,
      donnees: proprietes
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération',
      erreur: erreur.message
    });
  }
});

/**
 * @desc    Obtenir les statistiques (mode test)
 * @route   GET /api/properties/statistiques/bailleur/:bailleurId
 * @access  Privé
 */
router.get('/statistiques/bailleur/:bailleurId', (req, res) => {
  try {
    const proprietes = testProperties.filter(
      p => p.bailleurId === req.params.bailleurId && p.active !== false
    );

    const total = proprietes.length;
    const disponibles = proprietes.filter(p => p.statut === 'disponible').length;
    const occupees = proprietes.filter(p => p.statut === 'occupee').length;
    const enMaintenance = proprietes.filter(p => p.statut === 'en_maintenance').length;
    const revenuMensuelTotal = proprietes.reduce((sum, p) => sum + (p.loyer || 0), 0);

    res.status(200).json({
      succes: true,
      donnees: {
        total,
        disponibles,
        occupees,
        enMaintenance,
        revenuMensuelTotal,
        tauxOccupation: total > 0 ? ((occupees / total) * 100).toFixed(1) : 0
      }
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération',
      erreur: erreur.message
    });
  }
});

/**
 * @desc    Obtenir une propriété par ID (mode test)
 * @route   GET /api/properties/:id
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const propriete = testProperties.find(p => p.id === req.params.id);

    if (!propriete) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    // Incrémenter les vues
    propriete.nombreVues += 1;

    res.status(200).json({
      succes: true,
      donnees: propriete
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération',
      erreur: erreur.message
    });
  }
});

/**
 * @desc    Mettre à jour une propriété (mode test)
 * @route   PUT /api/properties/:id
 * @access  Privé
 */
router.put('/:id', (req, res) => {
  try {
    const index = testProperties.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    testProperties[index] = {
      ...testProperties[index],
      ...req.body,
      dateModification: new Date().toISOString()
    };

    res.status(200).json({
      succes: true,
      message: 'Propriété mise à jour avec succès (Mode Test)',
      donnees: testProperties[index]
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la mise à jour',
      erreur: erreur.message
    });
  }
});

/**
 * @desc    Supprimer une propriété (mode test)
 * @route   DELETE /api/properties/:id
 * @access  Privé
 */
router.delete('/:id', (req, res) => {
  try {
    const index = testProperties.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    testProperties[index].active = false;

    res.status(200).json({
      succes: true,
      message: 'Propriété supprimée avec succès (Mode Test)'
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la suppression',
      erreur: erreur.message
    });
  }
});

/**
 * @desc    Changer le statut d'une propriété (mode test)
 * @route   PUT /api/properties/:id/statut
 * @access  Privé
 */
router.put('/:id/statut', (req, res) => {
  try {
    const { statut } = req.body;

    if (!['disponible', 'occupee', 'en_maintenance', 'en_vente', 'reservee'].includes(statut)) {
      return res.status(400).json({
        succes: false,
        message: 'Statut invalide'
      });
    }

    const index = testProperties.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    testProperties[index].statut = statut;
    testProperties[index].dateModification = new Date().toISOString();

    res.status(200).json({
      succes: true,
      message: 'Statut mis à jour avec succès (Mode Test)',
      donnees: testProperties[index]
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la mise à jour',
      erreur: erreur.message
    });
  }
});

/**
 * @desc    Ajouter une photo (mode test)
 * @route   POST /api/properties/:id/photos
 * @access  Privé
 */
router.post('/:id/photos', (req, res) => {
  try {
    const { url, description } = req.body;

    if (!url) {
      return res.status(400).json({
        succes: false,
        message: 'L\'URL de la photo est obligatoire'
      });
    }

    const index = testProperties.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    if (!testProperties[index].photos) {
      testProperties[index].photos = [];
    }

    testProperties[index].photos.push({
      url,
      description: description || '',
      ordre: testProperties[index].photos.length
    });

    res.status(200).json({
      succes: true,
      message: 'Photo ajoutée avec succès (Mode Test)',
      donnees: testProperties[index]
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de l\'ajout',
      erreur: erreur.message
    });
  }
});

/**
 * @desc    Obtenir les statistiques (mode test)
 * @route   GET /api/properties/statistiques/bailleur/:bailleurId
 * @access  Privé
 */
router.get('/statistiques/bailleur/:bailleurId', (req, res) => {
  try {
    const proprietes = testProperties.filter(
      p => p.bailleurId === req.params.bailleurId && p.active !== false
    );

    const total = proprietes.length;
    const disponibles = proprietes.filter(p => p.statut === 'disponible').length;
    const occupees = proprietes.filter(p => p.statut === 'occupee').length;
    const enMaintenance = proprietes.filter(p => p.statut === 'en_maintenance').length;
    const revenuMensuelTotal = proprietes.reduce((sum, p) => sum + (p.loyer || 0), 0);

    res.status(200).json({
      succes: true,
      donnees: {
        total,
        disponibles,
        occupees,
        enMaintenance,
        revenuMensuelTotal,
        tauxOccupation: total > 0 ? ((occupees / total) * 100).toFixed(1) : 0
      }
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération',
      erreur: erreur.message
    });
  }
});

module.exports = router;
