const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

/**
 * Routes de test pour le Auth Service (sans MongoDB)
 * Ces routes sont utilisées quand MongoDB n'est pas disponible
 */

// Stockage en mémoire pour les tests
const testUsers = [];

/**
 * @desc    Inscrire un nouvel utilisateur (mode test)
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post('/register', (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: [
          !name ? { msg: 'Le nom est obligatoire', param: 'name' } : null,
          !email ? { msg: 'L\'email est obligatoire', param: 'email' } : null,
          !password ? { msg: 'Le mot de passe est obligatoire', param: 'password' } : null
        ].filter(Boolean)
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: [{ msg: 'Le mot de passe doit contenir au moins 6 caractères', param: 'password' }]
      });
    }

    // Vérifier si l'email existe déjà
    if (testUsers.find(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer l'utilisateur
    const user = {
      id: 'test_' + Date.now(),
      name,
      email,
      role: role || 'bailleur',
      plan: 'gratuit',
      isSubscribed: false,
      createdAt: new Date().toISOString()
    };

    testUsers.push(user);

    // Générer le token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      success: true,
      message: 'Inscription réussie (Mode Test - Sans MongoDB)',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
});

/**
 * @desc    Connecter un utilisateur (mode test)
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Trouver l'utilisateur
    const user = testUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // En mode test, on accepte n'importe quel mot de passe
    // Générer le token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie (Mode Test - Sans MongoDB)',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
});

/**
 * @desc    Obtenir le profil (mode test)
 * @route   GET /api/auth/me
 * @access  Private
 */
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = testUsers.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
});

/**
 * @desc    Route placeholder pour les autres endpoints
 */
router.put('/update-profile', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mise à jour du profil (Mode Test - Non implémenté sans MongoDB)'
  });
});

router.put('/change-password', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Changement de mot de passe (Mode Test - Non implémenté sans MongoDB)'
  });
});

router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

router.get('/verify-token', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token valide (Mode Test)'
  });
});

module.exports = router;
