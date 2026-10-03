# Architecture Microservices - Bailleur Pro

## Nombre de Microservices : 6

Pour le projet Bailleur Pro, je recommande **6 microservices principaux**. Cette architecture permet une scalabilité indépendante tout en restant gérable pour une équipe.

---

## 1. Auth Service (Service d'Authentification)

**Responsabilités :**
- Inscription des utilisateurs (bailleurs et locataires)
- Connexion (login)
- Gestion des tokens JWT
- Récupération de mot de passe
- Validation des tokens

**API Endpoints :**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
GET  /api/auth/verify-token
```

**Base de données :** MongoDB (Collection: users)

**Dépendances :**
- bcryptjs (hash passwords)
- jsonwebtoken (JWT)
- Express

**Pourquoi séparé ?**
- Logique critique de sécurité
- Peut évoluer indépendamment (OAuth, 2FA)
- Shared avec tous les autres services

---

## 2. Property Service (Service des Biens)

**Responsabilités :**
- CRUD des propriétés (immeubles, maisons)
- Gestion des détails (ville, nb appartements)
- Association avec les propriétaires
- Recherche et filtrage

**API Endpoints :**
```
GET    /api/properties
POST   /api/properties
GET    /api/properties/:id
PUT    /api/properties/:id
DELETE /api/properties/:id
GET    /api/properties/owner/:userId
```

**Base de données :** MongoDB (Collection: properties)

**Dépendances :**
- Mongoose
- Express
- Auth Service (validation)

**Pourquoi séparé ?**
- Logique métier spécifique aux biens
- Peut avoir sa propre stratégie de cache
- Scalable indépendamment (beaucoup de lectures)

---

## 3. Tenant Service (Service des Locataires)

**Responsabilités :**
- CRUD des locataires
- Association avec les propriétés
- Gestion des informations de contact
- Historique des locataires

**API Endpoints :**
```
GET    /api/tenants
POST   /api/tenants
GET    /api/tenants/:id
PUT    /api/tenants/:id
DELETE /api/tenants/:id
GET    /api/tenants/property/:propertyId
```

**Base de données :** MongoDB (Collection: tenants)

**Dépendances :**
- Mongoose
- Express
- Auth Service
- Property Service (validation)

**Pourquoi séparé ?**
- Logique métier distincte des propriétés
- Peut évoluer avec des fonctionnalités avancées (scoring, background checks)

---

## 4. Payment Service (Service des Paiements) ⭐ Cœur du Système

**Responsabilités :**
- CRUD des paiements
- Gestion des statuts (payé, impayé, partiel)
- Upload des preuves de paiement (photos MoMo)
- Historique des paiements
- Calcul des totaux

**API Endpoints :**
```
GET    /api/payments
POST   /api/payments
GET    /api/payments/:id
PUT    /api/payments/:id
DELETE /api/payments/:id
GET    /api/payments/tenant/:tenantId
GET    /api/payments/property/:propertyId
POST   /api/payments/:id/upload-proof
GET    /api/payments/month/:month
```

**Base de données :** MongoDB (Collection: payments)

**Dépendances :**
- Mongoose
- Express
- Multer (upload fichiers)
- Auth Service
- Tenant Service (validation)

**Pourquoi séparé ?**
- Cœur du système (critique)
- Beaucoup d'écritures
- Logique complexe (statuts, preuves)
- Peut nécessiter une forte scalabilité

---

## 5. Stats Service (Service de Statistiques)

**Responsabilités :**
- Calcul des statistiques dashboard
- Total encaissé du mois
- Nombre d'impayés
- Taux de remplissage
- Graphiques et tendances
- Agrégation de données

**API Endpoints :**
```
GET /api/stats/dashboard
GET /api/stats/total-collected
GET /api/stats/unpaid-count
GET /api/stats/occupancy-rate
GET /api/stats/monthly-trend
```

**Base de données :** MongoDB (Collections: payments, properties, tenants)

**Dépendances :**
- Mongoose
- Express
- Payment Service (données)
- Property Service (données)
- Tenant Service (données)

**Pourquoi séparé ?**
- Opérations d'agrégation lourdes
- Peut utiliser du cache (Redis)
- Ne pas impacter les services critiques
- Peut évoluer avec des analytics avancés

---

## 6. Subscription Service (Service d'Abonnement)

**Responsabilités :**
- Gestion des plans (gratuit, pro)
- Intégration Campay API
- Mise à jour du plan utilisateur
- Gestion des renouvellements
- Historique des abonnements

**API Endpoints :**
```
POST   /api/subscription/upgrade
GET    /api/subscription/plan
GET    /api/subscription/history
POST   /api/subscription/campay-webhook
GET    /api/subscription/check-limit
```

**Base de données :** MongoDB (Collection: subscriptions)

**Dépendances :**
- Mongoose
- Express
- Campay SDK
- Auth Service

**Pourquoi séparé ?**
- Intégration externe (Campay)
- Logique métier spécifique (billing)
- Peut évoluer avec d'autres payment gateways
- Critique pour les revenus

---

## Service Optionnel : Scheduler Service

**Responsabilités :**
- Exécution du CRON (1er du mois)
- Création automatique des paiements
- Notifications de rappel
- Nettoyage de données

**API Endpoints :**
```
POST /api/scheduler/trigger-monthly-payments
POST /api/scheduler/send-reminders
POST /api/scheduler/cleanup-old-data
```

**Dépendances :**
- node-cron
- Payment Service
- Notification Service (optionnel)

**Pourquoi séparé ?**
- Tâches asynchrones
- Peut être déployé sur worker séparé
- Ne pas impacter les services API

---

## Architecture Globale

```
                    ┌─────────────────┐
                    │   Client React  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │  (Nginx/Kong)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌──────▼──────┐
