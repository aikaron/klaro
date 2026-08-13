# Klaro

Devis & factures pour indépendants — Next.js 16 + Supabase (auth + base de données) + Stripe (abonnements).

## 1. Lancer en local

```bash
npm install
cp .env.local.example .env.local   # puis remplis les clés (étapes ci-dessous)
npm run dev
```

Ouvre http://localhost:3000

## 2. Configurer Supabase (gratuit)

1. Crée un compte et un projet sur https://supabase.com
2. Dans **Project Settings > API**, copie :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secret, ne jamais exposer côté client)
3. Dans **SQL Editor**, colle et exécute le contenu de [`supabase/schema.sql`](./supabase/schema.sql). Ça crée les tables (profils, clients, factures) et la sécurité par utilisateur (RLS).
4. Dans **Authentication > Providers**, l'auth par email/mot de passe est activée par défaut — rien à faire.

## 3. Configurer Stripe (gratuit pour tester)

1. Crée un compte sur https://stripe.com (mode test au départ, pas besoin de vraie carte)
2. Dans **Product catalog**, crée un produit "Facturo Pro" avec un prix récurrent mensuel (ex. 9€) → copie l'ID du prix (`price_...`) dans `STRIPE_PRICE_ID_PRO`
3. Dans **Developers > API keys**, copie la clé secrète dans `STRIPE_SECRET_KEY`
4. Dans **Developers > Webhooks**, ajoute un endpoint pointant vers `https://ton-domaine/api/stripe/webhook`, écoute au minimum `checkout.session.completed` et `customer.subscription.deleted`, copie le "Signing secret" dans `STRIPE_WEBHOOK_SECRET`
   - En local, utilise `stripe listen --forward-to localhost:3000/api/stripe/webhook` (CLI Stripe) pour tester les webhooks

## 4. Mettre en ligne (Vercel, gratuit)

1. Pousse le code sur un dépôt GitHub
2. Sur https://vercel.com, importe le dépôt
3. Ajoute toutes les variables de `.env.local` dans les réglages du projet Vercel (Environment Variables), avec `NEXT_PUBLIC_SITE_URL` = ton domaine Vercel
4. Déploie — Vercel te donne une URL en `https://....vercel.app` accessible dans n'importe quel navigateur
5. Reviens dans Stripe pour mettre à jour l'URL du webhook avec ton domaine définitif

## Structure du projet

- `app/` — pages (landing, login, signup, dashboard)
- `app/dashboard/` — application (clients, factures, abonnement)
- `app/api/stripe/` — checkout, portail client, webhook
- `app/api/invoices/[id]/pdf/` — génération du PDF
- `lib/supabase/` — clients Supabase (navigateur, serveur, admin)
- `supabase/schema.sql` — schéma de base de données à exécuter dans Supabase
- `proxy.ts` — protège les routes `/dashboard` (redirige vers `/login` si non connecté)

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth) · Stripe (abonnements) · @react-pdf/renderer (PDF)
