import { createClient } from '@/lib/supabase/server'
import { updateProfile } from './actions'

export default async function ProfileSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, full_name, address, siret')
    .eq('id', user!.id)
    .single()

  return (
    <div className="max-w-xl">
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">Mon entreprise</h1>
      <p className="mb-6 text-sm text-slate-500">
        Ces informations apparaissent sur tes devis et factures PDF.
      </p>

      {success && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Informations enregistrées.
        </p>
      )}

      <form action={updateProfile} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nom de l&apos;entreprise</label>
          <input
            name="company_name"
            defaultValue={profile?.company_name ?? ''}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nom complet</label>
          <input
            name="full_name"
            defaultValue={profile?.full_name ?? ''}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Adresse</label>
          <input
            name="address"
            defaultValue={profile?.address ?? ''}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">SIRET</label>
          <input
            name="siret"
            defaultValue={profile?.siret ?? ''}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Enregistrer
        </button>
      </form>
    </div>
  )
}
