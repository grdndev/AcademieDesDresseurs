# Déploiement OVH (API-first) — Académie des Dresseurs

Ce projet est préparé pour une stratégie **backend durable** + **frontend remplaçable**.

## Objectif d'architecture

- Le backend (`/backend`) porte la logique métier et devient la source de vérité.
- Le frontend actuel (`/frontend`) est consommateur d'API et peut être remplacé plus tard.
- Le contrat API doit rester stable pour permettre migration web/mobile sans réécrire la logique serveur.

---

## 1) Variables d'environnement

### Backend
Copier `backend/.env.example` vers votre secret store OVH (ou fichier `.env` côté serveur).

Variables critiques :
- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGINS` (origines autorisées exactes)
- `TRUST_PROXY=true` (si reverse proxy OVH)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### Frontend
Copier `frontend/.env.example` selon votre cible :
- `NEXT_PUBLIC_API_URL=https://api.votre-domaine.tld/api`
- `NEXT_LOCAL_API_URL=http://api:5001/api` (container interco)

---

## 2) Topologie recommandée OVH

- `api.votre-domaine.tld` -> service Node backend (port interne 5001)
- `www.votre-domaine.tld` -> frontend Next.js
- MongoDB : service managé OVH ou VM isolée (non exposée publiquement)
- Reverse proxy TLS devant backend/frontend

---

## 2.1) Déploiement avec `docker-compose.prod.yml`

1. Copier le template d'environnement :
	- `cp .env.prod.example .env.prod`
2. Éditer `.env.prod` avec vos domaines/secret clés.
3. Lancer la stack de production :

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

4. Vérifier la configuration résolue (préflight utile CI/CD) :

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml config
```

---

## 2.2) Reverse proxy Nginx (domains `www` + `api`)

Fichiers ajoutés :
- `docker-compose.proxy.yml`
- `deploy/nginx/default.http.conf`
- `deploy/nginx/default.https.conf.example`

### Lancer stack + proxy

```bash
docker-compose --env-file .env.prod \
	-f docker-compose.prod.yml \
	-f docker-compose.proxy.yml \
	up -d --build
```

> Avec cette config, seuls les ports `80/443` (Nginx) sont exposés publiquement.
> Les services `api` et `frontend` restent internes au réseau Docker.

### Vérifier la configuration combinée

```bash
docker-compose --env-file .env.prod \
	-f docker-compose.prod.yml \
	-f docker-compose.proxy.yml \
	config
```

### Passer en HTTPS

1. Obtenir les certificats (Let's Encrypt / OVH managed cert).
2. Remplacer le fichier monté `default.http.conf` par `default.https.conf.example` (copié/renommé en `default.conf`).
3. Monter `/etc/letsencrypt` en lecture seule dans `docker-compose.proxy.yml`.

---

## 2.3) Checklist DNS OVH

- [ ] `A` record `academiedesdresseurs.fr` -> IP publique du serveur OVH
- [ ] `A` record `www.academiedesdresseurs.fr` -> même IP
- [ ] `A` record `api.academiedesdresseurs.fr` -> même IP
- [ ] TTL raisonnable (300s pendant migration, puis remonter)
- [ ] Firewall OVH : ports `80` et `443` ouverts
- [ ] Port `5001` non exposé publiquement si passage complet via Nginx

---

## 3) Reverse proxy (principes)

- Forcer HTTPS
- Transmettre `X-Forwarded-For`, `X-Forwarded-Proto`
- Timeouts adaptés (webhooks Stripe inclus)
- Limiter taille de body si nécessaire

Le backend supporte `TRUST_PROXY` pour lire correctement les en-têtes proxy.

---

## 4) Checklist de mise en production

- [ ] Secrets injectés (aucune clé en repo)
- [ ] `CORS_ORIGINS` restreint aux domaines réels
- [ ] `JWT_SECRET` robuste (>32 caractères aléatoires)
- [ ] Base Mongo sauvegardée (plan backup + restauration testée)
- [ ] Monitoring `/health` + alerting
- [ ] Rotation logs activée
- [ ] Webhook Stripe configuré vers `https://api.../api/payment/webhook`

---

## 5) Remplacement futur du frontend

Pour remplacer le frontend sans casser le système :

1. Garder les endpoints backend compatibles (`/api/orders`, `/api/payment/confirm`, etc.)
2. Versionner l'API en cas de rupture (`/api/v2/...`)
3. Documenter les payloads/erreurs côté backend
4. Préférer des changements additifs (nouveaux champs, pas suppression brutale)

---

## 6) Vérification rapide post-déploiement

```bash
curl -sS https://api.votre-domaine.tld/health
curl -sS https://api.votre-domaine.tld/api/cards?limit=1
```

Le script local `scripts/run-e2e.sh` reste utile pour valider le flux commande/paiement/stock en préproduction.
