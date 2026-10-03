const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

// Configuration email (sera améliorée avec les variables d'environnement)
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// @desc    Créer une notification
// @route   POST /api/notifications
// @access  Privé
exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    
    // Envoyer selon le canal
    if (req.body.canal === 'email' || req.body.canal === 'tous') {
      await sendEmailNotification(notification);
    }
    
    if (req.body.canal === 'sms' || req.body.canal === 'tous') {
      await sendSmsNotification(notification);
    }
    
    res.status(201).json({
      success: true,
      message: 'Notification créée avec succès',
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir toutes les notifications
// @route   GET /api/notifications
// @access  Privé
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('utilisateurId')
      .sort({ dateEnvoi: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les notifications d'un utilisateur
// @route   GET /api/notifications/user/:userId
// @access  Privé
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ utilisateurId: req.params.userId })
      .sort({ dateEnvoi: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Marquer une notification comme lue
// @route   PUT /api/notifications/:id/read
// @access  Privé
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { lu: true, dateLecture: Date.now() },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marquée comme lue',
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer une notification
// @route   DELETE /api/notifications/:id
// @access  Privé
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Fonction helper pour envoyer un email
const sendEmailNotification = async (notification) => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: notification.metadata?.email || 'user@example.com',
      subject: notification.titre,
      text: notification.message
    };
    
    await transporter.sendMail(mailOptions);
    
    await Notification.findByIdAndUpdate(notification._id, { statut: 'envoyé' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    await Notification.findByIdAndUpdate(notification._id, { statut: 'échoué' });
  }
};

// Fonction helper pour envoyer un SMS (placeholder)
const sendSmsNotification = async (notification) => {
  try {
    // Implémentation avec un provider SMS (Twilio, etc.)
    // Pour l'instant, on simule l'envoi
    console.log(`SMS envoyé à ${notification.metadata?.telephone}: ${notification.message}`);
    
    await Notification.findByIdAndUpdate(notification._id, { statut: 'envoyé' });
  } catch (error) {
    console.error('Erreur envoi SMS:', error);
    await Notification.findByIdAndUpdate(notification._id, { statut: 'échoué' });
  }
};
