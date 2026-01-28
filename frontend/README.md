# 🎨 Académie des Dresseurs - Frontend

L'interface utilisateur de l'Académie des Dresseurs, conçue pour offrir une expérience premium aux joueurs de TCG.

## 🛠️ Stack Technique

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Typographie** : Outfit (Configurée via CSS variables)

## 🚀 Démarrage

1. **Installer les dépendances** :
```bash
npm install
```

2. **Lancer le serveur de développement** :
```bash
npm run dev
```

3. **Accéder à l'application** :
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du Projet

- `app/` : Contient toutes les pages et la logique du App Router.
  - `components/` : Composants réutilisables (Navbar, Footer, etc.).
  - `apprendre/` : Hub de formation.
  - `progresser/` : Hub de coaching.
  - `sequiper/` : Boutique et Deck-to-Stock Builder.
  - `professeur/` : Recrutement.
  - `login/` & `register/` : Authentification.
- `public/` : Assets statiques (images, favicons).

## 🎨 Design System

Le design repose sur les variables CSS définies dans `globals.css` :
- `--primary` : Bleu Académie (#004A99)
- `--accent` : Jaune Accent (#E1BC2E)
- `--font-outfit` : Police principale pour une lisibilité optimale.

## 🚧 En cours de développement

- Intégration complète du panier d'achat.
- Logique du Deck-to-Stock Builder (import de lists).
- Connexion aux APIs backend pour la gestion utilisateur.
