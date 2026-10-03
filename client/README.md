# Client Bailleur Pro - Frontend React

Frontend React pour Bailleur Pro - SaaS de Gestion Immobilière.

## Technologies

- **React 18** - Framework JavaScript
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Routage
- **Axios** - Client HTTP

## Structure du Projet

```
client/
├── src/
│   ├── pages/
│   │   └── LandingPage.jsx    # Page d'accueil
│   ├── App.jsx                # Composant principal
│   ├── main.jsx               # Point d'entrée
│   └── index.css              # Styles globaux + Tailwind
├── index.html                 # Template HTML
├── package.json               # Dépendances
├── vite.config.js             # Configuration Vite
├── tailwind.config.js         # Configuration Tailwind
└── postcss.config.js          # Configuration PostCSS
```

## Installation

```bash
cd client
npm install
```

## Démarrage

**Mode développement :**
```bash
npm run dev
```

Le serveur sera disponible sur `http://localhost:3000`

**Build pour production :**
```bash
npm run build
```

**Preview du build :**
```bash
npm run preview
```

## Landing Page

La page d'accueil comprend :

### Sections

1. **Navigation** - Menu responsive avec liens vers les sections
2. **Hero** - Section d'accroche avec statistiques
3. **Fonctionnalités** - 6 fonctionnalités clés avec icônes
4. **Tarifs** - 2 plans (Gratuit et Pro)
5. **À propos** - Pourquoi choisir Bailleur Pro
6. **CTA** - Appel à l'action
7. **Footer** - Liens et informations légales

### Design

- **Couleurs** : Palette bleue (primary) et grise
- **Typographie** : Inter (Google Fonts)
- **Responsive** : Mobile-first design
- **Animations** : Transitions douces sur hover
- **Composants** : Boutons, cartes avec styles personnalisés

### Fonctionnalités

- Menu mobile responsive
- Navigation smooth scroll
- Boutons d'action (CTA)
- Statistiques et chiffres clés
- Grille de fonctionnalités
- Tableau de prix avec badge "Populaire"
- Section CTA avec gradient

## Personnalisation

### Couleurs

Modifier `tailwind.config.js` pour changer les couleurs :

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Vos couleurs personnalisées
      }
    }
  }
}
```

### Contenu

Modifier `src/pages/LandingPage.jsx` pour changer le texte et les sections.

## Prochaines Étapes

1. Créer les pages d'authentification (Login/Register)
2. Créer le Dashboard
3. Créer les pages de gestion (Biens, Locataires, Paiements)
4. Intégrer avec les microservices backend
5. Ajouter les graphiques avec Chart.js
6. Implémenter le routing avec React Router

## Déploiement

Le frontend sera déployé sur Render Static Site.

Configuration :
- Build Command : `npm run build`
- Publish Directory : `dist`
