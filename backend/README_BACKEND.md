# 🎴 L'Académie des Dresseurs - Backend API

Backend Node.js/Express pour la boutique Pokemon TCG en ligne.

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Créer un fichier `.env` à la racine du backend (déjà créé) :

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/express_api_db
JWT_SECRET=your_super_secure_jwt_secret_change_in_production_2026
```

## 🚀 Démarrage

### Mode développement (avec nodemon)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## 📁 Structure du Projet

```
backend/
├── config/
│   └── db.js              # Configuration MongoDB
├── middleware/
│   └── auth.js            # Middlewares d'authentification
├── models/
│   ├── User.js            # Modèle utilisateur
│   ├── Card.js            # Modèle carte Pokemon
│   ├── Deck.js            # Modèle deck
│   ├── Accessory.js       # Modèle accessoire
│   ├── Order.js           # Modèle commande
│   └── Promocode.js       # Modèle code promo
├── routes/
│   ├── users.js           # Routes utilisateurs
│   ├── cards.js           # Routes cartes
│   ├── decks.js           # Routes decks
│   ├── accessories.js     # Routes accessoires
│   ├── orders.js          # Routes commandes
│   ├── payment.js         # Routes paiement
│   └── promocodes.js      # Routes codes promo
├── index.js               # Point d'entrée
├── package.json
├── .env
└── README.md
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Le token doit être inclus dans le header :

```
Authorization: Bearer <token>
```

## 👥 Rôles & Permissions

| Rôle         | Permissions                          |
|--------------|--------------------------------------|
| user         | Accès basique + profil personnel     |
| editor       | user + gestion du contenu            |
| admin        | editor + gestion utilisateurs        |
| super-admin  | Tous les droits                      |

## 📍 Routes Principales

### Users (`/api/users`)
- `POST /register` - Créer un compte
- `POST /login` - Se connecter
- `GET /me` - Profil utilisateur
- `GET /me/wishlist` - Wishlist
- `GET /me/orders` - Historique des commandes

### Cards (`/api/cards`)
- `GET /` - Liste des cartes (avec filtres)
- `GET /search/advanced` - Recherche avancée
- `POST /batch-check` - Vérifier disponibilité (Deck-to-Stock Builder)
- `GET /:id` - Détails d'une carte

### Decks (`/api/decks`)
- `GET /` - Liste des decks (avec filtres)
- `GET /featured/list` - Decks mis en avant
- `GET /:id/availability` - Vérifier disponibilité
- `GET /:id/export` - Exporter la liste (format Limitless)
- `POST /custom` - Créer un deck personnalisé

### Accessories (`/api/accessories`)
- `GET /` - Liste des accessoires
- `GET /categories/list` - Liste des catégories
- `GET /customizable/list` - Accessoires personnalisables
- `GET /:id/related` - Produits similaires

### Orders (`/api/orders`)
- `POST /` - Créer une commande
- `GET /my-orders` - Mes commandes
- `GET /number/:orderNumber` - Suivi de commande
- `PUT /:id/cancel` - Annuler une commande

### Payment (`/api/payment`)
- `POST /create-intent` - Créer intention de paiement Stripe
- `POST /confirm` - Confirmer un paiement
- `POST /paypal/create` - Créer paiement PayPal
- `POST /:orderId/refund` - Rembourser (admin)

## 🧪 Test de l'API

### Health Check
```bash
curl http://localhost:5001/health
```

### Créer un compte
```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "pseudo": "Dresseur123"
  }'
```

## 📊 Base de Données

MongoDB avec Mongoose ODM.

### Collections principales
- `users` - Utilisateurs
- `cards` - Cartes Pokemon
- `decks` - Decks officiels et custom
- `accessories` - Accessoires TCG
- `orders` - Commandes

## 🔄 Démarrage rapide

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Démarrer MongoDB** (si pas déjà démarré)
   ```bash
   # MongoDB devrait déjà tourner en tant que service
   # Vérifier avec : ps aux | grep mongod
   ```

3. **Lancer le serveur**
   ```bash
   npm run dev
   ```

4. **Tester**
   ```bash
   curl http://localhost:5001/health
   # Réponse : {"status":"OK","timestamp":"..."}
   ```

## 📝 Documentation

- [DOCUMENTATION.md](./DOCUMENTATION.md) - Règles métier et calculs
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Documentation complète des routes

## 🚧 TODO Phase 2

- [ ] Intégrer le vrai SDK Stripe
- [ ] Intégrer le vrai SDK PayPal
- [ ] Système d'email (SendGrid/Mailgun)
- [ ] Validation des codes promo
- [ ] Parser de decklist (Deck-to-Stock Builder)
- [ ] Upload d'images (Cloudinary/S3)
- [ ] Rate limiting
- [ ] Logs (Winston)

## 📄 License

ISC
