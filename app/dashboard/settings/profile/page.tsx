import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { updateProfile, uploadLogo } from './actions'

const errorMessages: Record<string, string> = {
  pro_required: 'Le logo personnalisé est réservé au plan Pro.',
  no_file: 'Choisis un fichier avant de valider.',
  invalid_type: 'Le fichier doit être une image (PNG, JPG...).',
  upload_failed: "L'envoi a échoué, réessaie.",
}

export default async function ProfileSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, full_name, address, siret, plan, logo_url')
    .eq('id', user!.id)
    .single()

  const isPro = profile?.plan === 'pro'

  return (
    <div className="max-w-xl">
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">Mon entreprise</h1>
      <p className="mb-6 text-sm text-slate-500">
        Ces informations apparaissent sur tes devis et factures PDF.
      </p>

      {success === '1' && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Informations enregistrées.
        </p>
      )}
      {success === 'logo' && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Logo mis à jour.
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessages[error] ?? 'Une erreur est survenue.'}
        </p>
      )}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-slate-900">Logo</h2>
        <p className="mb-4 text-sm text-slate-500">Affiché en haut de tes devis et factures PDF.</p>

        {profile?.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.logo_url}
            alt="Logo actuel"
            className="mb-4 h-16 w-auto rounded border border-slate-200 object-contain p-2"
          />
        )}

        {isPro ? (
          <form action={uploadLogo} className="flex items-center gap-3">
            <input
              type="file"
              name="logo"
              accept="image/*"
              required
              className="text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            />
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Envoyer
            </button>
          </form>
        ) : (
          <p className="text-sm text-slate-500">
            Réservé au plan Pro.{' '}
            <Link href="/dashboard/settings/billing" className="text-indigo-600 underline">
              Passer au plan Pro
            </Link>
          </p>
        )}
      </div>

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
