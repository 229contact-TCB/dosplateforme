# Guide de démarrage rapide - Plateforme Proforma

## En 5 minutes

### 1. Configurer la base de données (2 min)

1. Allez sur : https://supabase.com/dashboard
2. Ouvrez votre projet
3. Menu **"SQL Editor"** → **"New query"**
4. Copiez-collez le contenu de `database-schema.sql`
5. Cliquez sur **"Run"**

✅ Vos tables sont créées avec les données par défaut !

### 2. Installer l'application (1 min)

```bash
npm install
```

✅ Toutes les dépendances sont installées !

### 3. Lancer l'application (1 min)

```bash
npm run dev
```

✅ Application accessible sur http://localhost:5173

### 4. Première utilisation (1 min)

1. **Vérifier les paramètres** (onglet Paramètres)
   - Les infos de GBEFFA REIS BE KOM sont déjà là
   - Modifiez si besoin

2. **Ajouter un client** (onglet Clients)
   - Cliquez "Ajouter un client"
   - Remplissez le nom
   - Enregistrez

3. **Créer une proforma** (tableau de bord → Nouvelle facture)
   - Sélectionnez votre client
   - Ajoutez une ligne d'article
   - Remplissez : désignation, quantité, prix
   - Cliquez "Télécharger PDF"

✅ Votre première facture est prête !

## Aide rapide

### Problème : Les tables ne se créent pas
**Solution :** Vérifiez que vous avez bien exécuté le script SQL dans Supabase

### Problème : Erreur "Failed to fetch"
**Solution :** Vérifiez que le fichier `.env` contient les bonnes clés Supabase

### Problème : Le PDF ne s'ouvre pas
**Solution :** Autorisez les pop-ups dans votre navigateur

## Raccourcis utiles

- **Nouvelle facture depuis n'importe où** : Accueil → bouton rouge "Nouvelle facture"
- **Ajouter un client rapidement** : Accueil → bouton vert "Ajouter un client"
- **Voir l'historique** : Accueil → bouton jaune "Historique"

## Documentation complète

Pour plus de détails, consultez :
- `README.md` - Documentation complète
- `INSTALLATION.md` - Guide d'installation détaillé
- `STRUCTURE.md` - Architecture du projet

## Développeur

**RENATO TCHOBO**
