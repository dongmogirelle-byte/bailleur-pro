// Script de test pour le Auth Service
// Ce script utilise des valeurs par défaut pour tester sans fichier .env

const mongoose = require('mongoose');

// Configuration de test
process.env.PORT = '5001';
process.env.MONGODB_URI = 'mongodb://localhost:27017/bailleur-pro-auth-test';
process.env.JWT_SECRET = 'test_secret_key_for_development_only';
process.env.JWT_EXPIRE = '7d';
process.env.NODE_ENV = 'development';

console.log('=== Test du Auth Service ===');
console.log('Configuration de test chargée');
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('JWT Secret:', process.env.JWT_SECRET);
console.log('');

// Test de connexion MongoDB
async function testMongoConnection() {
  try {
    console.log('1. Test de connexion MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB connecté avec succès');
    
    // Test de création d'un utilisateur
    console.log('\n2. Test de création d\'un utilisateur...');
    const User = require('./models/User');
    
    // Nettoyer les données de test
    await User.deleteMany({ email: 'test@example.com' });
    
    const testUser = await User.create({
      name: 'Utilisateur Test',
      email: 'test@example.com',
      password: 'Password123',
      role: 'bailleur'
    });
    
    console.log('✓ Utilisateur créé avec succès');
    console.log('  - ID:', testUser._id);
    console.log('  - Email:', testUser.email);
    console.log('  - Role:', testUser.role);
    
    // Test de comparaison de mot de passe
    console.log('\n3. Test de comparaison de mot de passe...');
    const isMatch = await testUser.comparePassword('Password123');
    console.log('✓ Comparaison de mot de passe:', isMatch ? 'succès' : 'échec');
    
    // Test de génération de token
    console.log('\n4. Test de génération de token JWT...');
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    console.log('✓ Token généré avec succès');
    console.log('  - Token (premiers 50 caractères):', token.substring(0, 50) + '...');
    
    // Test de vérification de token
    console.log('\n5. Test de vérification de token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✓ Token vérifié avec succès');
    console.log('  - User ID:', decoded.id);
    
    // Nettoyage
    console.log('\n6. Nettoyage des données de test...');
    await User.deleteMany({ email: 'test@example.com' });
    console.log('✓ Données de test supprimées');
    
    // Fermeture de la connexion
    await mongoose.connection.close();
    console.log('\n✓ MongoDB déconnecté');
    
    console.log('\n=== Tous les tests sont passés avec succès ===');
    console.log('\nPour démarrer le serveur en mode développement:');
    console.log('1. Créez un fichier .env basé sur .env.example');
    console.log('2. Configurez votre connexion MongoDB Atlas');
    console.log('3. Exécutez: npm run dev');
    
  } catch (error) {
    console.error('\n✗ Erreur lors du test:', error.message);
    console.error('\nNote: Si MongoDB n\'est pas installé localement,');
    console.error('vous devez utiliser MongoDB Atlas dans le fichier .env');
    process.exit(1);
  }
}

testMongoConnection();
