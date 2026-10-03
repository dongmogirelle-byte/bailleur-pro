const Tenant = require('../models/Tenant');
const Contract = require('../models/Contract');

// @desc    Créer un locataire
// @route   POST /api/tenants
// @access  Privé
exports.createTenant = async (req, res) => {
  try {
    const tenant = await Tenant.create(req.body);
    
    // Créer automatiquement un contrat
    const contract = await Contract.create({
      proprieteId: req.body.proprieteId,
      locataireId: tenant._id,
      dateDebut: req.body.dateDebutBail,
      dateFin: req.body.dateFinBail,
      montantLoyer: req.body.loyer,
      caution: req.body.caution || 0
    });

    res.status(201).json({
      success: true,
      message: 'Locataire créé avec succès',
      data: { tenant, contract }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir tous les locataires
// @route   GET /api/tenants
// @access  Privé
exports.getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().populate('proprieteId').populate('userId');
    
    res.status(200).json({
      success: true,
      count: tenants.length,
      data: tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir un locataire par ID
// @route   GET /api/tenants/:id
// @access  Privé
exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id)
      .populate('proprieteId')
      .populate('userId');

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Locataire non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour un locataire
// @route   PUT /api/tenants/:id
// @access  Privé
exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Locataire non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Locataire mis à jour avec succès',
      data: tenant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer un locataire
// @route   DELETE /api/tenants/:id
// @access  Privé
exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Locataire non trouvé'
      });
    }

    // Supprimer le contrat associé
    await Contract.findOneAndDelete({ locataireId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Locataire supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les locataires d'une propriété
// @route   GET /api/tenants/property/:propertyId
// @access  Privé
exports.getTenantsByProperty = async (req, res) => {
  try {
    const tenants = await Tenant.find({ proprieteId: req.params.propertyId })
      .populate('userId');

    res.status(200).json({
      success: true,
      count: tenants.length,
      data: tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir l'historique des locataires d'une propriété
// @route   GET /api/tenants/property/:propertyId/history
// @access  Privé
exports.getTenantHistory = async (req, res) => {
  try {
    const tenants = await Tenant.find({ 
      proprieteId: req.params.propertyId,
      statut: { $in: ['inactif', 'expiré'] }
    }).populate('userId');

    res.status(200).json({
      success: true,
      count: tenants.length,
      data: tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
