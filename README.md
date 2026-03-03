# 🛒 e-comm-bf

> **Plateforme e-commerce moderne pour le Burkina Faso** — Conçue par **August**

Application e-commerce complète et prête à l'emploi pour la vente de produits électroniques, développée avec Next.js 15. Elle propose une interface utilisateur élégante en mode sombre, l'authentification Google OAuth, un panneau d'administration complet et une gestion intégrale des produits et des commandes.

## ✨ Fonctionnalités
### 🏪 Boutique

- **Carrousel d'accueil** avec bannières animées

- **Catalogue de produits** avec filtrage avancé (catégorie, prix, marque, promotions)

- **Détail du produit** avec galerie d'images, variantes, avis et informations de stock

- **Panier intelligent** avec état persistant (Zustand + localStorage)

- **Liste de souhaits**

**Flux de paiement** avec gestion des adresses

- **Suivi des commandes** pour les clients

- **Abonnement à la newsletter**

### 🔐 Authentification

- **Google OAuth** (connexion en un clic)

- **Identifiants** (e-mail/mot de passe avec bcrypt)

- **Sessions JWT** avec contrôle d'accès basé sur les rôles

- Gestion sécurisée des comptes

### ⚙️ Panneau d'administration

- **Tableau de bord** avec statistiques en temps réel et graphiques de revenus

- **Gestion des produits** : création, modification, suppression avec ajout d'images

- **Gestion des commandes** : consultation, mise à jour Statut, suivi
- **Gestion des utilisateurs** — consulter et modifier les rôles
- **Gestion des catégories**
- **Gestion des coupons**
- **Gestion des bannières**
- **Liste des abonnés à la newsletter**

### 🎨 Design
- **Thème sombre luxueux** — interface utilisateur sombre et sophistiquée avec des accents dorés
- **Association typographique Playfair Display + DM Sans**

- Effets de morphisme de verre, textures granuleuses

- Animations fluides et micro-interactions

- Entièrement **responsive** (mobile-first)

- Barre de défilement personnalisée, dégradés animés
## 🛠 Technologies utilisées

| Couche | Technologie |

|-------|-----------|

| Framework | Next.js 15 (App Router) |

| Langage | TypeScript |

| Style | Tailwind CSS |

| Authentification | NextAuth v5 + Google OAuth |

| Base de données | PostgreSQL + Prisma ORM |

| État | Zustand |

| Graphiques | Recharts |

| Formulaires | React Hook Form + Zod |

| Animations | Framer Motion |

| Images | Cloudinary |

| Notifications | React Hot Toast |

## 🚀 Démarrage rapide
### Prérequis
- Node.js 20+
- Base de données PostgreSQL

- Identifiants Google OAuth (gratuits sur console.cloud.google.com)



### 1. Cloner et installer
```bash
git clone <votre-dépôt>
cd e-comm-bf
npm install
```

### 2. Configuration de l'environnement
```bash
cp .env.example .env
```

Renseignez votre fichier `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommbf"
NEXTAUTH_SECRET="votre-clé-secrète-32-caractères"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="votre-identifiant-client-google"
GOOGLE_CLIENT_SECRET="votre-clé-secrète-client-google"
```

### 3. Configuration de la base de données
```bash
# Générer le client Prisma
npm run db:generate

# Envoyer le schéma Base de données

npm run db:push

# Initialisation avec des données de démonstration
npm run db:seed
```

### 4. Lancer le développement
```bash
npm run dev
```

Ouvrir [http://localhost:3000/store](http://localhost:3000/store) 🎉

---

## 🔑 Comptes de démonstration

| Rôle | Adresse e-mail | Mot de passe |

|------|-------|----------|

| Admin | admin@ecommbf.com | admin123! |

| Utilisateur | user@ecommbf.com | user123! |

---

## 📁 Structure du projet
```
e-comm-bf/
├── app/
│   ├── store/              # Customer-facing store
│   │   ├── page.tsx        # Homepage
│   │   ├── products/       # Product catalog & detail
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow
│   │   └── orders/         # Order history
│   ├── admin/              # Admin panel (protected)
│   │   ├── page.tsx        # Dashboard
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   ├── users/          # User management
│   │   └── categories/     # Category management
│   ├── auth/               # Authentication pages
│   │   ├── login/
│   │   └── register/
│   └── api/                # API Routes
│       ├── auth/           # NextAuth handlers + register
│       ├── products/       # Products CRUD API
│       ├── orders/         # Orders API
│       └── newsletter/     # Newsletter subscription
├── components/
│   ├── store/              # Store UI components
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartSidebar.tsx
│   │   ├── ProductFilters.tsx
│   │   └── Footer.tsx
│   └── admin/              # Admin UI components
│       ├── AdminSidebar.tsx
│       ├── AdminTopbar.tsx
│       ├── RevenueChart.tsx
│       └── OrdersTable.tsx
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── store/
│   └── cart.ts             # Zustand stores (cart + wishlist)
├── types/
│   └── index.ts            # TypeScript types
└── prisma/
    ├── schema.prisma       # Database schema
    └── seed.ts             # Demo data seeder
```

---
## 🌐 Configuration OAuth Google

1. Accédez à la [Console Google Cloud](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API Google+
4. Créez des identifiants OAuth 2.0
5. Ajoutez l'URI de redirection autorisée : `http://localhost:3000/api/auth/callback/google`
6. Copiez l'ID client et le secret dans le fichier `.env`

---
## 📦 Scripts disponibles

``bash
npm run dev # Démarrer le serveur de développement
npm run build # Compiler pour la production
npm run start # Démarrer le serveur de production
npm run db:generate # Générer le client Prisma
npm run db:push # Envoyer le schéma (développement)
npm run db:migrate # Exécuter les migrations (production)
npm run db:seed # Initialiser les données de démonstration
npm run db:studio # Ouvrir Prisma Studio

``
---

## 🎨 Système de design

Le design s'inspire de l'esthétique **Commerce sombre et luxueux** :

- **Couleur principale** : Or (#d4920c) — pour les appels à l'action, les accents et les surlignages
- **Fond** : Noir profond (#0a0a0b, #111114) — tons sombres et riches
- **Texte** : Gris clair (#e8e8ec, #9898a8) — contraste élevé, lisibilité optimale
- **Typographie** : Playfair Display (titres) + DM Sans (corps du texte)
- **Effets** : Glassmorphism, textures granuleuses, orbes lumineuses dégradées

---

## 👨‍💻 Réalisé par August

Ce projet a été conçu avec précision et soin par **August** comme une solution e-commerce moderne et prête pour la production, destinée au marché du Burkina Faso.

---

*© 2026 e-comm-bf — Tous droits réservés*