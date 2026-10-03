# Guide Configuration MongoDB Atlas - Tous les Services

Ce guide explique comment configurer MongoDB Atlas pour les 5 microservices de Bailleur Pro.

## Services à Configurer

1. **Auth Service** (port 5001) - Base: `bailleur-pro-auth`
2. **Property Service** (port 5002) - Base: `bailleur-pro-property`
3. **Tenant Service** (port 5003) - Base: `bailleur-pro-tenant`
4. **Payment Service** (port 5004) - Base: `bailleur-pro-payment`
5. **Notification Service** (port 5005) - Base: `bailleur-pro-notification`

## Étape 1 : Créer un compte MongoDB Atlas

Si vous n'avez pas encore de compte MongoDB Atlas :

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Cliquez sur "Try Free" ou "Sign Up"
3. Créez un compte avec votre email
4. Vérifiez votre email

## Étape 2 : Créer un Cluster

1. Connectez-vous à MongoDB Atlas
2. Cliquez sur "Build a Database"
3. Choisissez le plan **M0 Free** (gratuit)
4. Sélectionnez la région la plus proche (ex: Paris, Frankfurt)
5. Nommez le cluster : `bailleur-pro-cluster`
6. Cliquez sur "Create"

**Note :** La création du cluster prend environ 5-10 minutes.

## Étape 3 : Créer un Utilisateur de Base de Données

1. Une fois le cluster créé, cliquez sur "Database Access" dans le menu de gauche
2. Cliquez sur "Add New Database User"
3. Remplissez le formulaire :
   - **Username** : `bailleurpro_admin` (ou autre nom)
   - **Password** : Choisissez un mot de passe fort (notez-le !)
   - **Database User Privileges** : Choisissez **"Read and write to any database"**
4. Cliquez sur "Add User"

**Important :** Notez le username et le mot de passe.

## Étape 4 : Configurer l'Accès Réseau (IP Whitelist)

1. Cliquez sur "Network Access" dans le menu de gauche
2. Cliquez sur "Add IP Address"
3. Cliquez sur "Allow Access from Anywhere" (0.0.0.0/0)
4. Cliquez sur "Confirm"

## Étape 5 : Obtenir la Connection String

1. Cliquez sur "Database" dans le menu de gauche
2. Cliquez sur le bouton "Connect" de votre cluster
3. Choisissez "Connect your application"
4. Sélectionnez "Node.js" comme driver
5. Copiez la connection string

Elle ressemble à :
```
mongodb+srv://bailleurpro_admin:<password>@bailleur-pro-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Étape 6 : Configurer Auth Service

Créez le fichier `services/auth-service/.env` :

```env
PORT=5001
MONGODB_URI=mongodb+srv://bailleurpro_admin:<VOTRE_MOT_DE_PASSE>@bailleur-pro-cluster.xxxxx.mongodb.net/bailleur-pro-auth?retryWrites=true&w=majority
JWT_SECRET=votre_secret_key_très_longue_et_sécurisée
JWT_EXPIRE=7d
NODE_ENV=development
```

## Étape 7 : Configurer Property Service

Créez le fichier `services/property-service/.env` :

```env
PORT=5002
MONGODB_URI=mongodb+srv://bailleurpro_admin:<VOTRE_MOT_DE_PASSE>@bailleur-pro-cluster.xxxxx.mongodb.net/bailleur-pro-property?retryWrites=true&w=majority
NODE_ENV=development
```

## Étape 8 : Configurer Tenant Service

Créez le fichier `services/tenant-service/.env` :

```env
PORT=5003
MONGODB_URI=mongodb+srv://bailleurpro_admin:<VOTRE_MOT_DE_PASSE>@bailleur-pro-cluster.xxxxx.mongodb.net/bailleur-pro-tenant?retryWrites=true&w=majority
NODE_ENV=development
```

## Étape 9 : Configurer Payment Service

Créez le fichier `services/payment-service/.env` :

```env
PORT=5004
MONGODB_URI=mongodb+srv://bailleurpro_admin:<VOTRE_MOT_DE_PASSE>@bailleur-pro-cluster.xxxxx.mongodb.net/bailleur-pro-payment?retryWrites=true&w=majority
NODE_ENV=development
JWT_SECRET=votre_secret_key_très_longue_et_sécurisée
```

## Étape 10 : Configurer Notification Service

Créez le fichier `services/notification-service/.env` :

```env
PORT=5005
MONGODB_URI=mongodb+srv://bailleurpro_admin:<VOTRE_MOT_DE_PASSE>@bailleur-pro-cluster.xxxxx.mongodb.net/bailleur-pro-notification?retryWrites=true&w=majority
NODE_ENV=development

# Email Configuration (optionnel pour l'instant)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Étape 11 : Démarrer Tous les Services

Ouvrez 5 terminaux et lancez chaque service :

**Terminal 1 - Auth Service :**
```bash
cd services/auth-service
npm start
```

**Terminal 2 - Property Service :**
```bash
cd services/property-service
npm start
```

**Terminal 3 - Tenant Service :**
```bash
cd services/tenant-service
npm start
```

**Terminal 4 - Payment Service :**
```bash
cd services/payment-service
npm start
```

**Terminal 5 - Notification Service :**
```bash
cd services/notification-service
npm start
```

## Étape 12 : Vérifier la Connexion

Chaque service devrait afficher :
```
✓ MongoDB connecté: bailleur-pro-cluster.xxxxx.mongodb.net
[Service Name] Service démarré sur le port [PORT] en mode development
```

## Étape 13 : Vérifier les Bases de Données dans MongoDB Atlas

1. Allez sur MongoDB Atlas
2. Cliquez sur "Database"
3. Cliquez sur "Browse Collections"
4. Vous verrez vos 5 bases de données :
   - `bailleur-pro-auth`
   - `bailleur-pro-property`
   - `bailleur-pro-tenant`
   - `bailleur-pro-payment`
   - `bailleur-pro-notification`

## Structure des Bases de Données

### bailleur-pro-auth
- Collection : `users`

### bailleur-pro-property
- Collection : `properties`
- Collection : `incidents`

### bailleur-pro-tenant
- Collection : `tenants`
- Collection : `contracts`

### bailleur-pro-payment
- Collection : `payments`
- Collection : `receipts`

### bailleur-pro-notification
- Collection : `notifications`

## Dépannage

### Problème : "Connection timeout"
- Vérifiez que votre IP est dans la whitelist
- Vérifiez que le cluster est en état "Ready"

### Problème : "Authentication failed"
- Vérifiez le username et le mot de passe
- Vérifiez que l'utilisateur a les bons droits

### Problème : "Database not found"
- MongoDB Atlas crée automatiquement la base de données lors de la première connexion
- Assurez-vous que le nom de la base de données est correct dans la connection string

## Résumé

✓ Compte MongoDB Atlas créé
✓ Cluster M0 Free créé
✓ Utilisateur de base de données créé
✓ Accès réseau configuré
✓ Connection string obtenue
✓ Auth Service configuré
✓ Property Service configuré
✓ Tenant Service configuré
✓ Payment Service configuré
✓ Notification Service configuré
✓ Tous les services testés avec MongoDB

## Prochaine Étape

Une fois MongoDB configuré, vous pourrez :
- Tester la persistance des données
- Voir les données dans MongoDB Atlas
- Passer en mode production sur Render
