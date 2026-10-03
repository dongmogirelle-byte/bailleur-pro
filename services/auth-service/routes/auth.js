const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  verifyToken
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword
} = require('../middleware/validator');

/**
 * Routes publiques
 */
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

/**
 * Routes protégées (nécessitent un token valide)
 */
router.get('/me', protect, getMe);
router.put('/update-profile', protect, validateUpdateProfile, updateProfile);
router.put('/change-password', protect, validateChangePassword, changePassword);
router.post('/logout', protect, logout);
router.get('/verify-token', protect, verifyToken);

module.exports = router;
