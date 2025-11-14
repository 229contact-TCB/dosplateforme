# Fonctionnalités de la Plateforme Proforma

## Vue d'ensemble

Application web complète pour la gestion professionnelle de factures proforma avec design moderne, interface intuitive et génération PDF automatique.

## Fonctionnalités principales

### 📊 Tableau de bord intelligent

**Statistiques en temps réel :**
- Nombre total de clients enregistrés
- Nombre total de proformas créées
- Montant total cumulé de toutes les factures

**Actions rapides visuelles :**
- 4 boutons colorés pour accès direct aux fonctions principales
- Navigation optimisée pour un flux de travail efficace

### 👥 Gestion complète des clients

**CRUD complet :**
- Créer de nouveaux clients
- Modifier les informations existantes
- Supprimer les clients (avec confirmation)
- Visualiser la liste complète

**Informations stockées :**
- Nom ou raison sociale de l'entreprise
- Numéro de téléphone
- Adresse email
- Adresse complète

**Interface intuitive :**
- Modal élégant pour ajout/modification
- Liste claire avec toutes les informations
- Boutons d'action visibles et accessibles

### 📦 Catalogue d'articles

**Gestion des produits/services :**
- Créer des articles réutilisables
- Définir désignation et prix unitaire
- Modifier les prix facilement
- Supprimer les articles obsolètes

**Avantages :**
- Saisie accélérée lors de création de factures
- Cohérence des prix
- Historique des articles vendus

### 📄 Création de proforma avancée

