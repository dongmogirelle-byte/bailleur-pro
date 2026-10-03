const Payment = require('../models/Payment');
const Receipt = require('../models/Receipt');

// @desc    Enregistrer un paiement
// @route   POST /api/payments
// @access  Privé
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Paiement enregistré avec succès',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir tous les paiements
// @route   GET /api/payments
// @access  Privé
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('locataireId')
      .populate('proprieteId');
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir un paiement par ID
// @route   GET /api/payments/:id
// @access  Privé
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('locataireId')
      .populate('proprieteId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Valider un paiement
// @route   PUT /api/payments/:id/validate
// @access  Privé
exports.validatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { statut: 'validé' },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    // Générer automatiquement une quittance
    const receiptNumber = `QT-${Date.now()}-${payment.locataireId}`;
    const receipt = await Receipt.create({
      paiementId: payment._id,
      numero: receiptNumber,
      periode: payment.periode,
      montant: payment.montant,
      bailleurId: req.body.bailleurId,
      locataireId: payment.locataireId,
      proprieteId: payment.proprieteId
    });

    res.status(200).json({
      success: true,
      message: 'Paiement validé et quittance générée',
      data: { payment, receipt }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Rejeter un paiement
// @route   PUT /api/payments/:id/reject
// @access  Privé
exports.rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { statut: 'rejeté', notes: req.body.notes },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Paiement rejeté',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les paiements d'un locataire
// @route   GET /api/payments/tenant/:tenantId
// @access  Privé
exports.getPaymentsByTenant = async (req, res) => {
  try {
    const payments = await Payment.find({ locataireId: req.params.tenantId })
      .populate('proprieteId');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les paiements d'une propriété
// @route   GET /api/payments/property/:propertyId
// @access  Privé
exports.getPaymentsByProperty = async (req, res) => {
  try {
    const payments = await Payment.find({ proprieteId: req.params.propertyId })
      .populate('locataireId');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les impayés
// @route   GET /api/payments/unpaid
// @access  Privé
exports.getUnpaidPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ statut: 'en_attente' })
      .populate('locataireId')
      .populate('proprieteId');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload preuve de paiement
// @route   PUT /api/payments/:id/proof
// @access  Privé
exports.uploadProof = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { preuvePaiement: req.body.preuvePaiement },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preuve de paiement uploadée',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
