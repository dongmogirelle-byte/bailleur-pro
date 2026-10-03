# Diagrammes UML - Bailleur Pro

Ce dossier contient tous les diagrammes UML du projet Bailleur Pro créés avec Mermaid.

## Liste des diagrammes

1. **cas_utilisation.mmd** - Diagramme de cas d'utilisation
   - Acteurs : Bailleur, Locataire, Administrateur
   - Cas d'utilisation pour l'inscription, la connexion, la gestion des propriétés, des locataires et des paiements

2. **classes.mmd** - Diagramme de classes
   - Classes principales : Utilisateur, Propriete, Locataire, Paiement, Contrat, Notification
   - Relations entre les classes
   - Attributs et méthodes de chaque classe

3. **activite_inscription.mmd** - Diagramme d'activité - Inscription
   - Flux d'inscription d'un utilisateur
   - Validation des données
   - Confirmation par email

4. **activite_ajout_propriete.mmd** - Diagramme d'activité - Ajout de propriété
   - Flux d'ajout d'une propriété par un bailleur
   - Upload de photos
   - Validation et création

5. **activite_paiement.mmd** - Diagramme d'activité - Enregistrement de paiement
   - Flux d'enregistrement d'un paiement
   - Upload de preuve de paiement
   - Notification au locataire

6. **sequence_authentification.mmd** - Diagramme de séquence - Authentification
   - Flux de connexion utilisateur
   - Vérification des identifiants
   - Génération du token JWT

7. **sequence_creation_propriete.mmd** - Diagramme de séquence - Création de propriété
   - Interaction entre bailleur, interface et service
   - Validation et création en base de données

8. **sequence_enregistrement_paiement.mmd** - Diagramme de séquence - Enregistrement de paiement
   - Interaction entre bailleur, interface et services
   - Notification au locataire

## Comment visualiser les diagrammes

### Option 1 : Mermaid Live Editor (Recommandé)

1. Allez sur https://mermaid.live/
2. Cliquez sur "Open Diagram"
3. Sélectionnez le fichier .mmd que vous voulez visualiser
4. Le diagramme s'affichera automatiquement
5. Vous pouvez exporter en PNG ou SVG

### Option 2 : VS Code avec extension Mermaid

1. Installez l'extension "Mermaid Preview" dans VS Code
2. Ouvrez un fichier .mmd
3. Cliquez sur "Preview" pour voir le diagramme

### Option 3 : Visual Studio Code

1. Installez l'extension "Mermaid Markdown Syntax Highlighting"
2. Ouvrez un fichier .mmd
3. Utilisez la commande "Mermaid: Open Preview"

### Option 4 : En ligne de commande

Si vous avez Mermaid CLI installé :
```bash
mmdc -i cas_utilisation.mmd -o cas_utilisation.png
```

## Exporter les diagrammes en images

Une fois visualisés sur Mermaid Live Editor :
1. Cliquez sur le bouton "Export"
2. Choisissez le format (PNG ou SVG)
3. Téléchargez l'image

## Structure des diagrammes

Tous les diagrammes respectent les normes UML :
- Flèches claires et directionnelles
- Participants bien identifiés
- Conditions (alt) pour les cas alternatifs
- Boucles pour les répétitions
- Relations entre classes avec cardinalités

## Notes

- Les diagrammes sont écrits en syntaxe Mermaid
- Mermaid est un langage de diagrammes simple et lisible
- Tous les diagrammes peuvent être modifiés facilement
- La syntaxe est compatible avec les outils de documentation modernes
