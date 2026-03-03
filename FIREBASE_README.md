# Déploiement de E-comm-bf sur Firebase Hosting

Ce guide explique comment déployer gratuitement votre application Next.js sur Firebase Hosting, avec le support de l'Edge Runtime et du SSR (Server-Side Rendering) grâce aux **Firebase Web Frameworks**.

## Prérequis

1. Avoir un compte [Firebase](https://firebase.google.com/)
2. Installer les outils Firebase en mode global :
```bash
npm install -g firebase-tools
```

## Étapes de déploiement

### 1. Se connecter à Firebase CLI
Exécutez la commande suivante et connectez-vous avec votre compte Google :
```bash
firebase login
```

### 2. Initialiser Firebase dans le projet
À la racine de votre projet (`e-comm-bf`), lancez l'initialisation :
```bash
firebase init hosting
```

**Lorsqu'on vous le demande :**
- Sélectionnez votre projet Firebase existant ou créez-en un nouveau.
- Quand on vous demande : `"Do you want to use a web framework? (experimental)"`, répondez **Yes (y)**. 
*(Ceci est crucial pour que Firebase détecte Next.js et gère le SSR)*.
- Source directory: laissez par défaut ou confirmez si Next.js est détecté.
- Région pour les fonctions Cloud (SSR) : `us-central1` ou `europe-west1` selon votre préférence.

### 3. Configurer les variables d'environnement
Firebase Functions nécessite vos variables secrètes.
Au lieu du fichier `.env`, vous devez les déclarer directement dans Firebase via cette commande (pour chaque secret) :
```bash
firebase functions:secrets:set NEXTAUTH_SECRET
firebase functions:secrets:set DATABASE_URL
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set NEXT_PUBLIC_SUPABASE_URL
firebase functions:secrets:set NEXT_PUBLIC_SUPABASE_ANON_KEY
```
*(Remarque : les variables préfixées par `NEXT_PUBLIC_` peuvent aussi être ajoutées dans `.env.production` car elles sont intégrées au moment du build)*.

### 4. Déployer l'application
Firebase s'occupe de lancer `npm run build` en arrière-plan et de packager votre application complète :

```bash
firebase deploy --only hosting
```

### Félicitations ! 🎉
À la fin du processus, Firebase vous fournira une 'Hosting URL' (ex: `https://votre-projet.web.app`) que vous pouvez partager publiquement.

## Maintenance et Mise à jour

Pour les futures mises à jour que vous effectuerez sur le code, exécutez simplement :
```bash
firebase deploy --only hosting
```
