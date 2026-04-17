# DESIGN_SPEC — Académie des Dresseurs

> Référence design à lire au début de chaque session. Évite de partager des screenshots.

---

## Typographie

| Rôle                  | Font    | Weight | Size      | Couleur       |
|-----------------------|---------|--------|-----------|---------------|
| Titre hero (inner)    | Poppins | 700    | 48px      | `#ffffff`     |
| Titre section (H2)    | Poppins | 700    | 28–32px   | `#140759`     |
| Titre card (H3)       | Inter   | 700    | 14–16px   | `#140759`     |
| Prix principal        | Poppins | 700    | 40–48px   | `#140759`     |
| Prix secondaire       | Poppins | 700    | 18–20px   | `#140759`     |
| Corps de texte        | Inter   | 400    | 14px      | `#4b5563`     |
| Label / meta          | Inter   | 400    | 12px      | `#808896`     |
| Placeholder input     | Inter   | 400    | 14px      | `#9ca3af`     |

Classes Tailwind : `font-['Poppins']` ou `font-['Inter']`

---

## Couleurs

```
#140759  navy       — titres principaux
#01509d  blue       — boutons primary, liens actifs
#014080  blue-dark  — hover bouton blue
#dbb42b  yellow     — CTA jaune
#1a3a6e  navy-cta   — texte sur fond jaune
#6096ba  hero       — fond hero / navbar
#274c78  dark       — sections sombres
#0d1b3e  footer     — fond footer
#16a34a  green      — bouton lire/succès
#f26c23  warning    — orange alertes

#f9fafb  bg-page          — fond général
#eef5fb  bg-section-light — sections s'équiper
#e3ecf8  bg-parcours      — sections parcours / avantages
#f8f7f4  bg-video         — section vidéo
#fdfcfe  bg-card          — fond cartes

#808896  text-muted       — sous-titres, labels
#4b5563  text-body        — corps de texte
#9ca3af  text-placeholder — placeholders
#e5e7eb  border           — bordures cartes et inputs
```

---

## Layout

- **Max-width pages** : `max-w-[1280px] mx-auto px-6 lg:px-[100px]`
- **Max-width legacy** : `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Gap sections** : `py-16` entre sections, `py-10` sur pages inner
- **Gap grilles cards** : `gap-6` (3 col) ou `gap-8` (2 col)
- **Border-radius cards** : `rounded-2xl`
- **Border-radius boutons** : `rounded-xl`
- **Border-radius inputs** : `rounded-xl`

---

## Composants atomiques (`components/ui/`)

### Button — `variant` + `size` + `href|onClick`

| Variant   | Fond      | Texte     | Hover     |
|-----------|-----------|-----------|-----------|
| `primary` | `#01509d` | blanc     | `#014080` |
| `yellow`  | `#dbb42b` | `#140759` | `#c9a120` |
| `outline` | transparent | `#01509d` | bg/5  |
| `green`   | `#16a34a` | blanc     | `#15803d` |
| `ghost`   | transparent | `#01509d` | bg/10 |

Tailles : `sm`=h-9 px-4, `md`=h-11 px-6, `lg`=h-13 px-8

### Badge — auto-coloré par `label`

| Label          | Style                              |
|----------------|------------------------------------|
| Débutant       | `bg-green-50 text-green-700`       |
| Intermédiaire  | `bg-orange-50 text-orange-600`     |
| Avancé         | `bg-blue-50 text-[#01509d]`        |
| Méta           | `bg-[#01509d] text-white`          |
| Standard       | `bg-[#dbb42b] text-[#1a3a6e]`      |
| LIVE           | `bg-red-500 text-white`            |
| En stock       | `bg-green-50 text-green-700`       |
| Rupture        | `bg-red-50 text-red-600`           |

### Pagination

Flèches `ChevronLeft/Right` + numéros + ellipsis. Page active = `bg-[#01509d] text-white`. Inactif = `border-[#e5e7eb] text-gray-600`.

---

## Composants de contenu (`components/`)

### CourseCard
Thumbnail h-44 → badge LIVE (rouge, top-left) + date (blanc, top-right) → Badge niveau → titre bold → auteur (avatar 28px + nom + rôle) → footer : clock + durée | prix | bouton Réserver.

### GuideCard
Header h-36 gradient coloré (ou image) → Badge niveau → titre → description (line-clamp-2) → auteur → étoiles + vues + durée → footer : prix | bouton vert.

### PriceCard (sidebar achat)
Prix gros (`text-5xl Poppins`) + barré original → CTA fullWidth → note sécurité (Lock icon, centré, gris) → liste features (CheckCircle vert).

### TeacherCard
Titre "Votre professeur" → avatar 80×80 rounded-xl gris → nom + badge "Professeur vérifié" (vert) → bio → tags (liens texte bleu) → bouton outline "Voir tous ses cours".

### Card (carte Pokémon produit)
`aspect-[2/3]` rounded-xl → hover `-translate-y-1 shadow-lg` → nom bold `#140759` → stock (vert/rouge) → "A partir de X€" (gris + bold navy). Bouton panier visible au hover.

### Footer
`bg-[#0d1b3e]` → logo GraduationCap + titre Poppins → description + 4 icônes sociales (bg/10 → hover `#01509d`) → colonnes Plateforme / Informations → copyright.

---

## Patterns de pages

### Page listing (cartes, decks, ateliers…)
```
Hero Navbar
─────────────────────────────────────────
[SearchBar + filtres]
─────────────────────────────────────────
[Bannière featured (optionnel)]

[Grille 3 colonnes de cards]

[Pagination centré]
```

### Page détail produit (carte, deck, cours)
```
← Retour
─────────────────────────────────────────
[col 2/3 — contenu]          [col 1/3 — sidebar sticky]
  Hero image                   PriceCard
  Description                  Infos (format, niveau…)
  Stratégie / modules          Features list
  Decklist / contenu           CTA
  TeacherCard
```

### Formulaire multi-étapes (candidature)
```
Progress bar (4 étapes)
─────────────────────────────────────────
[Card blanche centré max-w-2xl]
  Titre étape
  Champs
  [Précédent] [Suivant →]
```

### Dashboard (espace joueur)
```
[Sidebar gauche — 6 tabs]  |  [Contenu principal]
  Dashboard                    Stats cards (4)
  Mes cours                    Section coaching
  Mes decks                    Commandes récentes
  Wallet                       Aperçu decklists
  Tournois
  Profil
```

---

## Inputs & Forms

```
input / select / textarea :
  bg-white border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm
  focus:ring-2 focus:ring-[#01509d]/30 focus:border-[#01509d]
  placeholder:text-[#9ca3af] outline-none

label :
  text-sm font-semibold text-[#140759] mb-1.5
```

---

## Navbar — pageTitles connus

```ts
"/":                    { title: "...", subtitle: "..." }
"/apprendre":           "Explorer les cours"
"/progresser":          "Progresser"
"/sequiper":            "S'équiper"
"/sequiper/cartes":     "Cartes à l'unité"
"/sequiper/decks":      "Decks préconstruits"
"/sequiper/accessoires":"Accessoires"
"/sequiper/builder":    "Deck Builder"
"/professeur":          "Devenir Professeur"
"/professeur/candidature": "Candidature Professeur"
"/progresser/coaching": "Coaching Individuel"
"/progresser/ateliers": "Ateliers"
"/progresser/tournois": "Tournois"
"/espace-joueur":       "Espace Joueur"
```
