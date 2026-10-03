const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Valeurs par défaut si .env n'existe pas
if (!process.env.PORT) process.env.PORT = '5003';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = 'mongodb://localhost:27017/bailleur-pro-tenant';

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
  app.use('/api/tenants', require('./routes/tenant'));
  app.use('/api/contracts', require('./routes/contract'));
} else {
  console.log('⚠ Routes de test non implémentées pour tenant-service');
}

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tenant Service is running',
    service: 'tenant-service',
    mode: mongoConnected ? 'normal' : 'dégradé',
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur le Tenant Service de Bailleur Pro',
    version: '1.0.0',
    mode: mongoConnected ? 'normal' : 'dégradé',
    endpoints: {
      tenants: [
        'GET /api/tenants - Lister tous les locataires',
        'POST /api/tenants - Créer un locataire',
        'GET /api/tenants/:id - Obtenir un locataire',
        'PUT /api/tenants/:id - Mettre à jour un locataire',
        'DELETE /api/tenants/:id - Supprimer un locataire',
        'GET /api/tenants/property/:propertyId - Locataires d\'une propriété',
        'GET /api/tenants/property/:propertyId/history - Historique des locataires'
      ],
      contracts: [
        'GET /api/contracts - Lister tous les contrats',
        'POST /api/contracts - Créer un contrat',
        'GET /api/contracts/:id - Obtenir un contrat',
        'PUT /api/contracts/:id - Mettre à jour un contrat',
        'DELETE /api/contracts/:id - Supprimer un contrat',
        'GET /api/contracts/:id/pdf - Générer le PDF d\'un contrat'
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
const PORT = process.env.PORT || 5003;
const server = app.listen(PORT, () => {
  console.log(`Tenant Service démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
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
