# Plan de Développement - Bailleur Pro

## Structure du Projet (Monorepo)

```
bailleur-pro/
├── client/              # React + JSX + Tailwind
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── server/              # Node + Express + MongoDB
│   ├── config/
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Tenant.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── tenants.js
│   │   ├── payments.js
│   │   ├── stats.js
│   │   └── subscription.js
│   ├── middleware/
│   ├── cron/
│   └── server.js
├── .gitignore
└── README.md
```

## Workflow Git

- **main** : Version stable déployée sur Render
- **dev** : Branche de développement
- **feature/*** : Une branche par fonctionnalité
  - `feature/auth`
  - `feature/dashboard`
  - `feature/properties`
  - `feature/tenants`
  - `feature/payments`
  - `feature/subscription`
  - `feature/cron`

**Règles :**
- Interdit de push direct sur main
- Toujours créer une Pull Request
- Code review obligatoire
- Tests avant merge

## Étapes de Développement

### Phase 1 : Initialisation (Jour 1-2)

- [ ] Initialiser le repo Git
- [ ] Créer la structure monorepo
- [ ] Configurer .gitignore
- [ ] Initialiser client (React + Tailwind)
- [ ] Initialiser server (Node + Express)
- [ ] Configurer MongoDB Atlas
- [ ] Créer README.md

### Phase 2 : Backend - Modèles (Jour 3)

- [ ] Créer le modèle User.js
- [ ] Créer le modèle Property.js
- [ ] Créer le modèle Tenant.js
- [ ] Créer le modèle Payment.js
- [ ] Tester les modèles avec MongoDB

### Phase 3 : Backend - Routes Auth (Jour 4)

- [ ] Route POST /api/auth/register
- [ ] Route POST /api/auth/login
- [ ] Middleware d'authentification JWT
- [ ] Tests d'authentification

### Phase 4 : Backend - Routes Properties (Jour 5)

- [ ] Route GET /api/properties (liste)
- [ ] Route POST /api/properties (créer)
- [ ] Route PUT /api/properties/:id (modifier)
- [ ] Route DELETE /api/properties/:id (supprimer)
- [ ] Tests CRUD propriétés

### Phase 5 : Backend - Routes Tenants (Jour 6)

- [ ] Route GET /api/tenants (liste)
- [ ] Route POST /api/tenants (créer)
- [ ] Route PUT /api/tenants/:id (modifier)
- [ ] Route DELETE /api/tenants/:id (supprimer)
- [ ] Tests CRUD locataires

### Phase 6 : Backend - Routes Payments (Jour 7-8)

- [ ] Route GET /api/payments (liste)
- [ ] Route POST /api/payments (créer)
- [ ] Route PUT /api/payments/:id (modifier statut)
- [ ] Route GET /api/payments/tenant/:id (par locataire)
- [ ] Upload preuve de paiement
- [ ] Tests paiements

### Phase 7 : Backend - Routes Stats (Jour 9)

- [ ] Route GET /api/stats/dashboard
- [ ] Calcul total encaissé
- [ ] Calcul nombre impayés
- [ ] Calcul taux de remplissage
- [ ] Tests statistiques

### Phase 8 : Backend - Routes Subscription (Jour 10)

- [ ] Route POST /api/subscription/upgrade
- [ ] Intégration Campay API
- [ ] Mise à jour plan utilisateur
- [ ] Tests abonnement

### Phase 9 : Backend - CRON Automatique (Jour 11)

- [ ] Installer node-cron
- [ ] Créer tâche CRON (1er du mois)
- [ ] Générer paiements automatiques
- [ ] Tests CRON

### Phase 10 : Frontend - Landing Page (Jour 12)

- [ ] Design avec Canva
- [ ] Implémentation React
- [ ] Sections : Hero, Features, Pricing, CTA
- [ ] Responsive design

### Phase 11 : Frontend - Auth (Jour 13)

- [ ] Page Login
- [ ] Page Register
- [ ] Formulaire validation
- [ ] Intégration API auth
- [ ] Gestion erreurs

### Phase 12 : Frontend - Dashboard (Jour 14-15)

- [ ] Layout principal
- [ ] 4 cartes statistiques
- [ ] Graphique Chart.js
- [ ] Navigation sidebar
- [ ] Intégration API stats

### Phase 13 : Frontend - Mes Biens (Jour 16)

- [ ] Liste des propriétés
- [ ] Formulaire ajout
- [ ] Formulaire modification
- [ ] Confirmation suppression
- [ ] Intégration API properties

### Phase 14 : Frontend - Mes Locataires (Jour 17)

- [ ] Liste des locataires
- [ ] Formulaire ajout
- [ ] Formulaire modification
- [ ] Confirmation suppression
- [ ] Intégration API tenants

### Phase 15 : Frontend - Loyers du Mois (Jour 18)

- [ ] Tableau des paiements
- [ ] Bouton Payé/Impayé
- [ ] Filtres par mois
- [ ] Upload preuve paiement
- [ ] Intégration API payments

### Phase 16 : Frontend - Page Locataire (Jour 19)

- [ ] Vue locataire (restreinte)
- [ ] Liste des factures
- [ ] Historique paiements
- [ ] Intégration API payments

### Phase 17 : Frontend - Abonnement (Jour 20)

- [ ] Page plans tarifaires
- [ ] Bouton "Passer Pro"
- [ ] Intégration Campay
- [ ] Confirmation paiement
- [ ] Mise à jour UI

### Phase 18 : Tests & Debug (Jour 21-22)

- [ ] Tests E2E
- [ ] Tests unitaires
- [ ] Correction bugs
- [ ] Optimisation performance
- [ ] Accessibilité

### Phase 19 : Déploiement (Jour 23-24)

- [ ] Configuration Render (Frontend)
- [ ] Configuration Render (Backend)
- [ ] Configuration MongoDB Atlas
- [ ] Variables d'environnement
- [ ] Tests de production

### Phase 20 : Documentation & Présentation (Jour 25)

- [ ] Documentation technique
- [ ] Guide utilisateur
- [ ] Présentation jury
- [ ] Démo live
- [ ] Vidéo de démonstration

## Technologies & Dépendances

### Client (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "axios": "^1.0.0",
    "chart.js": "^4.0.0",
    "react-chartjs-2": "^5.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

### Server (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "node-cron": "^3.0.0",
    "multer": "^1.4.5"
  }
}
```

## Variables d'Environnement

### Server (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CAMPAY_API_KEY=your_campay_key
CAMPAY_API_SECRET=your_campay_secret
PORT=5000
NODE_ENV=production
```

### Client (.env)
```
VITE_API_URL=https://bailleur-pro-server.onrender.com
```

## Critères de Succès

- [ ] Toutes les 8 pages fonctionnelles
- [ ] CRON automatique opérationnel
- [ ] Intégration Campay fonctionnelle
- [ ] Dashboard avec graphiques
- [ ] Tests passants (>80%)
- [ ] Déployé sur Render
- [ ] Documentation complète
- [ ] Présentation prête

## Risques & Mitigations

**Risque 1 :** Intégration Campay complexe
- **Mitigation :** Prévoir fallback (paiement manuel)

**Risque 2 :** CRON ne fonctionne pas sur Render
- **Mitigation :** Utiliser Render Cron ou alternative

**Risque 3 :** Performance avec beaucoup de données
- **Mitigation :** Pagination et indexation MongoDB

**Risque 4 :** Sécurité des données
- **Mitigation :** Hash passwords, JWT, HTTPS

## Ressources Utiles

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Campay API](https://campay.net/api/)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
