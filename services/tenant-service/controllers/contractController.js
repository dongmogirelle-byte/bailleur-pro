const Contract = require('../models/Contract');
const Tenant = require('../models/Tenant');

// @desc    Créer un contrat
// @route   POST /api/contracts
// @access  Privé
exports.createContract = async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Contrat créé avec succès',
      data: contract
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir tous les contrats
// @route   GET /api/contracts
// @access  Privé
exports.getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find()
      .populate('proprieteId')
      .populate('locataireId');
    
    res.status(200).json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir un contrat par ID
// @route   GET /api/contracts/:id
// @access  Privé
exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('proprieteId')
      .populate('locataireId');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contrat non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour un contrat
// @route   PUT /api/contracts/:id
// @access  Privé
exports.updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contrat non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contrat mis à jour avec succès',
      data: contract
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer un contrat
// @route   DELETE /api/contracts/:id
// @access  Privé
exports.deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contrat non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contrat supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Générer le PDF d'un contrat
// @route   GET /api/contracts/:id/pdf
// @access  Privé
exports.generateContractPdf = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('proprieteId')
      .populate('locataireId');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contrat non trouvé'
      });
    }

    // Pour l'instant, on retourne l'URL du PDF s'il existe
    // Dans la version complète, on générera un vrai PDF
    res.status(200).json({
      success: true,
      message: 'PDF généré avec succès',
      data: {
        contractId: contract._id,
        pdfUrl: contract.pdf || null,
        note: 'La génération PDF sera implémentée avec une librairie comme pdfkit'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
