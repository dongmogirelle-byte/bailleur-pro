const Receipt = require('../models/Receipt');
const Payment = require('../models/Payment');

// @desc    Obtenir toutes les quittances
// @route   GET /api/receipts
// @access  Privé
exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate('paiementId')
      .populate('locataireId')
      .populate('proprieteId')
      .populate('bailleurId');
    
    res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir une quittance par ID
// @route   GET /api/receipts/:id
// @access  Privé
exports.getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('paiementId')
      .populate('locataireId')
      .populate('proprieteId')
      .populate('bailleurId');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Quittance non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les quittances d'un locataire
// @route   GET /api/receipts/tenant/:tenantId
// @access  Privé
exports.getReceiptsByTenant = async (req, res) => {
  try {
    const receipts = await Receipt.find({ locataireId: req.params.tenantId })
      .populate('paiementId')
      .populate('proprieteId');

    res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Télécharger une quittance PDF
// @route   GET /api/receipts/:id/download
// @access  Privé
exports.downloadReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('paiementId')
      .populate('locataireId')
      .populate('proprieteId');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Quittance non trouvée'
      });
    }

    // Pour l'instant, on retourne les données de la quittance
    // Dans la version complète, on générera un vrai PDF
    res.status(200).json({
      success: true,
      message: 'Quittance prête pour téléchargement',
      data: {
        receipt,
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
