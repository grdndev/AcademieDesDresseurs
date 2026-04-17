# PROJECT_STATE — Académie des Dresseurs

## Stack

- **Framework** : Next.js 15 App Router, TypeScript
- **CSS** : Tailwind CSS v4 (`@theme` tokens dans `globals.css`)
- **Fonts** : `next/font/google` — Poppins (`--font-poppins`) + Inter (`--font-inter`)
- **State** : React Context (`CartProvider`) — actions : ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, SET_STOCK, CLEAR_CART, ADD_DECKLIST
- **API** : `getApiBase()` depuis `app/lib/api.ts`
- **Utilitaires** : `formatPrice()`, `calculateShipping()` dans `app/utils.tsx`
- **Images** : `/public/res/` — avatar1-3.png, course1-3.png, video_placeholder.png
- **Figma previews** : `/figma_previews/` (PNGs de référence)

## Couleurs Figma (tokens dans globals.css)

| Token                    | Valeur    | Usage                        |
|--------------------------|-----------|------------------------------|
| `--color-brand-blue`     | `#01509d` | Boutons, liens actifs        |
| `--color-brand-blue-dark`| `#014080` | Hover bouton bleu            |
| `--color-brand-navy`     | `#140759` | Titres principaux            |
| `--color-brand-hero`     | `#6096ba` | Fond hero / navbar           |
| `--color-brand-dark`     | `#274c78` | Sections sombres             |
| `--color-brand-yellow`   | `#dbb42b` | CTA jaune                    |
| `--color-bg-page`        | `#f9fafb` | Fond général                 |
| `--color-bg-section-light`| `#eef5fb`| Fond sections S'équiper      |
| `--color-bg-parcours`    | `#e3ecf8` | Fond sections Parcours       |

## Arborescence des fichiers

```
frontend/app/
├── globals.css                    ✅ Tokens Figma complets
├── layout.tsx                     ✅ Poppins + Inter, CartProvider, Footer global
├── page.tsx                       ✅ Page d'accueil
├── utils.tsx                      ✅ formatPrice(), calculateShipping()
│
├── components/
│   ├── Navbar.tsx                 ✅ Hero inner pages corrigé (48px, sans attachmentImg)
│   ├── Footer.tsx                 ✅ Navy #0d1b3e, icônes sociales (Twitter/Youtube/Instagram/Twitch)
│   ├── Card.tsx                   ✅ Figma style : hover -translate-y, stock, "A partir de Xé"
│   ├── CourseCard.tsx             ✅ Atelier/coaching : thumbnail, LIVE badge, date, level, réserver
│   ├── GuideCard.tsx              ✅ Guide textuel : gradient coloré, étoiles, "Lire le guide"
│   ├── PriceCard.tsx              ✅ Sidebar achat : prix barré, CTA, note sécurité, features
│   ├── TeacherCard.tsx            ✅ Bloc professeur : avatar, vérifié, bio, tags, lien cours
│   ├── AddToCartButton.tsx        ✅
│   ├── RequestedCardSmall.tsx     ✅
│   └── SEquiperHeader.tsx         ✅
│   └── ui/
│       ├── Button.tsx             ✅ Variants : primary, yellow, outline, green, ghost — sizes : sm/md/lg
│       ├── Badge.tsx              ✅ Niveau, format, statut — auto-coloré par label
│       └── Pagination.tsx         ✅ Flèches + pages + ellipsis, actif = #01509d
│
├── context/
│   └── cart-provider.tsx          ✅
│
├── lib/
│   └── api.ts                     ✅ getApiBase()
│
├── types/
│   └── card.tsx                   ✅
│
├── apprendre/
│   ├── page.tsx                   ✅ Liste des cours
│   └── [courseId]/
│       └── page.tsx               ⚠️  Reverted — version simplifiée sans badge/rating/sidebar
│
├── conditions/
│   └── page.tsx                   ✅
│
├── confidentialite/
│   └── page.tsx                   ✅
│
├── contact/
│   └── page.tsx                   ✅
│
├── forgot-password/
│   └── page.tsx                   ✅
│
├── login/
│   └── page.tsx                   ✅
│
├── mentions-legales/
│   └── page.tsx                   ✅
│
├── register/
│   └── page.tsx                   ✅
│
├── panier/
│   ├── layout.tsx                 ✅
│   ├── page.tsx                   ✅ Utilise calculateShipping()
│   ├── checkout/
│   │   └── page.tsx               ✅ 2 colonnes, calculateShipping(), promo code
│   └── paiement/
│       └── [orderId]/
│           └── page.tsx           ✅ AbortController, vue confirmation
│
├── professeur/
│   └── page.tsx                   ✅ Landing professeur
│                                  ❌ /professeur/candidature — MANQUANT
│
├── progresser/
│   └── page.tsx                   ✅ Landing progresser
│                                  ❌ /progresser/coaching — MANQUANT
│                                  ❌ /progresser/ateliers — MANQUANT
│                                  ❌ /progresser/tournois — MANQUANT
│
├── sequiper/
│   ├── layout.tsx                 ✅
│   ├── page.tsx                   ✅ Landing s'équiper
│   ├── error.tsx                  ✅
│   ├── accessoires/
│   │   └── page.tsx               ✅ Filtres + grille (stub léger)
│   ├── builder/
│   │   └── page.tsx               ✅ Debounce 600ms, useMemo, résultats par statut
│   ├── cartes/
│   │   ├── page.tsx               ✅ Search + rarity + sort, pagination, useMemo
│   │   └── [id]/
│   │       └── page.tsx           ✅ Détail carte
│   └── decks/
│       ├── page.tsx               ✅ Search + format + level, grille 6 decks
│       └── [id]/
│           └── page.tsx           ✅ Détail deck : hero, stratégie, decklist groupée, sidebar sticky
│
├── wallet/
│   └── page.tsx                   ✅
│
└── espace-joueur/                 ❌ MANQUANT (dashboard joueur complet)
```

## État d'avancement

| Catégorie         | Fait | Manquant |
|-------------------|------|----------|
| Pages créées      | 23   | 5        |
| Composants        | 6    | 0        |
| Qualité ⚠️ (reverted) | 2 | —     |

### Pages manquantes (5)
1. `/espace-joueur` — Dashboard : stats, coaching banner, orders, decklists, wallet, sidebar tabs
2. `/professeur/candidature` — Formulaire 4 étapes avec progress indicator
3. `/progresser/coaching` — Sélection coach + formulaire réservation
4. `/progresser/ateliers` — Liste ateliers avec spots / date / niveau
5. `/progresser/tournois` — Programmes Régionaux/Internationaux + tournois à venir

### Fichiers à corriger (2)
1. `components/Footer.tsx` — Redesign fond `#0d1b3e`, icônes sociales (Twitter, Youtube, Instagram, Twitch, GraduationCap)
2. `apprendre/[courseId]/page.tsx` — Redesign avec badge, rating, étoiles, sidebar modules sur fond `#e3ecf8`

## Patterns à respecter

- **Filtres / tri** → `useMemo` (jamais `useState` redondant)
- **Fetch** → `AbortController` avec cleanup dans `useEffect`
- **Textarea debounce** → `useRef` timer 600 ms
- **Cart** → `dispatch({ type, payload })` via `useCart()`
- **Shipping** → toujours `calculateShipping()` de `utils.tsx`
- **Prix** → toujours `formatPrice()` de `utils.tsx`
- **Fonts** → `font-['Poppins']` pour titres, `font-['Inter']` pour corps (ou implicite via body)
- **Liens** → `next/link`, jamais `<a>` banal pour navigation interne