│  Auth Service  │  │ Payment Service │  │Stats Service│
│  :5001         │  │  :5003          │  │   :5005     │
└────────────────┘  └─────────────────┘  └─────────────┘
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌─────────────┐
│Property Service│  │Tenant Service   │  │Subscription │
│  :5002         │  │  :5004          │  │  Service    │
└────────────────┘  └─────────────────┘  │   :5006     │
                                            └─────────────┘
```

## Communication Entre Services

**Pattern : REST API + HTTP**

Chaque service expose des API REST. Les services communiquent via HTTP.

**Exemple :**
- Payment Service appelle Tenant Service pour valider qu'un locataire existe
- Stats Service appelle Payment Service pour récupérer les données
- Subscription Service appelle Auth Service pour mettre à jour le plan

**Alternative : Message Queue (RabbitMQ/Redis)**

Pour les opérations asynchrones :
- Scheduler → Payment Service (création paiements mensuels)
- Payment Service → Notification Service (notifications)

---

## Base de Données

**Approche : Database per Service**

Chaque service a sa propre base de données MongoDB :
- auth_db (users)
- property_db (properties)
- tenant_db (tenants)
- payment_db (payments)
- subscription_db (subscriptions)

**Avantages :**
- Indépendance des services
- Scalabilité individuelle
- Pas de lock au niveau DB

**Inconvénients :**
- Pas de transactions ACID entre services
- Besoin de patterns de compensation (Saga)

---

## Déploiement sur Render

**Chaque service = 1 Web Service Render**

```
bailleur-pro-auth-service          (Port 5001)
bailleur-pro-property-service      (Port 5002)
bailleur-pro-payment-service       (Port 5003)
bailleur-pro-tenant-service        (Port 5004)
bailleur-pro-stats-service         (Port 5005)
bailleur-pro-subscription-service  (Port 5006)
bailleur-pro-scheduler-service     (Port 5007 - Worker)
bailleur-pro-client                (Static Site)
```

**API Gateway :**
- Peut être un simple Nginx sur Render
- Ou utiliser Kong (plus complexe)
- Ou router directement depuis le frontend

---

## Avantages de cette Architecture

**1. Scalabilité Indépendante**
- Payment Service peut scalé indépendamment (beaucoup d'écritures)
- Stats Service peut avoir plus de ressources (agrégations lourdes)

**2. Résilience**
- Si Stats Service tombe, les autres services continuent
- Isolation des pannes

**3. Développement Parallèle**
- Équipes peuvent travailler sur différents services
- Déploiements indépendants

**4. Flexibilité Technologique**
- Chaque service peut utiliser des technologies différentes
- Stats Service pourrait utiliser Python + Pandas

**5. Maintenance**
- Codebase plus petite par service
- Plus facile à comprendre et maintenir

---

## Inconvénients et Mitigations

**1. Complexité Opérationnelle**
- **Mitigation :** Utiliser Docker pour standardiser le déploiement
- **Mitigation :** Monitoring centralisé (logs, métriques)

**2. Latence Réseau**
- **Mitigation :** Cache (Redis) pour les données fréquemment accédées
- **Mitigation :** Services co-localisés sur Render

**3. Gestion des Transactions**
- **Mitigation :** Pattern Saga pour les transactions distribuées
- **Mitigation :** Idempotency des opérations

**4. Développement Initial Plus Long**
- **Mitigation :** Commencer avec 3-4 services, ajouter les autres progressivement
- **Mitigation :** Boilerplates et templates

---

## Recommandation pour le Jury

**Approche Progressive :**

**Phase 1 (MVP) : 3 Services**
1. Auth Service
2. Property Service
3. Payment Service (inclut Tenant et Stats)

**Phase 2 (Croissance) : 5 Services**
1. Auth Service
2. Property Service
3. Tenant Service
4. Payment Service
5. Stats Service

**Phase 3 (Production) : 6 Services**
1. Auth Service
2. Property Service
3. Tenant Service
4. Payment Service
5. Stats Service
6. Subscription Service

**Pour le Jury :**
- Commencer avec 6 services pour montrer l'architecture
- Expliquer l'approche progressive
- Démontrer la scalabilité
- Montrer la résilience (tester en arrêtant un service)

---

## Structure des Repositories

**Option 1 : Monorepo avec Multi-Services**
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
└── docker-compose.yml
```

**Option 2 : Multi-Repos**
```
bailleur-pro-auth-service
bailleur-pro-property-service
bailleur-pro-tenant-service
bailleur-pro-payment-service
bailleur-pro-stats-service
bailleur-pro-subscription-service
bailleur-pro-client
```

**Recommandation :** Monorepo pour simplifier le développement initial
