const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✓ MongoDB connecté: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`⚠ Erreur de connexion MongoDB: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
