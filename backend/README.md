# 📚 Documentation Technique - L'Académie des Dresseurs

## 🔢 Calculs et Règles Métier

### 💶 Calcul de la TVA (Taxe sur la Valeur Ajoutée)

**Taux appliqué :** 20% (France)

```javascript
// Formule
const tax = (subtotal + shippingCost) * 0.20;
```

**Exemple :**
- Sous-total : 50€
- Frais de port : 4,99€
- Base taxable : 54,99€
- TVA (20%) : 10,998€ → **11€**
- Total TTC : 65,99€

**Important :**
- La TVA est calculée sur le sous-total + frais de port
- Les réductions sont appliquées AVANT le calcul de la TVA
- Arrondi à 2 décimales avec `.toFixed(2)`

---

### 📦 Frais de Port

**Grille tarifaire :**

| Montant du panier | Frais de port |
|-------------------|---------------|
| < 50€             | 4,99€         |
| 50€ - 99,99€      | 2,99€         |
| ≥ 100€            | **GRATUIT**   |

```javascript
let shippingCost = 0;
if (subtotal < 50) {
  shippingCost = 4.99;
} else if (subtotal < 100) {
  shippingCost = 2.99;
}
// Sinon gratuit
```

**À implémenter (Phase 2) :**
- Points relais (Mondial Relay, Chronopost)
- Livraison express (+5€)
- International (à définir selon zone)

---

### 🎟️ Codes Promotionnels

**Types de réductions :**

1. **Pourcentage** : `-X%` sur le sous-total
2. **Montant fixe** : `-X€` sur le sous-total

**Application :**
```javascript
let discount = 0;
if (promoCode.discountType === 'percentage') {
  discount = subtotal * (promoCode.value / 100);
} else if (promoCode.discountType === 'fixed') {
  discount = promoCode.value;
}

// Ne jamais dépasser le sous-total
discount = Math.min(discount, subtotal);
```

**Ordre de calcul :**
1. Sous-total des articles
2. Application du code promo → **Sous-total réduit**
3. Ajout des frais de port
4. Calcul de la TVA sur (sous-total réduit + port)
5. **Total TTC final**

