import { createClient } from '@supabase/supabase-js'

// Client "service role" — usage strictement côté serveur (contourne les policies RLS).
// Utilisé uniquement par le webhook Stripe pour mettre à jour le plan d'un utilisateur.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
