# Gestion et Sauvegarde de la Base de Données (Supabase)

Supabase étant basé sur PostgreSQL, il existe plusieurs méthodes simples et robustes pour sauvegarder (backup) et restaurer votre base de données.

## 1. Méthode Automatique (Recommandée) : Point-in-Time Recovery (PITR)
Si vous passez sur un plan payant Supabase (Pro Plan), Supabase offre des sauvegardes quotidiennes automatiques et la fonction **Point-in-Time Recovery (PITR)**. 
- En cas de crash ou de suppression accidentelle, vous pouvez restaurer la base de données à n'importe quelle seconde précise dans le temps (jusqu'à 7 jours en arrière) en un simple clic depuis le tableau de bord Supabase (Settings > Database > Backups).

## 2. Sauvegarde Manuelle vers votre Ordinateur Local

Même avec le plan gratuit, vous pouvez créer une sauvegarde complète de votre base de données sur votre ordinateur.

### Prérequis
Vous devez avoir `pg_dump` installé sur votre ordinateur (inclus si vous installez PostgreSQL localement).

### Étape 1 : Obtenir l'URL de connexion
1. Allez dans votre tableau de bord Supabase.
2. Cliquez sur l'icône **Settings** (engrenage) > **Database**.
3. Descendez jusqu'à **Connection string** > **URI**.
4. Copiez l'URL (elle ressemble à `postgresql://postgres.[votredomaine]:[motdepasse]@aws-0-....pooler.supabase.com:5432/postgres`).

### Étape 2 : Lancer la sauvegarde (Dump)
Ouvrez votre terminal et exécutez cette commande en remplaçant `[VOTRE_URI_SUPABASE]` par l'URL copiée à l'étape 1 :

```bash
pg_dump "[VOTRE_URI_SUPABASE]" --clean --if-exists --format=c --file=sauvegarde_ecomm_$(date +%Y-%m-%d).dump
```
> Cela va créer un fichier (ex: `sauvegarde_ecomm_2023-10-25.dump`) sur votre ordinateur contenant toutes vos tables et données. **Faites ceci régulièrement (ex: une fois par semaine) !**

---

## 3. Comment Restaurer la Base de Données (En cas de crash)

Si le pire se produit et que vous perdez vos données, vous pouvez utiliser votre fichier `.dump` sauvegardé pour restaurer la base à l'état exact où elle était lors de la sauvegarde.

### Prérequis
Vous devez utiliser l'outil `pg_restore`.

### Étape de restauration
Ouvrez votre terminal et exécutez la commande suivante (vérifiez bien de cibler le bon fichier dump) :

```bash
pg_restore -d "[VOTRE_URI_SUPABASE]" -1 sauvegarde_ecomm_2023-10-25.dump
```
- Le drapeau `-d` indique la base de destination (votre Supabase).
- Le drapeau `-1` (un) garantit que soit tout se restaure parfaitement, soit rien ne change (évite les restaurations partielles et corrompues).

## Alternative Rapide: Export CSV depuis le Dashboard
Pour sauvegarder uniquement les données de vos clients ou de vos commandes (sans la structure complexe) :
1. Dans Supabase, allez dans **Table editor**.
2. Sélectionnez la table (ex: `User` ou `Order`).
3. En haut à droite, cliquez sur **Export** > **Export as CSV**.
4. Vous aurez un fichier Excel contenant toutes vos données vitales, facilement lisible.
