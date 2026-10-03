const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Valeurs par défaut si .env n'existe pas
if (!process.env.PORT) process.env.PORT = '5007';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = 'mongodb://localhost:27017/bailleur-pro-payment';

// Initialiser l'application Express
const app = express();

// Connexion à la base de données
let mongoConnected = false;
connectDB().then(connected => {
  mongoConnected = connected;
  if (!connected) {
    console.log('⚠ Mode dégradé activé - Utilisation des routes de test');
  }
}).catch(() => {
  console.log('⚠ Mode dégradé activé - Utilisation des routes de test');
});

global.isDegradedMode = () => !mongoConnected;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware en développement
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Routes
if (mongoConnected) {
  app.use('/api/payments', require('./routes/payment'));
  app.use('/api/receipts', require('./routes/receipt'));
} else {
  console.log('⚠ Routes de test non implémentées pour payment-service');
}

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payment Service is running',
    service: 'payment-service',
    mode: mongoConnected ? 'normal' : 'dégradé',
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur le Payment Service de Bailleur Pro',
    version: '1.0.0',
    mode: mongoConnected ? 'normal' : 'dégradé',
    endpoints: {
      payments: [
        'GET /api/payments - Lister tous les paiements',
        'POST /api/payments - Enregistrer un paiement',
        'GET /api/payments/:id - Obtenir un paiement',
        'PUT /api/payments/:id/validate - Valider un paiement',
        'PUT /api/payments/:id/reject - Rejeter un paiement',
        'PUT /api/payments/:id/proof - Upload preuve de paiement',
        'GET /api/payments/tenant/:tenantId - Paiements d\'un locataire',
        'GET /api/payments/property/:propertyId - Paiements d\'une propriété',
        'GET /api/payments/unpaid - Obtenir les impayés'
      ],
      receipts: [
        'GET /api/receipts - Lister toutes les quittances',
        'GET /api/receipts/:id - Obtenir une quittance',
        'GET /api/receipts/tenant/:tenantId - Quittances d\'un locataire',
        'GET /api/receipts/:id/download - Télécharger une quittance PDF'
      ]
    }
  });
});

// Middleware de gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: messages
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `Cette valeur pour ${field} est déjà utilisée`
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Ressource non trouvée'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5007;
const server = app.listen(PORT, () => {
  console.log(`Payment Service démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Mode: ${mongoConnected ? 'Normal (avec MongoDB)' : 'Dégradé (sans MongoDB)'}`);
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu. Arrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});

module.exports = app;
