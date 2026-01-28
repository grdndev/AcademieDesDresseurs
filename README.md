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
