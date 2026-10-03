# Bailleur Pro - SaaS de Gestion Immobilière

Architecture Microservices pour la gestion immobilière en Afrique.

## Architecture

6 Microservices :
- **Auth Service** (Port 5001) - Authentification des utilisateurs
- **Property Service** (Port 5002) - Gestion des biens immobiliers
- **Tenant Service** (Port 5003) - Gestion des locataires
- **Payment Service** (Port 5004) - Gestion des paiements
- **Stats Service** (Port 5005) - Statistiques et dashboard
- **Subscription Service** (Port 5006) - Gestion des abonnements

## Structure du Projet

```
bailleur-pro/
├── services/
│   ├── auth-service/
│   ├── property-service/
│   ├── tenant-service/
│   ├── payment-service/
│   ├── stats-service/
│   └── subscription-service/
├── client/
└── README.md
```

## Technologies

- **Frontend** : React + JSX + Tailwind + Chart.js
- **Backend** : Node.js + Express + MongoDB
- **Communication** : REST API + HTTP
- **Déploiement** : Render + MongoDB Atlas

## Workflow Git

- `main` : Version stable déployée sur Render
- `dev` : Branche de développement
- `feature/*` : Une branche par fonctionnalité

Interdit de push direct sur main. Utilisez les Pull Requests.

## Démarrage Rapide

### Prérequis
- Node.js 18+
- MongoDB Atlas
- Compte Render

### Installation

```bash
# Cloner le repo
git clone <repo-url>
cd bailleur-pro

# Installer les dépendances de chaque service
cd services/auth-service && npm install
cd ../property-service && npm install
# ... etc
```

### Configuration

Créer un fichier `.env` dans chaque service avec les variables nécessaires.

### Lancement

```bash
# Lancer chaque service
cd services/auth-service && npm run dev
cd services/property-service && npm run dev
# ... etc
```

## Documentation

- [Analyse du Projet](./ANALYSE_PROJET_BAILLEUR_PRO.md)
- [Plan de Développement](./PLAN_DEVELOPPEMENT.md)
- [Architecture Microservices](./ARCHITECTURE_MICROSERVICES.md)
