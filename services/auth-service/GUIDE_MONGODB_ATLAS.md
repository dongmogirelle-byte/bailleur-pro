# Guide Détaillé - Création Utilisateur MongoDB Atlas

## Étape 1 : Accéder à Database Access

1. Connectez-vous à https://www.mongodb.com/cloud/atlas
2. Cliquez sur votre projet/cluster
3. Dans le menu de gauche, cliquez sur **"Database Access"** (sous "Security")

## Étape 2 : Créer un Nouvel Utilisateur

### Option A : "Add New Database User" (Bouton principal)

1. Cliquez sur le bouton vert **"Add New Database User"** (en haut à droite)
2. Un formulaire s'ouvre

### Option B : Si vous ne voyez pas "Add New Database User"

1. Cherchez un bouton **"+ Add New Database User"** ou **"Create"**
2. Ou cliquez sur l'icône **"+"** dans la section "Database Users"

## Étape 3 : Configurer l'Utilisateur

### Méthode 1 : Password Authentication (Recommandée)

**Username :**
- Entrez : `bailleur-pro` (ou un nom de votre choix)
- Notez-le pour plus tard

**Password :**
- Cliquez sur **"Autogenerate Secure Password"** OU
- Entrez un mot de passe manuel (minimum 8 caractères)
- **IMPORTANT :** Cliquez sur le bouton "Copy" pour copier le mot de passe
- Sauvegardez-le dans un endroit sûr (vous ne pourrez plus le voir après)

**Database User Privileges :**
- Si vous voyez **"Read and write to any database"** → Sélectionnez cette option
- Si vous ne voyez pas cette option, cherchez :
  - **"Built-in Role"** → Sélectionnez **"readWriteAnyDatabase"**
  - OU **"Custom Role"** → Cochez les cases pour **"Read"** et **"Write"** sur toutes les databases
- Si vous voyez **"Specific Privilege"** :
  - Database : `admin`
  - Collection : `anyCollection`
  - Privileges : Cochez **"find"**, **"insert"**, **"update"**, **"remove"**

### Méthode 2 : Atlas Admin (Alternative)

Si les options ci-dessus ne fonctionnent pas :

1. Dans "Built-in Role", sélectionnez **"atlasAdmin"**
2. Cela donne tous les droits (plus que nécessaire mais fonctionnel)

## Étape 4 : Sauvegarder

1. Cliquez sur le bouton **"Add User"** ou **"Create"** (en bas du formulaire)
2. L'utilisateur apparaît maintenant dans la liste "Database Users"

## Étape 5 : Configurer l'Accès Réseau (IP Whitelist)

1. Dans le menu de gauche, cliquez sur **"Network Access"** (sous "Security")
2. Cliquez sur **"Add IP Address"** ou **"+ Add IP Address"**
3. Sélectionnez **"Allow Access from Anywhere"** (option : 0.0.0.0/0)
4. Cliquez sur **"Confirm"**

## Étape 6 : Obtenir la Connection String

1. Dans le menu de gauche, cliquez sur **"Clusters"**
2. Cliquez sur le bouton **"Connect"** de votre cluster
3. Sélectionnez **"Connect your application"**
4. Driver : **Node.js**
5. Version : **4.1 or later**
6. Copiez la connection string

Elle ressemble à :
```
mongodb+srv://bailleur-pro:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Étape 7 : Créer le fichier .env

1. Dans `services/auth-service/`, créez le fichier `.env`
2. Collez la connection string en remplaçant `<password>` par votre mot de passe

```env
PORT=5001
MONGODB_URI=mongodb+srv://bailleur-pro:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/bailleur-pro-auth?retryWrites=true&w=majority
JWT_SECRET=votre_clé_secrète_très_longue_et_complexe
JWT_EXPIRE=7d
NODE_ENV=development
```

## Dépannage

### Je ne trouve pas "Database Access"
- Cherchez dans le menu : **Security** → **Database Access**
- Ou cherchez l'icône d'un utilisateur/clé

### Je ne trouve pas "Add New Database User"
- Cherchez un bouton **"+"** ou **"Create"**
- Ou regardez en haut à droite de la page

### Je ne trouve pas "Read and write to any database"
- Cherchez **"Built-in Role"** → **"readWriteAnyDatabase"**
- Ou **"Custom Role"** avec permissions Read/Write
- Ou utilisez **"atlasAdmin"** (plus permissif)

### Erreur "Authentication failed"
- Vérifiez que le username est correct
- Vérifiez que le mot de passe est correct (copiez-le depuis MongoDB Atlas)
- Vérifiez que l'utilisateur a les droits nécessaires

### Erreur "IP not allowed"
- Allez dans **Network Access**
- Ajoutez l'IP **0.0.0.0/0** (allow from anywhere)

## Alternative : Utiliser MongoDB Compass (GUI)

Si vous préférez une interface graphique :

1. Téléchargez MongoDB Compass : https://www.mongodb.com/try/download/compass
2. Connectez-vous avec votre connection string
3. Vous pourrez créer des utilisateurs via l'interface graphique

## Vérification

Une fois configuré, testez avec :

```bash
cd services/auth-service
npm run dev
```

Vous devriez voir :
```
MongoDB connecté: cluster0.xxxxx.mongodb.net
Auth Service démarré sur le port 5001
```

Si vous voyez une erreur de connexion, vérifiez :
- Connection string correcte
- Mot de passe correct
- IP whitelist configurée
- Utilisateur avec les bons droits
