# Auth Service - Microservice d'Authentification

Microservice d'authentification pour Bailleur Pro. Gère l'inscription, la connexion et la gestion des profils utilisateurs.

## Fonctionnalités

- Inscription d'utilisateurs (bailleurs et locataires)
- Connexion avec JWT
- Gestion du profil utilisateur
- Changement de mot de passe
- Vérification de token
- Rôles : bailleur / locataire
- Plans : gratuit / pro

## Installation

```bash
cd services/auth-service
npm install
```

## Configuration

Créer un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
```

Modifier les variables dans `.env` :

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bailleur-pro-auth?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Démarrage

**Mode développement (avec nodemon) :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le service sera disponible sur `http://localhost:5001`

## API Endpoints

### Publiques

#### POST /api/auth/register
Inscrire un nouvel utilisateur

**Body :**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "Password123",
  "role": "bailleur"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "role": "bailleur",
      "plan": "gratuit",
      "isSubscribed": false
    }
  }
}
```

#### POST /api/auth/login
Connecter un utilisateur

**Body :**
```json
{
  "email": "jean@example.com",
  "password": "Password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "role": "bailleur",
      "plan": "gratuit",
      "isSubscribed": false
    }
  }
}
```

### Protégées (nécessitent un token JWT)

#### GET /api/auth/me
Obtenir le profil de l'utilisateur connecté

**Headers :**
```
Authorization: Bearer <token>
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "bailleur",
    "plan": "gratuit",
    "isSubscribed": false,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### PUT /api/auth/update-profile
Mettre à jour le profil utilisateur

**Headers :**
```
Authorization: Bearer <token>
```

**Body :**
```json
{
  "name": "Jean Pierre Dupont",
  "email": "jean.pierre@example.com"
}
```

#### PUT /api/auth/change-password
Changer le mot de passe

**Headers :**
```
Authorization: Bearer <token>
```

**Body :**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

#### POST /api/auth/logout
Déconnecter l'utilisateur (suppression du token côté client)

**Headers :**
```
Authorization: Bearer <token>
```

#### GET /api/auth/verify-token
Vérifier la validité du token

**Headers :**
```
Authorization: Bearer <token>
```

## Modèle User

```javascript
{
  name: String,           // Nom de l'utilisateur
  email: String,          // Email (unique)
  password: String,       // Mot de passe hashé
  role: String,           // 'bailleur' ou 'locataire'
  plan: String,           // 'gratuit' ou 'pro'
  isSubscribed: Boolean,  // Statut d'abonnement
  isActive: Boolean,      // Statut du compte
  createdAt: Date,        // Date de création
  updatedAt: Date         // Date de mise à jour
}
```

## Sécurité

- Les mots de passe sont hashés avec bcryptjs
- Tokens JWT avec expiration configurable
- Validation des entrées avec express-validator
- Protection contre les injections SQL (MongoDB)
- CORS configuré

## Tests

### Test avec cURL

**Inscription :**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123","role":"bailleur"}'
```

**Connexion :**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'
```

**Profil (avec token) :**
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer <your_token>"
```

## Déploiement sur Render

1. Créer un nouveau Web Service sur Render
2. Connecter le repo GitHub
3. Configurer les variables d'environnement
4. Build Command : `npm install`
5. Start Command : `node server.js`

## Structure du Projet

```
auth-service/
├── config/
│   └── db.js              # Configuration MongoDB
├── controllers/
│   └── authController.js  # Logique métier
├── middleware/
│   ├── auth.js            # Middleware JWT
│   └── validator.js       # Validation des entrées
├── models/
│   └── User.js            # Modèle Mongoose
├── routes/
│   └── auth.js            # Routes Express
├── .env.example           # Exemple de variables d'environnement
├── .gitignore             # Fichiers ignorés par Git
├── package.json           # Dépendances
├── server.js              # Point d'entrée
└── README.md              # Documentation
```
