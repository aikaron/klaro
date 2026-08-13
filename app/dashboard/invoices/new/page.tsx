import { createClient } from '@/lib/supabase/server'
import { InvoiceForm } from './invoice-form'

export default async function NewInvoicePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .eq('user_id', user!.id)
    .order('name')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Nouvelle facture / devis</h1>
      {(clients ?? []).length === 0 ? (
        <p className="text-slate-500">
          Ajoute d&apos;abord un client dans la section{' '}
          <a href="/dashboard/clients" className="text-indigo-600 underline">
            Clients
          </a>
          .
        </p>
      ) : (
        <InvoiceForm clients={clients ?? []} />
      )}
    </div>
  )
}
