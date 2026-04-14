# 🎓 Académie des Dresseurs

L’Académie des Dresseurs est une plateforme e-commerce et communautaire haut de gamme dédiée aux passionnés du **Pokémon Trading Card Game (TCG)**. Elle combine apprentissage, coaching stratégique et une boutique spécialisée.

## 🚀 Structure du Projet

Le projet est divisé en deux parties principales :

### 🎨 Frontend (`/frontend`)
Interface utilisateur moderne et réactive construite avec les dernières technologies.
- **Framework** : Next.js 15 (App Router)
- **Logique** : React 19 & TypeScript
- **Styling** : Tailwind CSS v4
- **Design system** :
  - **Couleurs** : Bleu Académie (#004A99), Jaune Accent (#E1BC2E)
  - **Typographie** : Outfit (Google Fonts)
- **Icônes** : Lucide React

### ⚙️ Backend (`/backend`)
API robuste pour la gestion des données et des utilisateurs.
- **Environnement** : Node.js & Express.js
- **Base de données** : MongoDB (via Mongoose)
- **Authentification** : JWT (JSON Web Tokens) & BcryptJS
- **Port par défaut** : 5001

---

## Version Démo (docker compose)
Récupérer cards.json au préalable.
S'assurer que le service mongod soit stoppé localement, puis :

```bash
docker compose up --build -d
mongoimport --db=express_api_db --collection=cards --file=cards.json
```

*Note : L'interface est accessible sur `http://localhost:3000`.*

## 🛠️ Installation et Lancement

### 1. Prérequis
- Node.js (v18+)
- MongoDB (local ou Atlas)

### 2. Lancement du Backend
```bash
cd backend
npm install
npm start
```
*Note : Le serveur tourne sur le port `5001`.*

### 3. Lancement du Frontend
```bash
cd frontend
npm install
npm run dev
```
*Note : L'interface est accessible sur `http://localhost:3000`.*

---

## 🗺️ Fonctionnalités actuelles (Phase 1)

- ✅ **Landing Page Premium** : Présentation des services et conversion.
- ✅ **Authentification** : Registration et Login (UI/UX complète).
- ✅ **Hub Apprendre** : Catalogue de cours (Live, Replays, Guides PDF).
- ✅ **Hub Progresser** : Services de coaching et accompagnement.
- ✅ **Hub S'équiper** : Boutique (Decks, Cartes, Accessoires).
- ✅ **Devenir Professeur** : Page de recrutement dédiée.
- 🚧 **Deck-to-Stock Builder** : Importation de listes et vérification de stock (En cours).

---

## 📈 Dashboard de Projet
Pour un suivi détaillé des tâches et de la roadmap, consultez :
`project_dashboard.html` à la racine du projet.

---

## 📄 Licence
Propriété exclusive de l'Académie des Dresseurs.

## ☁️ Déploiement OVH

Un guide de déploiement API-first est disponible ici :
`DEPLOY_OVH.md`

## 🔎 Smoke tests
Pour vérifier rapidement la connectivité entre le frontend et le backend vous pouvez utiliser ces commandes.

Depuis l'hôte (vérifie l'API exposée sur localhost:5001) :

```bash
node scripts/smoke-test.js --mode=host
# ou une requête curl individuelle
curl http://localhost:5001/health
curl http://localhost:5001/api/cards
```

Depuis le conteneur frontend (vérifie la connexion interne via le hostname `api:5001`) :

```bash
docker compose exec frontend \
  sh -c "curl -sS http://api:5001/health && echo && curl -sS http://api:5001/api/cards"
```

J'ai ajouté `scripts/smoke-test.js` (mode host) et un petit wrapper pour exécuter des vérifications rapides depuis le conteneur. Ces tests retournent les codes HTTP et un extrait des réponses JSON.
