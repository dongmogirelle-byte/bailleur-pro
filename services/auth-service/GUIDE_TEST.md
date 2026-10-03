# Guide de Test - Auth Service

## Étape 1 : Configuration MongoDB Atlas

### 1. Créer un compte MongoDB Atlas
1. Allez sur https://www.mongodb.com/cloud/atlas
2. Créez un compte gratuit
3. Créez un nouveau cluster (gratuit M0)

### 2. Configurer l'accès réseau
1. Dans votre cluster, allez dans "Network Access"
2. Cliquez sur "Add IP Address"
3. Sélectionnez "Allow Access from Anywhere" (0.0.0.0/0)
4. Cliquez sur "Confirm"

### 3. Créer un utilisateur de base de données
1. Allez dans "Database Access"
2. Cliquez on "Add New Database User"
3. Username : `bailleur-pro` (ou votre choix)
4. Password : Générez un mot de passe fort
5. Database User Privileges : "Read and write to any database"
6. Cliquez sur "Add User"

### 4. Obtenir la Connection String
1. Allez dans "Clusters"
2. Cliquez sur "Connect" sur votre cluster
3. Sélectionnez "Connect your application"
4. Choisissez "Node.js" et version 4.1 or later
5. Copiez la connection string

Elle ressemble à :
```
mongodb+srv://bailleur-pro:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Étape 2 : Créer le fichier .env

1. Copiez le fichier `.env.example` :
```bash
cd services/auth-service
cp .env.example .env
```

2. Éditez le fichier `.env` et remplacez les valeurs :

```env
PORT=5001
MONGODB_URI=mongodb+srv://bailleur-pro:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/bailleur-pro-auth?retryWrites=true&w=majority
JWT_SECRET=votre_clé_secrète_très_longue_et_complexe_pour_la_sécurité
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important :**
- Remplacez `<password>` par votre vrai mot de passe MongoDB
- Remplacez `JWT_SECRET` par une chaîne longue et aléatoire
- Ne partagez jamais votre fichier `.env`

## Étape 3 : Démarrer le Service

```bash
cd services/auth-service
npm run dev
```

Vous devriez voir :
```
MongoDB connecté: cluster0.xxxxx.mongodb.net
Auth Service démarré sur le port 5001 en mode development
URL: http://localhost:5001
```

## Étape 4 : Tester avec Postman ou cURL

### Test 1 : Vérifier que le service fonctionne

```bash
curl http://localhost:5001/health
```

Réponse attendue :
```json
{
  "success": true,
  "message": "Auth Service is running",
  "service": "auth-service",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2 : Inscrire un utilisateur

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "password": "Password123",
    "role": "bailleur"
  }'
```

Réponse attendue :
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Jean Dupont",
      "email": "jean.dupont@example.com",
      "role": "bailleur",
      "plan": "gratuit",
      "isSubscribed": false
    }
  }
}
```

### Test 3 : Connecter l'utilisateur

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "Password123"
  }'
```

### Test 4 : Obtenir le profil (avec token)

Remplacez `<TOKEN>` par le token reçu lors de la connexion :

```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### Test 5 : Tester la validation (mauvais email)

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "email_invalide",
    "password": "Password123"
  }'
```

Réponse attendue (erreur 400) :
```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": [...]
}
```

## Étape 5 : Tester avec Postman (Recommandé)

### Importer la collection Postman

Créez une nouvelle collection "Bailleur Pro Auth" avec ces requêtes :

**1. Health Check**
- Method: GET
- URL: http://localhost:5001/health

**2. Register**
- Method: POST
- URL: http://localhost:5001/api/auth/register
- Body (raw JSON):
```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "password": "Password123",
  "role": "bailleur"
}
```

**3. Login**
- Method: POST
- URL: http://localhost:5001/api/auth/login
- Body (raw JSON):
```json
{
  "email": "jean.dupont@example.com",
  "password": "Password123"
}
```

**4. Get Profile**
- Method: GET
- URL: http://localhost:5001/api/auth/me
- Headers:
  - Authorization: Bearer {{token}}
- Dans Postman, créez une variable `token` et définissez-la avec la valeur du token reçu

## Étape 6 : Vérifier dans MongoDB Atlas

1. Allez sur MongoDB Atlas
2. Cliquez sur "Collections" dans votre cluster
3. Vous devriez voir la collection `users`
4. Cliquez sur la collection pour voir les documents créés
5. Vérifiez que le mot de passe est bien hashé (ne devrait pas être en clair)

## Checklist de Validation

- [ ] MongoDB Atlas configuré
- [ ] Fichier .env créé avec les bonnes valeurs
- [ ] Service démarre sans erreur
- [ ] Health check retourne 200
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Token JWT généré
- [ ] Profil accessible avec token
- [ ] Validation des entrées fonctionne
- [ ] Données visibles dans MongoDB Atlas
- [ ] Mot de passe hashé dans la base de données

## Dépannage

### Erreur : "MongooseServerSelectionError"
- Vérifiez votre connection string MongoDB
- Vérifiez que l'accès IP est configuré (0.0.0.0/0)
- Vérifiez que l'utilisateur de base de données existe

### Erreur : "JsonWebTokenError"
- Vérifiez que JWT_SECRET est défini dans .env
- Vérifiez que le token est correctement passé dans le header

### Erreur : "ECONNREFUSED"
- Vérifiez que le service est démarré
- Vérifiez que le port 5001 n'est pas utilisé par une autre application

## Prochaines Étapes

Une fois le Auth Service testé et validé :
1. Passer au Property Service
2. Tester la communication entre services
3. Développer le frontend React
