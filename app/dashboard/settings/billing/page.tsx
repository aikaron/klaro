import { createClient } from '@/lib/supabase/server'
import { UpgradeButton, ManageBillingButton } from './billing-buttons'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; limit?: string }>
}) {
  const { success, canceled, limit } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user!.id)
    .single()

  const isPro = profile?.plan === 'pro'

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Abonnement</h1>

      {success && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Abonnement activé, merci !
        </p>
      )}
      {canceled && (
        <p className="mb-4 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">
          Paiement annulé.
        </p>
      )}
      {limit && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Limite de 5 factures/mois atteinte sur le plan gratuit — passe au plan Pro pour continuer.
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Plan actuel</p>
        <p className="mb-4 text-xl font-bold text-slate-900">{isPro ? 'Pro' : 'Gratuit'}</p>

        {isPro ? (
          <ManageBillingButton />
        ) : (
          <div>
            <ul className="mb-4 list-disc pl-5 text-sm text-slate-600">
              <li>Factures et devis illimités</li>
              <li>Logo personnalisé sur les PDF</li>
              <li>Relances automatiques</li>
            </ul>
            <UpgradeButton />
          </div>
        )}
      </div>
    </div>
  )
}
