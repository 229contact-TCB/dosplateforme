# Structure de la Plateforme Proforma

## Vue d'ensemble

Application web complète de gestion de factures proforma avec React, TypeScript, Tailwind CSS et Supabase.

## Architecture des fichiers

```
project/
│
├── public/                          # Fichiers statiques
│
├── src/                             # Code source principal
│   ├── components/                  # Composants réutilisables
│   │   ├── Header.tsx              # En-tête des pages avec titre
│   │   └── MobileNav.tsx           # Navigation mobile fixe en bas
│   │
│   ├── pages/                       # Pages de l'application
│   │   ├── Dashboard.tsx           # Tableau de bord avec stats et actions
│   │   ├── Clients.tsx             # Gestion CRUD des clients
│   │   ├── Articles.tsx            # Gestion CRUD des articles
│   │   ├── NewProforma.tsx         # Création/modification de proforma
│   │   ├── Proformas.tsx           # Liste et historique des proformas
│   │   └── Settings.tsx            # Paramètres de l'entreprise
│   │
│   ├── lib/                         # Bibliothèques et configurations
│   │   └── supabase.ts             # Client Supabase + types TypeScript
│   │
│   ├── utils/                       # Utilitaires
│   │   └── pdfGenerator.ts         # Générateur de PDF professionnels
│   │
│   ├── App.tsx                      # Composant racine avec routage
│   ├── main.tsx                     # Point d'entrée de l'application
│   ├── index.css                    # Styles globaux Tailwind
│   └── vite-env.d.ts               # Types pour Vite
│
├── database-schema.sql              # Schéma SQL complet de la base
├── README.md                        # Documentation complète
├── INSTALLATION.md                  # Guide d'installation étape par étape
├── STRUCTURE.md                     # Ce fichier - architecture du projet
│
├── package.json                     # Dépendances et scripts npm
├── tsconfig.json                    # Configuration TypeScript
├── tailwind.config.js              # Configuration Tailwind CSS
├── vite.config.ts                  # Configuration Vite
└── .env                            # Variables d'environnement Supabase

```

## Composants détaillés

### 1. Components (src/components/)

#### Header.tsx
- En-tête commun à toutes les pages
- Affiche le titre de la page actuelle
- Couleur de fond : #012B59 (bleu entreprise)
- Props : `title: string`

#### MobileNav.tsx
- Navigation fixe en bas de l'écran
- 4 onglets : Accueil, Clients, Factures, Paramètres
- Icônes avec Lucide React
- Indicateur visuel de l'onglet actif
- Props : `currentPage: string`, `onNavigate: function`

### 2. Pages (src/pages/)

#### Dashboard.tsx
**Statistiques affichées :**
- Nombre total de clients
- Nombre total de proformas
- Montant total estimé (somme de toutes les proformas)

**Actions rapides (4 boutons colorés) :**
1. Voir clients (bleu) → Navigation vers page Clients
2. Nouvelle facture (rouge) → Navigation vers création proforma
3. Historique des factures (jaune) → Navigation vers liste proformas
4. Ajouter un client (vert) → Navigation vers Clients avec modal ouvert

#### Clients.tsx
**Fonctionnalités :**
- Liste de tous les clients
- Bouton "Ajouter un client" en haut
- Pour chaque client : affichage des infos + boutons Modifier/Supprimer
- Modal pour ajouter/modifier avec formulaire :
  - Nom ou entreprise (requis)
  - Téléphone
  - Email
  - Adresse

**États :**
- Liste des clients
- Modal ouvert/fermé
- Client en cours d'édition
- Données du formulaire

#### Articles.tsx
**Fonctionnalités :**
- Liste de tous les articles du catalogue
- Bouton "Ajouter un article" en haut
- Pour chaque article : désignation + prix + boutons Modifier/Supprimer
- Modal pour ajouter/modifier avec formulaire :
  - Désignation (requis)
  - Prix unitaire en FCFA (requis)

