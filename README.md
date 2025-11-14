# Plateforme de Génération de Proforma

Une application web complète pour la génération, l'enregistrement, la gestion et le téléchargement en PDF de factures proforma professionnelles.

## Présentation

Cette plateforme permet aux entreprises de gérer facilement leurs clients, articles, et de générer des factures proforma professionnelles avec calcul automatique des totaux, gestion de la TVA, et export PDF.

## Fonctionnalités principales

### 1. Tableau de bord
- Vue d'ensemble des statistiques (nombre de clients, proformas, montant total)
- Actions rapides pour accéder aux fonctionnalités principales
- Navigation intuitive

### 2. Gestion des clients
- Ajouter, modifier et supprimer des clients
- Enregistrer : nom/entreprise, téléphone, email, adresse
- Sélection rapide lors de la création de facture

### 3. Gestion des articles
- Créer un catalogue d'articles/services
- Enregistrer : désignation et prix unitaire
- Utilisation rapide lors de la création de facture

### 4. Création de proforma
- Sélection du client
- Ajout de plusieurs lignes d'articles avec :
  - Désignation (manuelle ou depuis le catalogue)
  - Quantité
  - Prix unitaire
  - Réduction (en pourcentage ou montant fixe)
  - Calcul automatique du montant
- Option TVA 18%
- Conditions de paiement personnalisables
- Aperçu des totaux en temps réel

### 5. Historique des proformas
- Liste complète des factures générées
- Recherche et consultation
- Modification des factures existantes
- Téléchargement PDF

### 6. Paramètres entreprise
- Configuration des informations de l'entreprise :
  - Nom et activité
  - Coordonnées (téléphones, email)
  - Numéros légaux (CIP, IFU, RCCM)
  - Nom du responsable
  - QR Code WhatsApp

### 7. Export PDF professionnel
- Design professionnel aux couleurs de l'entreprise (#012B59)
- En-tête avec informations complètes
- QR Code pour contact WhatsApp
- Tableau détaillé des articles
- Calculs avec TVA
- Conditions de paiement
- Footer personnalisé avec crédit développeur

## Technologies utilisées

### Frontend
- **React** - Framework UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne et responsive
- **Lucide React** - Icônes

### Backend & Base de données
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de données relationnelle

### Autres
- **Vite** - Build tool et dev server
- **QR Server API** - Génération de QR codes

## Structure du projet

```
/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # En-tête des pages
│   │   └── MobileNav.tsx       # Navigation mobile en bas
│   ├── pages/
│   │   ├── Dashboard.tsx       # Tableau de bord
│   │   ├── Clients.tsx         # Gestion des clients
│   │   ├── Articles.tsx        # Gestion des articles
│   │   ├── NewProforma.tsx     # Création/modification de proforma
│   │   ├── Proformas.tsx       # Historique des proformas
│   │   └── Settings.tsx        # Paramètres entreprise
│   ├── utils/
│   │   └── pdfGenerator.ts     # Génération des PDF
│   ├── lib/
│   │   └── supabase.ts         # Configuration Supabase
│   ├── App.tsx                 # Composant principal
│   └── main.tsx                # Point d'entrée
├── database-schema.sql         # Schéma de la base de données
└── package.json
```

## Installation et configuration

### Prérequis
- Node.js (version 16 ou supérieure)
- Compte Supabase

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd project
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Supabase**

   a. Créer un projet sur [Supabase](https://supabase.com)

   b. Exécuter le script SQL dans l'éditeur SQL de Supabase :
   ```bash
   # Copier le contenu de database-schema.sql
   # Le coller dans l'éditeur SQL de Supabase
   # Exécuter le script
   ```

   c. Le fichier `.env` est déjà configuré avec vos identifiants Supabase

4. **Lancer l'application**
   ```bash
   npm run dev
   ```

5. **Compiler pour la production**
   ```bash
   npm run build
   ```

## Schéma de la base de données

### Tables principales

#### `company_settings`
Stocke les informations de l'entreprise (une seule ligne)
- Configuration complète de l'entreprise
- Données pré-remplies par défaut

#### `clients`
Gestion des clients
- Nom/entreprise
- Coordonnées complètes

#### `articles`
Catalogue des articles/services
- Désignation
- Prix unitaire

#### `proformas`
Factures proforma
- Numéro de facture
- Client associé
- Date
- Montants (sous-total, TVA, total)
- Conditions de paiement

#### `proforma_items`
Lignes d'articles des proformas
- Désignation
- Quantité
- Prix unitaire
- Réduction
- Montant calculé

### Sécurité
- Row Level Security (RLS) activé sur toutes les tables
- Politiques configurées pour autoriser toutes les opérations (app interne)

## Utilisation

### 1. Configuration initiale
- Aller dans "Paramètres" pour vérifier/modifier les informations de l'entreprise
- Les données par défaut sont déjà présentes (GBEFFA REIS BE KOM)

### 2. Ajouter des clients
- Aller dans "Clients"
- Cliquer sur "Ajouter un client"
- Remplir les informations
- Enregistrer

### 3. Ajouter des articles (optionnel)
- Aller dans "Articles" (via le menu ou directement)
- Créer des articles pour accélérer la saisie des factures

### 4. Créer une proforma
- Depuis le tableau de bord, cliquer sur "Nouvelle facture"
- Sélectionner un client (ou en créer un nouveau)
- Ajouter des lignes d'articles
- Configurer la TVA si nécessaire
- Saisir les conditions de paiement
- Enregistrer et/ou télécharger le PDF

### 5. Consulter l'historique
- Aller dans "Factures"
- Voir toutes les proformas créées
- Modifier ou télécharger en PDF

## Format PDF

Le PDF généré respecte le design professionnel avec :
- Bandeau supérieur bleu (#012B59) avec informations entreprise
- Section client avec QR Code
- Tableau des articles professionnel
- Totaux mis en évidence
- Footer avec signature et mention développeur

## Personnalisation

### Couleurs
La couleur principale (#012B59) est utilisée dans :
- Header de l'application
- Boutons principaux
- Tableau des PDF
- Accents visuels

### Footer développeur
Mention obligatoire dans chaque PDF :
**"PLATEFORME DÉVELOPPÉE PAR RENATO TCHOBO"**

## Support et développement

Cette plateforme a été développée pour faciliter la gestion des factures proforma avec un design professionnel et une expérience utilisateur optimale.

### Développeur
**RENATO TCHOBO**

## Licence

Propriétaire - Tous droits réservés
