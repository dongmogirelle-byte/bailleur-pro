const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Valeurs par défaut si .env n'existe pas (ne pas écraser si déjà défini)
if (!process.env.PORT) process.env.PORT = '5002';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = 'mongodb://localhost:27017/bailleur-pro-property';

// Initialiser l'application Express
const app = express();

// Connexion à la base de données (mode dégradé si échec)
let mongoConnected = false;
let dbConnectionPromise = connectDB().then(connected => {
  mongoConnected = connected;
  if (!connected) {
    console.log('⚠ Mode dégradé activé - Utilisation des routes de test');
  }
  return connected;
}).catch(() => {
  console.log('⚠ Mode dégradé activé - Utilisation des routes de test');
  return false;
});

// Variable globale pour savoir si on est en mode dégradé
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

// Routes - Charger immédiatement les routes de test, puis remplacer si MongoDB se connecte
console.log('⚠ Chargement initial des routes de test (sans MongoDB)');
app.use('/api/properties', require('./routes-property-test'));

// Si MongoDB se connecte, remplacer les routes
dbConnectionPromise.then(connected => {
  if (connected) {
    console.log('✓ MongoDB connecté - Remplacement des routes par les routes avec MongoDB');
    // Supprimer les routes de test et ajouter les routes normales
    app._router.stack = app._router.stack.filter(layer => 
      !layer.route || !layer.route.path.startsWith('/api/properties')
    );
    app.use('/api/properties', require('./routes/property'));
  }
});

// Route de santé (health check)
app.get('/health', (req, res) => {
  res.status(200).json({
    succes: true,
    message: 'Property Service est en cours d\'exécution',
    service: 'property-service',
    mode: mongoConnected ? 'normal' : 'dégradé',
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req, res) => {
  res.status(200).json({
    succes: true,
    message: 'Bienvenue sur le Property Service de Bailleur Pro',
    version: '1.0.0',
    mode: mongoConnected ? 'normal' : 'dégradé',
    endpoints: {
      public: [
        'GET /api/properties - Lister toutes les propriétés',
        'GET /api/properties/:id - Obtenir une propriété',
        'GET /api/properties/bailleur/:id - Propriétés d\'un bailleur'
      ],
      prive: [
        'POST /api/properties - Créer une propriété',
        'PUT /api/properties/:id - Mettre à jour une propriété',
        'DELETE /api/properties/:id - Supprimer une propriété',
        'PUT /api/properties/:id/statut - Changer le statut',
        'POST /api/properties/:id/photos - Ajouter une photo',
        'GET /api/properties/statistiques/bailleur/:id - Statistiques'
      ]
    }
  });
});

// Middleware de gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    succes: false,
    message: 'Route non trouvée'
  });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);

  // Erreur Mongoose (validation)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      succes: false,
      message: 'Erreur de validation',
      erreurs: messages
    });
  }

  // Erreur Mongoose (duplicate key)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      succes: false,
      message: `Cette valeur pour ${field} est déjà utilisée`
    });
  }

  // Erreur Mongoose (cast error)
  if (err.name === 'CastError') {
    return res.status(400).json({
      succes: false,
      message: 'Ressource non trouvée'
    });
  }

  // Erreur par défaut
  res.status(err.statusCode || 500).json({
    succes: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
  console.log(`Property Service démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
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
