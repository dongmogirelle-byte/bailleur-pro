const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Configuration de test (sans MongoDB)
process.env.PORT = process.env.PORT || '5001';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_for_development';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
process.env.NODE_ENV = 'development';

console.log('=== Auth Service - Mode Test (Sans MongoDB) ===');
console.log('Ce mode teste uniquement la validation et les routes');
console.log('Les opérations de base de données seront simulées\n');

// Initialiser l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes de test (sans base de données)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Validation basique
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: [
        !name ? { msg: 'Le nom est obligatoire' } : null,
        !email ? { msg: 'L\'email est obligatoire' } : null,
        !password ? { msg: 'Le mot de passe est obligatoire' } : null
      ].filter(Boolean)
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: [{ msg: 'Le mot de passe doit contenir au moins 6 caractères' }]
    });
  }
  
  // Simulation de réponse
  res.status(201).json({
    success: true,
    message: 'Inscription réussie (Mode Test - Sans MongoDB)',
    data: {
      token: 'test_token_' + Date.now(),
      user: {
        id: 'test_id_' + Date.now(),
        name,
        email,
        role: role || 'bailleur',
        plan: 'gratuit',
        isSubscribed: false
      }
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir un email et un mot de passe'
    });
  }
  
  // Simulation de réponse
  res.status(200).json({
    success: true,
    message: 'Connexion réussie (Mode Test - Sans MongoDB)',
    data: {
      token: 'test_token_' + Date.now(),
      user: {
        id: 'test_id_' + Date.now(),
        name: 'Utilisateur Test',
        email,
        role: 'bailleur',
        plan: 'gratuit',
        isSubscribed: false
      }
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token manquant'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      id: 'test_id',
      name: 'Utilisateur Test',
      email: 'test@example.com',
      role: 'bailleur',
      plan: 'gratuit',
      isSubscribed: false,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth Service is running (Test Mode)',
    service: 'auth-service',
    mode: 'test',
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth Service - Mode Test (Sans MongoDB)',
    version: '1.0.0',
    endpoints: {
      public: [
        'POST /api/auth/register - Inscrire un nouvel utilisateur',
        'POST /api/auth/login - Connecter un utilisateur'
      ],
      protected: [
        'GET /api/auth/me - Obtenir le profil utilisateur'
      ]
    },
    note: 'Pour le mode production avec MongoDB, configurez le fichier .env'
  });
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Démarrage du serveur
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`\n✓ Auth Service démarré sur le port ${PORT}`);
  console.log(`✓ URL: http://localhost:${PORT}`);
  console.log(`\nRoutes disponibles :`);
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  POST http://localhost:${PORT}/api/auth/register`);
  console.log(`  POST http://localhost:${PORT}/api/auth/login`);
  console.log(`  GET  http://localhost:${PORT}/api/auth/me`);
  console.log(`\nPour tester :`);
  console.log(`  curl http://localhost:${PORT}/health`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","password":"Password123"}'`);
});

// Gestion de l'arrêt
process.on('SIGTERM', () => {
  console.log('\nSIGTERM reçu. Arrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT reçu. Arrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});

module.exports = app;
