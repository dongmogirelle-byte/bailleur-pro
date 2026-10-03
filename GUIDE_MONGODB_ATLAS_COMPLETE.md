# Guide Complet MongoDB Atlas pour Bailleur Pro

Ce guide vous explique comment configurer MongoDB Atlas pour les microservices Auth et Property.

## Pourquoi MongoDB Atlas ?

- Base de données cloud (pas besoin d'installation locale)
- Gratuit pour le développement (cluster M0)
- Scalable pour la production
- Accès depuis n'importe où

## Étape 1 : Créer un compte MongoDB Atlas

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
     - Si cette option n'est pas visible, choisissez **"Atlas admin"**
4. Cliquez sur "Add User"

**Important :** Notez le username et le mot de passe, ils seront nécessaires pour la connection string.

## Étape 4 : Configurer l'Accès Réseau (IP Whitelist)

1. Cliquez sur "Network Access" dans le menu de gauche
2. Cliquez sur "Add IP Address"
3. Choisissez l'une de ces options :
   - **Option A (Développement)** : Cliquez sur "Allow Access from Anywhere" (0.0.0.0/0)
   - **Option B (Plus sécurisée)** : Ajoutez votre adresse IP spécifique
4. Cliquez sur "Confirm"

**Note :** Pour le développement, l'option A est plus simple. Pour la production, utilisez l'option B.

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

1. Créez le fichier `services/auth-service/.env` avec le contenu suivant :

```env
PORT=5001
MONGODB_URI=mongodb+srv://bailleurpro_admin:<VOTRE_MOT_DE_PASSE>@bailleur-pro-cluster.xxxxx.mongodb.net/bailleur-pro-auth?retryWrites=true&w=majority
JWT_SECRET=votre_secret_key_très_longue_et_sécurisée
JWT_EXPIRE=7d
NODE_ENV=development
```

**Remplacez :**
- `<VOTRE_MOT_DE_PASSE>` par votre mot de passe MongoDB
- `xxxxx` par votre cluster ID
- `votre_secret_key_très_longue_et_sécurisée` par une clé secrète pour JWT

## Étape 7 : Configurer Property Service

1. Créez le fichier `services/property-service/.env` avec le contenu suivant :

```env
PORT=5002
MONGODB_URI=mongodb+srv://bailleurpro_admin:<VOTRE_MOT_DE_PASSE>@bailleur-pro-cluster.xxxxx.mongodb.net/bailleur-pro-property?retryWrites=true&w=majority
NODE_ENV=development
```

**Remplacez :**
- `<VOTRE_MOT_DE_PASSE>` par votre mot de passe MongoDB
- `xxxxx` par votre cluster ID

**Note :** La seule différence est le nom de la base de données (`bailleur-pro-auth` vs `bailleur-pro-property`)

## Étape 8 : Tester les Services avec MongoDB

### Tester Auth Service

```bash
cd services/auth-service
npm run dev
```

Vous devriez voir :
```
✓ MongoDB connecté: bailleur-pro-cluster.xxxxx.mongodb.net
Auth Service démarré sur le port 5001 en mode development
```

### Tester Property Service

```bash
cd services/property-service
npm run dev
```

Vous devriez voir :
```
✓ MongoDB connecté: bailleur-pro-cluster.xxxxx.mongodb.net
Property Service démarré sur le port 5002 en mode development
```

## Étape 9 : Vérifier les Données dans MongoDB Atlas

1. Allez sur MongoDB Atlas
2. Cliquez sur "Database"
3. Cliquez sur "Browse Collections"
4. Vous verrez vos bases de données :
   - `bailleur-pro-auth` avec la collection `users`
   - `bailleur-pro-property` avec la collection `properties`

## Structure des Bases de Données

### bailleur-pro-auth
- Collection : `users`
- Documents : Utilisateurs avec hash de mot de passe, role, plan, etc.

### bailleur-pro-property
- Collection : `properties`
- Documents : Propriétés avec adresse, caractéristiques, loyer, etc.

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

## Sécurité pour la Production

1. **Ne jamais commiter les fichiers .env**
2. **Utiliser des variables d'environnement** sur Render
3. **Limiter l'accès IP** au lieu de "Allow from Anywhere"
4. **Utiliser un mot de passe fort**
5. **Activer l'encryption TLS** (déjà activé par défaut)

## Prochaine Étape

Une fois MongoDB configuré, vous pourrez :
- Tester la persistance des données
- Voir les données dans MongoDB Atlas
- Passer en mode production sur Render

## Résumé

✓ Compte MongoDB Atlas créé
✓ Cluster M0 Free créé
✓ Utilisateur de base de données créé
✓ Accès réseau configuré
✓ Connection string obtenue
✓ Auth Service configuré
✓ Property Service configuré
✓ Services testés avec MongoDB