**Usage :**
- Permet de créer un catalogue pour accélérer la saisie des factures
- Articles réutilisables dans NewProforma

#### NewProforma.tsx
**Section A - Informations générales :**
- Numéro de facture (auto-généré ou modifiable)
- Date (par défaut = aujourd'hui)
- Sélection du client avec option "Ajouter nouveau"

**Section B - Articles :**
- Tableau dynamique avec lignes d'articles
- Pour chaque ligne :
  - Sélection rapide depuis le catalogue (optionnel)
  - Désignation (texte libre requis)
  - Quantité (nombre)
  - Prix unitaire (nombre)
  - Type de réduction : Aucune / Pourcentage / Montant
  - Valeur de réduction (si applicable)
  - Montant calculé automatiquement
- Boutons : Ajouter ligne / Supprimer ligne

**Section C - Options :**
- Checkbox TVA 18% (calcul automatique si cochée)
- Conditions de paiement (texte libre)

**Section D - Totaux :**
- Montant total (somme des lignes)
- TVA (si cochée)
- Montant TTC

**Actions :**
- Bouton "Annuler" → Retour à la liste
- Bouton "Enregistrer" → Sauvegarde en base
- Bouton "Télécharger PDF" → Génération et téléchargement

**Mode édition :**
- Même interface avec données pré-remplies
- Possibilité de modifier et ré-enregistrer

#### Proformas.tsx
**Affichage :**
- Liste de toutes les proformas (ordre anti-chronologique)
- Pour chaque proforma :
  - Numéro de facture
  - Nom du client
  - Date
  - Montant total TTC
  - Boutons : Modifier / Télécharger PDF

**Fonctionnalités :**
- Modifier → Navigation vers NewProforma en mode édition
- Télécharger PDF → Charge les données et génère le PDF

#### Settings.tsx
**Formulaire complet :**
1. Nom de l'entreprise
2. Activité (textarea)
3. Téléphones
4. N° CIP
5. Date d'expiration CIP
6. N° IFU
7. Email
8. RCCM (optionnel)
9. Nom du responsable (optionnel)
10. URL QR Code WhatsApp

**Valeurs par défaut :**
- Toutes les infos de GBEFFA REIS BE KOM pré-remplies
- Modification possible à tout moment
- Sauvegarde en base pour utilisation dans les PDF

### 3. Utilitaires (src/utils/)

#### pdfGenerator.ts
**Fonction principale : `generateProformaPDF(data)`**

**Paramètres :**
- company: Informations de l'entreprise
- client: Informations du client
- invoiceNumber: Numéro de facture
- date: Date de la facture
- items: Tableau des articles
- subtotal, taxAmount, total: Montants calculés
- paymentTerms: Conditions de paiement

**Processus :**
1. Génération du QR Code via API externe
2. Construction du HTML avec CSS inline
3. Formatage des dates en français
4. Tableau professionnel des articles
5. Calculs des totaux avec mise en évidence
6. Footer avec signature et crédit développeur
7. Ouverture dans une nouvelle fenêtre
8. Déclenchement de l'impression

**Design du PDF :**
- En-tête bleu #012B59 avec infos entreprise
- Section client à gauche, QR Code + infos facture à droite
- Tableau avec colonnes : NO, DESIGNATION, QUANTITÉ, PRIX, MONTANT
- Lignes alternées (gris/blanc) pour lisibilité
- Zone totaux avec fond bleu pour le TTC
- Conditions de paiement
- Message de remerciement en italique
- Footer avec nom et activité de l'entreprise
- Crédit développeur : "PLATEFORME DÉVELOPPÉE PAR RENATO TCHOBO"

### 4. Librairies (src/lib/)

#### supabase.ts
**Configuration :**
- Création du client Supabase avec URL et clé anonyme
- Exports des types TypeScript pour toutes les entités

**Types définis :**
- `CompanySettings` : Paramètres entreprise
- `Client` : Informations client
- `Article` : Article du catalogue
- `ProformaItem` : Ligne d'article dans une facture
- `Proforma` : En-tête de facture

**Utilisation :**
```typescript
import { supabase } from '../lib/supabase';

// Récupérer des données
const { data } = await supabase.from('clients').select('*');

// Insérer
await supabase.from('clients').insert([{ name: 'Client' }]);

// Modifier
await supabase.from('clients').update({ name: 'Nouveau nom' }).eq('id', id);

// Supprimer
await supabase.from('clients').delete().eq('id', id);
```

## Base de données (Supabase/PostgreSQL)

### Tables

#### company_settings
- Stocke les informations de l'entreprise
- Une seule ligne (singleton)
- Tous les champs ont des valeurs par défaut
- Modifiable via page Settings

#### clients
- Stocke les clients de l'entreprise
- Champs : id, name, phone, email, address, created_at, updated_at
- Relations : référencé par proformas

#### articles
- Catalogue des articles/services
- Champs : id, designation, unit_price, created_at, updated_at
- Usage : sélection rapide dans NewProforma

#### proformas
- En-têtes des factures proforma
- Champs : id, invoice_number (unique), client_id, client_name, date, subtotal, tax_rate, tax_amount, total, payment_terms, created_at, updated_at
- Relations : client_id → clients, id → proforma_items

#### proforma_items
- Lignes d'articles des factures
- Champs : id, proforma_id, designation, quantity, unit_price, discount_type, discount_value, amount, created_at
- Relations : proforma_id → proformas (cascade delete)

### Sécurité (RLS)
- Row Level Security activé sur toutes les tables
- Politiques configurées pour autoriser toutes les opérations
- Pas d'authentification requise (app interne)

## Navigation et flux utilisateur

### Navigation principale (MobileNav)
```
Accueil → Dashboard
Clients → Clients
Factures → Proformas
Paramètres → Settings
```

### Flux de création de proforma
```
Dashboard
  ↓ Clic "Nouvelle facture"
NewProforma
  ↓ Saisie des infos
  ↓ Clic "Enregistrer"
Base de données
  ↓ Retour automatique
Proformas (liste)
```

### Flux de génération PDF
```
Proformas (liste)
  ↓ Clic "PDF"
Chargement des données (company + client + items)
  ↓
Génération HTML
  ↓
Ouverture nouvelle fenêtre
  ↓
Impression/Téléchargement
```

## Styles et thème

### Couleur principale
- **#012B59** (bleu foncé)
- Utilisée pour : headers, boutons principaux, textes importants, fonds de tableaux PDF

### Palette de couleurs des actions rapides
- Bleu (#3B82F6) : Consulter
- Rouge (#EF4444) : Créer
- Jaune (#F59E0B) : Historique
- Vert (#10B981) : Ajouter

### Responsive
- Design mobile-first
- Navigation mobile en bas
- Cartes et sections empilées verticalement
- Grilles adaptatives (1 ou 2 colonnes selon l'espace)

## Scripts npm disponibles

```bash
npm run dev        # Lancer le serveur de développement
npm run build      # Compiler pour la production
npm run preview    # Prévisualiser le build de production
npm run lint       # Linter le code
npm run typecheck  # Vérifier les types TypeScript
```

## Variables d'environnement

```env
VITE_SUPABASE_URL=<url_du_projet_supabase>
VITE_SUPABASE_ANON_KEY=<clé_publique_supabase>
```

## Dépendances principales

### Production
- `react` v18.3.1 - Framework UI
- `react-dom` v18.3.1 - Rendu DOM
- `@supabase/supabase-js` v2.57.4 - Client Supabase
- `lucide-react` v0.344.0 - Icônes

### Développement
- `vite` v5.4.2 - Build tool
- `typescript` v5.5.3 - Langage
- `tailwindcss` v3.4.1 - Framework CSS
- `eslint` v9.9.1 - Linter

## Développeur

**RENATO TCHOBO**

Cette plateforme a été conçue et développée pour offrir une solution complète et professionnelle de gestion de factures proforma.