**Informations de facture :**
- Numéro de facture auto-généré ou personnalisable
- Date modifiable (par défaut = aujourd'hui)
- Sélection du client dans la liste
- Option pour créer un nouveau client à la volée

**Gestion des articles :**
- Ajout dynamique de lignes d'articles
- Sélection rapide depuis le catalogue
- Saisie manuelle possible
- Champs pour chaque ligne :
  - Désignation (texte libre)
  - Quantité (décimales autorisées)
  - Prix unitaire
  - Type de réduction (aucune, pourcentage, montant)
  - Valeur de réduction
  - Montant calculé automatiquement

**Calculs automatiques :**
- Sous-total des articles
- Application de réductions par ligne
- Calcul de la TVA 18% (optionnel)
- Total TTC final
- Mise à jour en temps réel

**Options avancées :**
- Checkbox TVA avec calcul automatique
- Zone de texte pour conditions de paiement personnalisées
- Aperçu des totaux en continu

**Actions disponibles :**
- Enregistrer en base de données
- Générer et télécharger le PDF
- Annuler et revenir à la liste

### 📋 Historique et gestion des factures

**Vue d'ensemble :**
- Liste de toutes les proformas créées
- Tri par date décroissante (plus récent en premier)
- Affichage des informations clés :
  - Numéro de facture
  - Nom du client
  - Date de création
  - Montant total TTC

**Actions par facture :**
- Modifier la facture (édition complète)
- Télécharger le PDF à nouveau
- Consultation rapide

**Fonctionnalités :**
- Conservation de l'historique complet
- Possibilité de régénérer les PDF
- Modification post-création

### 📑 Génération PDF professionnelle

**Design professionnel :**
- Bandeau supérieur couleur entreprise (#012B59)
- Logo et informations entreprise bien visibles
- QR Code WhatsApp pour contact rapide
- Tableau structuré et lisible
- Mise en page professionnelle

**Contenu du PDF :**

**En-tête (fond bleu #012B59) :**
- Nom de l'entreprise en grand
- Activité commerciale
- Téléphones
- N° CIP avec date d'expiration
- N° IFU
- Email
- RCCM (si renseigné)
- Titre "FACTURE PRO FORMA" bien visible

**Section client :**
- Label "Le Client"
- Nom du client en gras
- Coordonnées complètes
- QR Code à droite pour contact WhatsApp
- Numéro de facture et date formatée

**Tableau des articles :**
- Colonnes : NO, DESIGNATION, QUANTITÉ, PRIX, MONTANT
- En-têtes avec fond bleu
- Lignes alternées (blanc/gris) pour lisibilité
- Montants formatés avec espaces (ex: 120 000 FCFA)

**Section totaux :**
- Montant total des articles
- TVA 18% (si applicable) : 0 FCFA par défaut
- **Montant TTC en grand avec fond bleu**

**Conditions de paiement :**
- Titre "CONDITION ET METHODE DE PAIEMENT"
- Texte personnalisable
- Par défaut : "Paiement à la livraison"

**Footer :**
- Espace pour signature du responsable
- Nom de l'entreprise
- Activité
- Message "Thank you for your business with us!"
- **Crédit obligatoire : "PLATEFORME DÉVELOPPÉE PAR RENATO TCHOBO"**

**Technologie :**
- Génération HTML/CSS dynamique
- Ouverture dans nouvelle fenêtre
- Fonction d'impression native du navigateur
- Possibilité de sauvegarder en PDF

### ⚙️ Paramètres entreprise

**Configuration complète :**
- Nom de l'entreprise
- Activité commerciale (texte long)
- Numéros de téléphone
- Numéro CIP
- Date d'expiration CIP
- Numéro IFU
- Adresse email
- RCCM (optionnel)
- Nom du responsable (optionnel)
- URL du QR Code WhatsApp

**Données par défaut :**
- Toutes les informations de GBEFFA REIS BE KOM pré-remplies
- Modifiables à tout moment
- Utilisées automatiquement dans tous les PDF

**Utilisation :**
- Accès rapide depuis la navigation
- Sauvegarde instantanée
- Application immédiate aux nouvelles factures

## Fonctionnalités techniques

### 🎨 Interface utilisateur

**Design moderne :**
- Interface épurée et professionnelle
- Couleur principale : #012B59 (bleu entreprise)
- Palette de couleurs cohérente
- Icônes Lucide React

**Responsive :**
- Optimisé pour mobile et tablette
- Navigation fixe en bas sur mobile
- Cartes et sections empilées
- Grilles adaptatives

**Expérience utilisateur :**
- Formulaires clairs et intuitifs
- Validation en temps réel
- Messages de confirmation
- Feedback visuel sur les actions

### 💾 Gestion des données

**Base de données Supabase :**
- PostgreSQL hébergé dans le cloud
- 5 tables relationnelles
- Contraintes d'intégrité
- Indexes optimisés

**Sécurité :**
- Row Level Security (RLS) activé
- Politiques d'accès configurées
- Pas de données sensibles exposées

**Performance :**
- Requêtes optimisées
- Chargement rapide
- Mise à jour en temps réel

### 🔄 Navigation fluide

**Système de routing :**
- Navigation par état (sans rechargement)
- Passage de données entre pages
- Retour arrière intelligent
- État conservé

**Navigation mobile :**
- 4 onglets principaux en bas
- Indicateur visuel de la page active
- Icônes intuitives
- Accès rapide depuis n'importe où

### 📊 Calculs automatiques

**En temps réel :**
- Montant de chaque ligne d'article
- Application des réductions
- Sous-total général
- TVA calculée automatiquement
- Total TTC final

**Types de réductions :**
- Aucune réduction
- Réduction en pourcentage (%)
- Réduction en montant fixe (FCFA)

**Précision :**
- Calculs avec décimales
- Arrondis corrects
- Formatage avec espaces

## Avantages de la plateforme

### ✅ Pour l'entreprise

1. **Professionnalisme**
   - Factures au look professionnel
   - Informations légales complètes
   - QR Code pour contact facile

2. **Gain de temps**
   - Saisie rapide avec catalogue
   - Calculs automatiques
   - Réutilisation des clients

3. **Organisation**
   - Historique complet
   - Numérotation automatique
   - Recherche facile

4. **Flexibilité**
   - Modifications possibles
   - Export PDF illimité
   - Conditions personnalisables

### ✅ Pour les clients

1. **Clarté**
   - Facture facile à lire
   - Détail de chaque article
   - Totaux bien visibles

2. **Contact facile**
   - QR Code WhatsApp
   - Coordonnées complètes
   - Plusieurs moyens de contact

3. **Confiance**
   - Numéros légaux affichés
   - Document professionnel
   - Conditions claires

## Technologies utilisées

**Frontend :**
- React 18 avec TypeScript
- Tailwind CSS pour le styling
- Lucide React pour les icônes
- Vite comme build tool

**Backend :**
- Supabase (PostgreSQL)
- Row Level Security
- API REST automatique

**Génération PDF :**
- HTML/CSS dynamique
- API QR Server pour QR codes
- Impression native navigateur

## Développeur

**RENATO TCHOBO**

Plateforme développée avec attention aux détails, performance et expérience utilisateur.
