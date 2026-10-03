const mongoose = require('mongoose');

/**
 * Connexion à MongoDB
 * Mode dégradé si MongoDB n'est pas disponible
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✓ MongoDB connecté: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`⚠ Erreur de connexion MongoDB: ${error.message}`);
    console.error(`⚠ Le service démarrera en mode dégradé (sans base de données)`);
    return false;
  }
};

module.exports = connectDB;
