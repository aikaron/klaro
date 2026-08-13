import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InvoiceEditForm } from './invoice-edit-form'

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('id, client_id, due_date, status, invoice_items(description, quantity, unit_price)')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!invoice) notFound()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .eq('user_id', user!.id)
    .order('name')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Modifier</h1>
      <InvoiceEditForm
        invoiceId={invoice.id}
        clients={clients ?? []}
        currentClientId={invoice.client_id}
        currentDueDate={invoice.due_date ?? ''}
        initialItems={invoice.invoice_items ?? []}
      />
    </div>
  )
}
