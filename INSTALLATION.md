# Guide d'installation - Plateforme Proforma

## Étape 1 : Configuration de la base de données Supabase

### 1.1 Accéder à Supabase
1. Connectez-vous à votre projet Supabase : https://supabase.com/dashboard
2. Votre projet est déjà configuré avec l'URL : `https://kzmfsmpclozknmltrubu.supabase.co`

### 1.2 Créer les tables
1. Dans le menu latéral, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"**
3. Copiez tout le contenu du fichier `database-schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **"Run"** (ou appuyez sur Ctrl+Enter)

Vous devriez voir un message de succès indiquant que les tables ont été créées.

### 1.3 Vérifier les tables créées
1. Dans le menu latéral, cliquez sur **"Table Editor"**
2. Vous devriez voir les 5 tables suivantes :
   - `company_settings`
   - `clients`
   - `articles`
   - `proformas`
   - `proforma_items`

### 1.4 Vérifier les données par défaut
1. Cliquez sur la table `company_settings`
2. Vous devriez voir une ligne avec les informations de GBEFFA REIS BE KOM

## Étape 2 : Installation de l'application

### 2.1 Installer les dépendances
```bash
npm install
```

### 2.2 Vérifier la configuration
Le fichier `.env` est déjà configuré avec :
```
VITE_SUPABASE_URL=https://kzmfsmpclozknmltrubu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Étape 3 : Lancer l'application

### Mode développement
```bash
npm run dev
```

L'application sera accessible sur : http://localhost:5173

### Mode production
```bash
npm run build
npm run preview
```

## Étape 4 : Premier usage

### 4.1 Vérifier les paramètres entreprise
1. Ouvrez l'application
2. Allez dans l'onglet **"Paramètres"** (icône d'engrenage en bas)
3. Vérifiez que les informations de l'entreprise sont correctes
4. Modifiez si nécessaire et cliquez sur **"Enregistrer les paramètres"**

### 4.2 Ajouter des clients
1. Allez dans l'onglet **"Clients"**
2. Cliquez sur **"Ajouter un client"**
3. Remplissez les informations
4. Cliquez sur **"Ajouter"**

### 4.3 Créer votre première proforma
1. Depuis le tableau de bord, cliquez sur **"Nouvelle facture"** (bouton rouge)
2. Sélectionnez un client
3. Ajoutez des lignes d'articles
4. Configurez les options (TVA, conditions de paiement)
5. Cliquez sur **"Enregistrer"**
6. Cliquez sur **"Télécharger PDF"** pour générer le document

## Résolution des problèmes courants

### Erreur : "Failed to fetch"
- Vérifiez que le script SQL a bien été exécuté dans Supabase
- Vérifiez que les politiques RLS sont bien configurées
- Vérifiez que le fichier `.env` contient les bonnes clés

### Les données ne s'affichent pas
- Ouvrez les outils de développement du navigateur (F12)
- Regardez l'onglet "Console" pour voir les erreurs
- Vérifiez que les tables existent dans Supabase

### Le PDF ne se génère pas
- Vérifiez que vous avez bien sélectionné un client
- Vérifiez que vous avez ajouté au moins un article
- Autorisez les pop-ups dans votre navigateur

## Support technique

Pour toute question ou problème :
1. Vérifiez d'abord ce guide d'installation
2. Consultez le fichier README.md pour plus de détails
3. Vérifiez les logs dans la console du navigateur

## Développeur

**RENATO TCHOBO**

Plateforme développée avec React, TypeScript, Tailwind CSS et Supabase.
