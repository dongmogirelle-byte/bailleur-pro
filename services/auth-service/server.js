const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Debug : Afficher les variables chargées
console.log('Debug - MONGODB_URI:', process.env.MONGODB_URI ? 'Défini' : 'Non défini');

// Valeurs par défaut si .env n'existe pas (ne pas écraser si déjà défini)
if (!process.env.PORT) process.env.PORT = '5001';
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'dev_secret_key_change_in_production';
if (!process.env.JWT_EXPIRE) process.env.JWT_EXPIRE = '7d';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = 'mongodb://localhost:27017/bailleur-pro-auth';

// Initialiser l'application Express
const app = express();

// Connexion à la base de données (mode dégradé si échec)
let mongoConnected = false;
connectDB().then(connected => {
  mongoConnected = connected;
  if (!connected) {
    console.log('⚠ Mode dégradé activé - Utilisation des routes de test');
  }
}).catch(() => {
  console.log('⚠ Mode dégradé activé - Utilisation des routes de test');
});

// Variable globale pour savoir si on est en mode dégradé
global.isDegradedMode = () => !mongoConnected;

// Middleware
app.use(cors()); // Autoriser les requêtes cross-origin
app.use(express.json()); // Parser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Parser les requêtes URL-encoded

// Logger middleware en développement
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Routes - Chargement asynchrone selon l'état de MongoDB
setTimeout(() => {
  if (mongoConnected) {
    // Routes normales avec MongoDB
    console.log('✓ Chargement des routes avec MongoDB');
    app.use('/api/auth', require('./routes/auth'));
  } else {
    // Routes de test sans MongoDB
    console.log('⚠ Chargement des routes de test (sans MongoDB)');
    app.use('/api/auth', require('./routes-auth-test'));
  }
}, 100);

// Route de santé (health check)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth Service is running',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur le Auth Service de Bailleur Pro',
    version: '1.0.0',
    endpoints: {

      public: [
        'POST /api/auth/register - Inscrire un nouvel utilisateur',
        'POST /api/auth/login - Connecter un utilisateur'
      ],
      protected: [
        'GET /api/auth/me - Obtenir le profil utilisateur',
        'PUT /api/auth/update-profile - Mettre à jour le profil',
        'PUT /api/auth/change-password - Changer le mot de passe',
        'POST /api/auth/logout - Déconnecter l\'utilisateur',
        'GET /api/auth/verify-token - Vérifier la validité du token'
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

  // Erreur Mongoose (validation)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: messages
    });
  }

  // Erreur Mongoose (duplicate key)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `Cette valeur pour ${field} est déjà utilisée`
    });
  }

  // Erreur Mongoose (cast error)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Ressource non trouvée'
    });
  }

  // Erreur par défaut
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Auth Service démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
  console.log(`URL: http://localhost:${PORT}`);
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
