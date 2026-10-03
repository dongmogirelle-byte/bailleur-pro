// Script de validation du code sans connexion MongoDB
// Valide que tous les fichiers sont corrects et bien structurés

const fs = require('fs');
const path = require('path');

console.log('=== Validation du Code Auth Service ===\n');

const filesToCheck = [
  { path: 'package.json', required: true },
  { path: 'server.js', required: true },
  { path: 'config/db.js', required: true },
  { path: 'models/User.js', required: true },
  { path: 'controllers/authController.js', required: true },
  { path: 'routes/auth.js', required: true },
  { path: 'middleware/auth.js', required: true },
  { path: 'middleware/validator.js', required: true },
  { path: '.env.example', required: true },
  { path: '.gitignore', required: true },
  { path: 'README.md', required: true }
];

let allFilesExist = true;
let errors = [];

// Vérification 1 : Existence des fichiers
console.log('1. Vérification de la structure des fichiers...');
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file.path}`);
  } else {
    console.log(`  ✗ ${file.path} - MANQUANT`);
    if (file.required) {
      allFilesExist = false;
      errors.push(`${file.path} est manquant`);
    }
  }
});

// Vérification 2 : Contenu de package.json
console.log('\n2. Vérification de package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'cors', 'dotenv', 'express-validator'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`  ✓ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`  ✗ ${dep} - MANQUANT`);
      errors.push(`Dépendance ${dep} manquante dans package.json`);
    }
  });
  
  if (packageJson.scripts.start && packageJson.scripts.dev) {
    console.log(`  ✓ Scripts configurés`);
  } else {
    console.log(`  ✗ Scripts manquants`);
    errors.push('Scripts start ou dev manquants');
  }
} catch (error) {
  console.log(`  ✗ Erreur de lecture package.json: ${error.message}`);
  errors.push('package.json invalide');
}

// Vérification 3 : Contenu du modèle User
console.log('\n3. Vérification du modèle User.js...');
try {
  const userContent = fs.readFileSync('models/User.js', 'utf8');
  const requiredFields = ['name', 'email', 'password', 'role', 'plan', 'isSubscribed'];
  
  requiredFields.forEach(field => {
    if (userContent.includes(field)) {
      console.log(`  ✓ Champ ${field} présent`);
    } else {
      console.log(`  ✗ Champ ${field} manquant`);
      errors.push(`Champ ${field} manquant dans User.js`);
    }
  });
  
  if (userContent.includes('bcrypt') && userContent.includes('hash')) {
    console.log(`  ✓ Hashage du mot de passe configuré`);
  } else {
    console.log(`  ✗ Hashage du mot de passe manquant`);
    errors.push('Hashage du mot de passe non configuré');
  }
} catch (error) {
  console.log(`  ✗ Erreur de lecture User.js: ${error.message}`);
  errors.push('User.js invalide');
}

// Vérification 4 : Contenu du contrôleur
console.log('\n4. Vérification du contrôleur authController.js...');
try {
  const controllerContent = fs.readFileSync('controllers/authController.js', 'utf8');
  const requiredFunctions = ['register', 'login', 'getMe', 'updateProfile', 'changePassword', 'logout'];
  
  requiredFunctions.forEach(func => {
    if (controllerContent.includes(`exports.${func}`)) {
      console.log(`  ✓ Fonction ${func} présente`);
    } else {
      console.log(`  ✗ Fonction ${func} manquante`);
      errors.push(`Fonction ${func} manquante dans authController.js`);
    }
  });
  
  if (controllerContent.includes('jwt.sign') && controllerContent.includes('generateToken')) {
    console.log(`  ✓ Génération JWT configurée`);
  } else {
    console.log(`  ✗ Génération JWT manquante`);
    errors.push('Génération JWT non configurée');
  }
} catch (error) {
  console.log(`  ✗ Erreur de lecture authController.js: ${error.message}`);
  errors.push('authController.js invalide');
}

// Vérification 5 : Contenu du middleware auth
console.log('\n5. Vérification du middleware auth.js...');
try {
  const authContent = fs.readFileSync('middleware/auth.js', 'utf8');
  
  if (authContent.includes('exports.protect')) {
    console.log(`  ✓ Middleware protect présent`);
  } else {
    console.log(`  ✗ Middleware protect manquant`);
    errors.push('Middleware protect manquant');
  }
  
  if (authContent.includes('jwt.verify')) {
    console.log(`  ✓ Vérification JWT configurée`);
  } else {
    console.log(`  ✗ Vérification JWT manquante`);
    errors.push('Vérification JWT non configurée');
  }
  
  if (authContent.includes('exports.authorize')) {
    console.log(`  ✓ Middleware authorize présent`);
  } else {
    console.log(`  ✗ Middleware authorize manquant`);
    errors.push('Middleware authorize manquant');
  }
} catch (error) {
  console.log(`  ✗ Erreur de lecture auth.js: ${error.message}`);
  errors.push('auth.js invalide');
}

