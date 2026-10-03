# Property Service - Service de Gestion des Propriétés

Microservice de gestion des propriétés pour Bailleur Pro.

## Technologies

- **Express** - Framework web
- **Mongoose** - ODM MongoDB
- **express-validator** - Validation des données

## Structure du Projet

```
property-service/
├── models/
│   └── Property.js              # Schéma Mongoose des propriétés
├── controllers/
│   └── propertyController.js    # Logique métier
├── middleware/
│   └── validator.js            # Validation des entrées
├── routes/
│   └── property.js             # Routes avec MongoDB
├── routes-property-test.js     # Routes sans MongoDB (mode dégradé)
├── config/
│   └── db.js                   # Configuration MongoDB
├── server.js                   # Serveur principal
├── package.json
└── .env.example                # Variables d'environnement
```

## Modèle de Données (Français)

### Structure d'une Propriété

```javascript
{
  // Informations de base
  nom: "Maison Douala",
  type: "maison",  // maison, appartement, immeuble, terrain, bureau, commerce
  
  // Adresse complète
  adresse: {
    rue: "Rue Principale",
    numero: "123",
    quartier: "Akwa",
    ville: "Douala",
    pays: "Cameroun",
    codePostal: "00237"
  },
  
  // Caractéristiques
  caracteristiques: {
    chambres: 3,
    sallesDeBain: 2,
    surface: 120,  // en m²
    etages: 1,
    anneeConstruction: 2020,
    parking: true,
    nombreParking: 2,
    jardin: false,
    piscine: false,
    balcon: true,
    meuble: false,
    climatisation: true,
    chauffage: false
  },
  
  // Informations financières
  loyer: 150000,  // en FCFA
  devise: "XAF",  // XAF, EUR, USD
  caution: 300000,
  
  // Statut
  statut: "disponible",  // disponible, occupee, en_maintenance, en_vente, reservee
  
  // Propriétaire
  bailleurId: "user_id",
  
  // Locataire actuel
  locataireId: null,
  
  // Photos
  photos: [
    {
      url: "https://example.com/photo1.jpg",
      description: "Vue de face",
      ordre: 0
    }
  ],
  
  // Description
  description: "Belle maison avec vue sur mer",
  
  // Équipements
  equipements: ["wifi", "gardiennage", "eau courante"],
  
  // Règles
  regles: {
    animauxAutorises: false,
    fumeursAutorises: false,
    dureeMinimaleBail: 6,
    dureeMaximaleBail: 12
  },
  
  // Métadonnées
  dateCreation: Date,
  dateModification: Date,
  dateDisponibilite: Date,
  nombreVues: 0,
  nombreInterets: 0,
  active: true
}
```

## API Endpoints

### Routes Publiques

- **GET** `/api/properties` - Lister toutes les propriétés
  - Query params : `ville`, `type`, `statut`, `loyerMin`, `loyerMax`, `chambresMin`, `page`, `limite`
  
- **GET** `/api/properties/:id` - Obtenir une propriété par ID
  
- **GET** `/api/properties/bailleur/:bailleurId` - Propriétés d'un bailleur

### Routes Privées (nécessitent authentification)

- **POST** `/api/properties` - Créer une propriété
  - Body : données de la propriété
  
- **PUT** `/api/properties/:id` - Mettre à jour une propriété
  - Body : champs à modifier
  
- **DELETE** `/api/properties/:id` - Supprimer une propriété (désactivation)
  
- **PUT** `/api/properties/:id/statut` - Changer le statut
  - Body : `{ statut: "disponible" }`
  
- **POST** `/api/properties/:id/photos` - Ajouter une photo
  - Body : `{ url: "https://...", description: "..." }`
  
- **GET** `/api/properties/statistiques/bailleur/:bailleurId` - Statistiques du bailleur
  - Retourne : total, disponibles, occupees, en_maintenance, revenuMensuelTotal, tauxOccupation

## Installation

```bash
cd services/property-service
npm install
```

## Configuration

Créer un fichier `.env` à partir de `.env.example` :

```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/bailleur-pro-property
NODE_ENV=development
```

## Démarrage

**Mode développement :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le service sera disponible sur `http://localhost:5002`

## Mode Dégradé (sans MongoDB)

Si MongoDB n'est pas disponible, le service démarre automatiquement en mode dégradé avec des routes de test qui utilisent un stockage en mémoire.

## Validation

Les validations sont effectuées avec `express-validator` :

- Nom : 3-100 caractères
- Type : doit être valide
- Adresse : rue, numéro, quartier, ville obligatoires
- Surface : nombre positif
- Loyer : nombre positif

## Sécurité

- Les routes privées nécessitent un token JWT valide
- Un bailleur ne peut modifier que ses propres propriétés
- La suppression est une désactivation (soft delete)
- Les données sensibles sont protégées

## Exemples de Requêtes

### Créer une propriété

```bash
POST /api/properties
Content-Type: application/json
Authorization: Bearer <token>

{
  "nom": "Maison Douala",
  "type": "maison",
  "adresse": {
    "rue": "Rue Principale",
    "numero": "123",
    "quartier": "Akwa",
    "ville": "Douala",
    "pays": "Cameroun"
  },
  "caracteristiques": {
    "chambres": 3,
    "sallesDeBain": 2,
    "surface": 120
  },
  "loyer": 150000,
  "devise": "XAF",
  "statut": "disponible"
}
```

### Lister les propriétés avec filtres

```bash
GET /api/properties?ville=Douala&type=maison&loyerMax=200000&page=1&limite=10
```

### Obtenir les statistiques d'un bailleur

```bash
GET /api/properties/statistiques/bailleur/user_id
```

## Déploiement

Le service sera déployé sur Render avec MongoDB Atlas.

## Prochaines Étapes

1. Intégrer le middleware d'authentification du Auth Service
2. Ajouter l'upload de photos avec Cloudinary
3. Créer le Tenant Service
4. Créer le Payment Service
