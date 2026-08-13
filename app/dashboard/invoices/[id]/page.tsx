import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateInvoiceStatus } from '../actions'

function formatEUR(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}

export default async function InvoiceDetailPage({
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
    .select('id, number, type, status, issue_date, due_date, clients(name, email, address), invoice_items(id, description, quantity, unit_price)')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!invoice) notFound()

  const client = invoice.clients as unknown as { name: string; email: string; address: string } | null
  const items = invoice.invoice_items ?? []
  const total = items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0)

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {invoice.type === 'quote' ? 'Devis' : 'Facture'} #{invoice.number}
        </h1>
        <div className="flex gap-2">
          {invoice.status === 'draft' && (
            <Link
              href={`/dashboard/invoices/${invoice.id}/edit`}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Modifier
            </Link>
          )}
          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Télécharger le PDF
          </a>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Client</p>
        <p className="font-medium text-slate-900">{client?.name}</p>
        <p className="text-sm text-slate-600">{client?.email}</p>
        <p className="text-sm text-slate-600">{client?.address}</p>
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Qté</th>
              <th className="px-4 py-3">Prix unitaire</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{it.description}</td>
                <td className="px-4 py-3">{it.quantity}</td>
                <td className="px-4 py-3">{formatEUR(it.unit_price)}</td>
                <td className="px-4 py-3">{formatEUR(it.quantity * it.unit_price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 font-semibold">
              <td className="px-4 py-3" colSpan={3}>
                Total
              </td>
              <td className="px-4 py-3">{formatEUR(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Statut :</span>
        {['draft', 'sent', 'paid', 'overdue'].map((s) => (
          <form key={s} action={updateInvoiceStatus}>
            <input type="hidden" name="id" value={invoice.id} />
            <input type="hidden" name="status" value={s} />
            <button
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                invoice.status === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {{ draft: 'Brouillon', sent: 'Envoyée', paid: 'Payée', overdue: 'En retard' }[s]}
            </button>
          </form>
        ))}
      </div>
    </div>
  )
}