// Vérification 6 : Contenu du validator
console.log('\n6. Vérification du middleware validator.js...');
try {
  const validatorContent = fs.readFileSync('middleware/validator.js', 'utf8');
  const requiredValidators = ['validateRegister', 'validateLogin'];
  
  requiredValidators.forEach(validator => {
    if (validatorContent.includes(`exports.${validator}`)) {
      console.log(`  ✓ Validator ${validator} présent`);
    } else {
      console.log(`  ✗ Validator ${validator} manquant`);
      errors.push(`Validator ${validator} manquant`);
    }
  });
} catch (error) {
  console.log(`  ✗ Erreur de lecture validator.js: ${error.message}`);
  errors.push('validator.js invalide');
}

// Vérification 7 : Contenu des routes
console.log('\n7. Vérification des routes auth.js...');
try {
  const routesContent = fs.readFileSync('routes/auth.js', 'utf8');
  const requiredRoutes = ['/register', '/login', '/me', '/update-profile', '/change-password', '/logout'];
  
  requiredRoutes.forEach(route => {
    if (routesContent.includes(route)) {
      console.log(`  ✓ Route ${route} présente`);
    } else {
      console.log(`  ✗ Route ${route} manquante`);
      errors.push(`Route ${route} manquante`);
    }
  });
} catch (error) {
  console.log(`  ✗ Erreur de lecture auth.js: ${error.message}`);
  errors.push('routes/auth.js invalide');
}

// Vérification 8 : Contenu de server.js
console.log('\n8. Vérification de server.js...');
try {
  const serverContent = fs.readFileSync('server.js', 'utf8');
  
  if (serverContent.includes('express()') && serverContent.includes('app.listen')) {
    console.log(`  ✓ Serveur Express configuré`);
  } else {
    console.log(`  ✗ Serveur Express mal configuré`);
    errors.push('Serveur Express mal configuré');
  }
  
  if (serverContent.includes('connectDB')) {
    console.log(`  ✓ Connexion DB configurée`);
  } else {
    console.log(`  ✗ Connexion DB manquante`);
    errors.push('Connexion DB non configurée');
  }
  
  if (serverContent.includes('/api/auth')) {
    console.log(`  ✓ Routes auth montées`);
  } else {
    console.log(`  ✗ Routes auth non montées`);
    errors.push('Routes auth non montées');
  }
} catch (error) {
  console.log(`  ✗ Erreur de lecture server.js: ${error.message}`);
  errors.push('server.js invalide');
}

// Vérification 9 : Dépendances installées
console.log('\n9. Vérification des dépendances installées...');
try {
  if (fs.existsSync('node_modules')) {
    console.log(`  ✓ node_modules existe`);
    const requiredPackages = ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'cors', 'dotenv', 'express-validator'];
    requiredPackages.forEach(pkg => {
      const pkgPath = path.join('node_modules', pkg);
      if (fs.existsSync(pkgPath)) {
        console.log(`  ✓ ${pkg} installé`);
      } else {
        console.log(`  ✗ ${pkg} non installé`);
        errors.push(`${pkg} non installé`);
      }
    });
  } else {
    console.log(`  ✗ node_modules n'existe pas - exécutez "npm install"`);
    errors.push('Dépendances non installées');
  }
} catch (error) {
  console.log(`  ✗ Erreur lors de la vérification des dépendances`);
}

// Résultat final
console.log('\n' + '='.repeat(50));
if (allFilesExist && errors.length === 0) {
  console.log('✓ VALIDATION RÉUSSIE');
  console.log('\nLe code du Auth Service est correctement structuré.');
  console.log('\nProchaines étapes :');
  console.log('1. Configurez MongoDB Atlas (voir GUIDE_TEST.md)');
  console.log('2. Créez le fichier .env');
  console.log('3. Lancez: npm run dev');
  console.log('4. Testez les API avec Postman ou cURL');
} else {
  console.log('✗ VALIDATION ÉCHOUÉE');
  console.log('\nErreurs trouvées :');
  errors.forEach(error => {
    console.log(`  - ${error}`);
  });
  console.log('\nCorrigez les erreurs ci-dessus avant de continuer.');
}
console.log('='.repeat(50));
