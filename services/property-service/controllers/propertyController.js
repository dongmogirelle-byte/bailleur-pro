const Property = require('../models/Property');

/**
 * Créer une nouvelle propriété
 * @route POST /api/properties
 * @access Privé (bailleur)
 */
exports.creerPropriete = async (req, res) => {
  try {
    // Ajouter l'ID du bailleur depuis le middleware d'authentification
    req.body.bailleurId = req.user.id;

    const propriete = await Property.create(req.body);

    res.status(201).json({
      succes: true,
      message: 'Propriété créée avec succès',
      donnees: propriete
    });
  } catch (erreur) {
    res.status(400).json({
      succes: false,
      message: erreur.message
    });
  }
};

/**
 * Obtenir toutes les propriétés
 * @route GET /api/properties
 * @access Public (avec filtres)
 */
exports.obtenirProprietes = async (req, res) => {
  try {
    // Construction de la requête avec filtres
    let requete = Property.find({ active: true });

    // Filtre par bailleur
    if (req.query.bailleurId) {
      requete = requete.where('bailleurId').equals(req.query.bailleurId);
    }

    // Filtre par ville
    if (req.query.ville) {
      requete = requete.where('adresse.ville').equals(req.query.ville);
    }

    // Filtre par type
    if (req.query.type) {
      requete = requete.where('type').equals(req.query.type);
    }

    // Filtre par statut
    if (req.query.statut) {
      requete = requete.where('statut').equals(req.query.statut);
    }

    // Filtre par prix minimum
    if (req.query.loyerMin) {
      requete = requete.where('loyer').gte(req.query.loyerMin);
    }

    // Filtre par prix maximum
    if (req.query.loyerMax) {
      requete = requete.where('loyer').lte(req.query.loyerMax);
    }

    // Filtre par nombre de chambres minimum
    if (req.query.chambresMin) {
      requete = requete.where('caracteristiques.chambres').gte(req.query.chambresMin);
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const saut = (page - 1) * limite;

    requete = requete.skip(saut).limit(limite);

    // Trier
    const tri = req.query.tri || '-dateCreation';
    requete = requete.sort(tri);

    // Exécuter la requête
    const proprietes = await requete.populate('bailleurId', 'nom email').populate('locataireId', 'nom email');

    // Compter le total
    const total = await Property.countDocuments(requete.getQuery());

    res.status(200).json({
      succes: true,
      nombre: proprietes.length,
      total,
      page,
      pages: Math.ceil(total / limite),
      donnees: proprietes
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: erreur.message
    });
  }
};

/**
 * Obtenir une propriété par ID
 * @route GET /api/properties/:id
 * @access Public
 */
exports.obtenirProprieteParId = async (req, res) => {
  try {
    const propriete = await Property.findById(req.params.id)
      .populate('bailleurId', 'nom email telephone')
      .populate('locataireId', 'nom email telephone');

    if (!propriete) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    // Incrémenter le nombre de vues
    propriete.nombreVues += 1;
    await propriete.save();

    res.status(200).json({
      succes: true,
      donnees: propriete
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: erreur.message
    });
  }
};

/**
 * Mettre à jour une propriété
 * @route PUT /api/properties/:id
 * @access Privé (bailleur propriétaire)
 */
exports.mettreAJourPropriete = async (req, res) => {
  try {
    let propriete = await Property.findById(req.params.id);

    if (!propriete) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (propriete.bailleurId.toString() !== req.user.id) {
      return res.status(403).json({
        succes: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette propriété'
      });
    }

    propriete = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      succes: true,
      message: 'Propriété mise à jour avec succès',
      donnees: propriete
    });
  } catch (erreur) {
    res.status(400).json({
      succes: false,
      message: erreur.message
    });
  }
};

/**
 * Supprimer une propriété
 * @route DELETE /api/properties/:id
 * @access Privé (bailleur propriétaire)
 */
exports.supprimerPropriete = async (req, res) => {
  try {
    const propriete = await Property.findById(req.params.id);

    if (!propriete) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (propriete.bailleurId.toString() !== req.user.id) {
      return res.status(403).json({
        succes: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cette propriété'
      });
    }

    // Au lieu de supprimer, on désactive
    propriete.active = false;
    await propriete.save();

    res.status(200).json({
      succes: true,
      message: 'Propriété supprimée avec succès'
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: erreur.message
    });
  }
};

/**
 * Obtenir les propriétés d'un bailleur
 * @route GET /api/properties/bailleur/:bailleurId
 * @access Public
 */
exports.obtenirProprietesBailleur = async (req, res) => {
  try {
    const proprietes = await Property.find({ 
      bailleurId: req.params.bailleurId,
      active: true 
    })
    .populate('locataireId', 'nom email')
    .sort('-dateCreation');

    res.status(200).json({
      succes: true,
      nombre: proprietes.length,
      donnees: proprietes
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: erreur.message
    });
  }
};

/**
 * Changer le statut d'une propriété
 * @route PUT /api/properties/:id/statut
 * @access Privé (bailleur propriétaire)
 */
exports.changerStatutPropriete = async (req, res) => {
  try {
    const { statut } = req.body;

    if (!['disponible', 'occupee', 'en_maintenance', 'en_vente', 'reservee'].includes(statut)) {
      return res.status(400).json({
        succes: false,
        message: 'Statut invalide'
      });
    }

    let propriete = await Property.findById(req.params.id);

    if (!propriete) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (propriete.bailleurId.toString() !== req.user.id) {
      return res.status(403).json({
        succes: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette propriété'
      });
    }

    propriete.statut = statut;
    await propriete.save();

    res.status(200).json({
      succes: true,
      message: 'Statut mis à jour avec succès',
      donnees: propriete
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: erreur.message
    });
  }
};

/**
 * Ajouter une photo à une propriété
 * @route POST /api/properties/:id/photos
 * @access Privé (bailleur propriétaire)
 */
exports.ajouterPhoto = async (req, res) => {
  try {
    const { url, description } = req.body;

    if (!url) {
      return res.status(400).json({
        succes: false,
        message: 'L\'URL de la photo est obligatoire'
      });
    }

    let propriete = await Property.findById(req.params.id);

    if (!propriete) {
      return res.status(404).json({
        succes: false,
        message: 'Propriété non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (propriete.bailleurId.toString() !== req.user.id) {
      return res.status(403).json({
        succes: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette propriété'
      });
    }

    propriete.photos.push({
      url,
      description: description || '',
      ordre: propriete.photos.length
    });

    await propriete.save();

    res.status(200).json({
      succes: true,
      message: 'Photo ajoutée avec succès',
      donnees: propriete
    });
  } catch (erreur) {
    res.status(500).json({
      succes: false,
      message: erreur.message
    });
  }
};

/**
 * Obtenir les statistiques des propriétés d'un bailleur
 * @route GET /api/properties/statistiques/bailleur/:bailleurId
 * @access Privé (bailleur)
 */
exports.obtenirStatistiquesBailleur = async (req, res) => {
  try {
    const bailleurId = req.params.bailleurId;

    const total = await Property.countDocuments({ bailleurId, active: true });
    const disponibles = await Property.countDocuments({ bailleurId, statut: 'disponible', active: true });
    const occupees = await Property.countDocuments({ bailleurId, statut: 'occupee', active: true });
    const enMaintenance = await Property.countDocuments({ bailleurId, statut: 'en_maintenance', active: true });

    const proprietes = await Property.find({ bailleurId, active: true });
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
      message: erreur.message
    });
  }
};