**À implémenter :**
- Validation des codes (date d'expiration, usage unique)
- Limite d'utilisation par utilisateur
- Montant minimum requis
- Catégories éligibles

---

### 📊 Gestion du Stock

**Règles de disponibilité :**

| Stock     | Statut          | Affichage                    |
|-----------|-----------------|------------------------------|
| 0         | `out-of-stock`  | "Rupture de stock"           |
| 1-5       | `low-stock`     | "Stock limité (X restants)"  |
| 6-10      | `low-stock`     | "Derniers articles"          |
| > 10      | `available`     | "En stock"                   |

**Déduction du stock :**
- ❌ **PAS** à la création de la commande
- ✅ **OUI** quand la commande passe à `confirmed` ET paiement `completed`
- ✅ **Restauration** en cas d'annulation ou de remboursement

**Important :**
- Le stock est vérifié avant la création de la commande
- Les articles sont "réservés" virtuellement pendant 15 minutes (à implémenter)
- Après 15 min sans paiement, la commande est annulée automatiquement

---

### 🔢 Numérotation des Commandes

**Format :** `ADD-YYMM-XXXX`

**Exemple :** `ADD-2601-1234`
- `ADD` : Acronyme du site
- `26` : Année (2026)
- `01` : Mois (janvier)
- `1234` : Numéro aléatoire unique (4 chiffres)

**Génération :**
```javascript
const year = date.getFullYear().toString().slice(-2);
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
orderNumber = `ADD-${year}${month}-${random}`;
```

**Vérification de l'unicité** avant sauvegarde en base.

---

### 🛒 Composition du Panier

**Types d'articles acceptés :**
1. **Cartes** (`card`) - Prix unitaire
2. **Decks** (`deck`) - Prix fixe du deck complet
3. **Accessoires** (`accessory`) - Prix unitaire

**Snapshot des données :**
À la création de la commande, on sauvegarde :
- Nom de l'article
- Prix au moment de l'achat
- Image
- Description
- Infos spécifiques (setCode, cardNumber pour les cartes)

**Pourquoi ?**
- Les prix peuvent changer après la commande
- L'historique doit refléter ce qui a été acheté
- Preuves légales en cas de litige

---

### 💳 Méthodes de Paiement

**Supportées :**
1. **Stripe** (cartes bancaires, Apple Pay, Google Pay)
2. **PayPal**

**Process de paiement :**

```
1. Création de la commande (status: pending, payment: pending)
   ↓
2. Création de l'intention de paiement (Stripe) ou commande PayPal
   ↓
3. Redirection vers la page de paiement
   ↓
4. Confirmation du paiement via webhook
   ↓
5. Mise à jour de la commande (payment: completed)
   ↓
6. Confirmation de la commande (status: confirmed)
   ↓
7. Déduction du stock
```

**Important :**
- Ne JAMAIS faire confiance au frontend pour confirmer un paiement
- Toujours attendre le webhook pour valider
- Vérifier la signature du webhook (sécurité)

**Variables d'environnement requises :**
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

---

### 📧 Notifications Email

**Emails automatiques à envoyer :**

1. **Confirmation de commande** (immédiat)
   - Numéro de commande
   - Récapitulatif des articles
   - Montant total
   - Adresse de livraison

2. **Confirmation de paiement** (après webhook)
   - Paiement validé
   - Lien de suivi

3. **Expédition** (quand status = shipped)
   - Numéro de suivi
   - Transporteur
   - Lien de tracking

4. **Livraison** (quand status = delivered)
   - Confirmation de réception
   - Demande d'avis

**À implémenter avec :**
- SendGrid / Mailgun / Brevo (ex-Sendinblue)
- Templates HTML responsive
- Variables dynamiques

---

### 🔐 Sécurité et RGPD

**Données sensibles :**
- ❌ Ne **JAMAIS** stocker les numéros de carte
- ✅ Utiliser Stripe/PayPal pour gérer les paiements
- ✅ Hasher les mots de passe avec bcrypt (10 rounds minimum)
- ✅ JWT avec expiration (7 jours max)

**RGPD - Données collectées :**
- Email, nom, prénom, adresse
- Historique de commandes
- Préférences utilisateur
- Consentement pour les emails marketing

**Droits des utilisateurs :**
- Accès aux données (via API)
- Modification (profil)
- Suppression (anonymisation des commandes)
- Portabilité (export JSON)

**Conservation des données :**
- Comptes actifs : illimité
- Comptes inactifs > 3 ans : suppression
- Commandes : 10 ans (obligation légale comptable)

---

### 🎯 Limites et Validations

**Decks :**
- Minimum : 40 cartes
- Maximum : 60 cartes
- Maximum 4 exemplaires d'une même carte (sauf Energy de base)

**Commandes :**
- Montant minimum : 1€
- Montant maximum : 10 000€ (anti-fraude)
- Articles maximum par commande : 100

**Utilisateurs :**
- Pseudo : 3-30 caractères
- Mot de passe : 8 caractères minimum
- Email : format valide

**Cartes :**
- SetCode : 3 caractères (majuscules)
- CardNumber : format XX/XXX ou XXX/XXX
- Prix : 0,01€ - 5000€

---

### 🔄 Statuts des Commandes

**Cycle de vie :**

```
pending → confirmed → processing → shipped → delivered
   ↓
cancelled
   ↓
refunded
```

**Description :**

| Statut      | Description                                       | Actions possibles                |
|-------------|---------------------------------------------------|----------------------------------|
| `pending`   | Créée, en attente de paiement                     | Annuler, Payer                   |
| `locked`    | Paiement en cours, inventaire verrouillé          | Annuler, Payer, Echouer paiement |
| `confirmed` | Payée, en attente de traitement                   | Annuler (avec remboursement)     |
| `processing`| En cours de préparation                           | Expédier                         |
| `shipped`   | Expédiée, en transit                              | Marquer comme livrée             |
| `delivered` | Livrée au client                                  | -                                |
| `cancelled` | Annulée                                           | -                                |
| `refunded`  | Remboursée                                        | -                                |

---

### 📱 Application Mobile (Phase 2)

**Technologies :**
- React Native (iOS + Android)
- Expo (optionnel pour développement rapide)

**Spécificités :**
- Apple Pay / Google Pay natifs
- Notifications push (Firebase Cloud Messaging)
- Mode hors-ligne pour consultation des decks sauvegardés
- Scanner QR code pour import de decklist
- Synchronisation en temps réel avec l'API

---

### 🧪 Tests à Effectuer

**Tests de paiement (Stripe) :**
```
Carte de test : 4242 4242 4242 4242
Expiration : n'importe quelle date future
CVC : n'importe quel 3 chiffres
```

**Scénarios à tester :**
- ✅ Paiement réussi
- ❌ Paiement refusé (carte 4000 0000 0000 0002)
- ⏱️ Paiement en attente
- 💳 3D Secure (carte 4000 0027 6000 3184)
- 💰 Remboursement complet
- 💰 Remboursement partiel

---

### 📊 Métriques Importantes

**KPIs à suivre :**
- Taux de conversion (visiteurs → acheteurs)
- Panier moyen
- Taux d'abandon de panier
- Articles les plus vendus
- Revenus mensuels/annuels
- Taux de retour/remboursement
- Délai moyen de livraison

**Analytics à intégrer :**
- Google Analytics 4
- Facebook Pixel (publicités)
- Hotjar (comportement utilisateur)

---

## 🚀 À Implémenter en Priorité

### Phase 1 (MVP)
- [x] Modèles de base (User, Card, Deck, Accessory, Order)
- [x] Routes CRUD complètes
- [x] Authentification JWT
- [ ] Intégration Stripe réelle
- [ ] Envoi d'emails automatiques
- [ ] Deck-to-Stock Builder (parsing de listes)

### Phase 2
- [ ] Codes promo fonctionnels
- [ ] Intégration PayPal
- [ ] Gestion des transporteurs (API)
- [ ] Notifications push
- [ ] Application mobile
- [ ] Système d'avis/commentaires

### Phase 3
- [ ] Articles/Blog (Guides & Actualités)
- [ ] Système de tournois
- [ ] Recommandations personnalisées (ML)
- [ ] Programme de fidélité
- [ ] Cartes de crédit du site

---

## 📞 Support & Maintenance

**Logs à surveiller :**
- Erreurs de paiement
- Stocks négatifs (bug)
- Tentatives de connexion échouées
- Webhooks manqués

**Backups :**
- Base de données : quotidien (rétention 30 jours)
- Images : hebdomadaire
- Code : Git (automatique)

**Monitoring :**
- Uptime : UptimeRobot / Pingdom
- Performance : New Relic / Datadog
- Erreurs : Sentry

---

**Dernière mise à jour :** 2 janvier 2026
**Version :** 1.0.0
**Contact technique :** dev@academiedesdresseurs.fr
