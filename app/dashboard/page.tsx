import { createClient } from '@/lib/supabase/server'

function formatEUR(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}

export default async function DashboardOverview() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, status, type, issue_date, invoice_items(quantity, unit_price)')
    .eq('user_id', user!.id)

  const list = invoices ?? []

  const total = (inv: (typeof list)[number]) =>
    (inv.invoice_items ?? []).reduce((sum, it) => sum + it.quantity * it.unit_price, 0)

  const thisMonth = new Date().toISOString().slice(0, 7)
  const revenueThisMonth = list
    .filter((i) => i.type === 'invoice' && i.status === 'paid' && i.issue_date.startsWith(thisMonth))
    .reduce((sum, i) => sum + total(i), 0)

  const pending = list.filter((i) => i.type === 'invoice' && i.status === 'sent')
  const overdue = list.filter((i) => i.type === 'invoice' && i.status === 'overdue')

  const cards = [
    { label: 'Chiffre d’affaires (mois)', value: formatEUR(revenueThisMonth) },
    { label: 'Factures en attente', value: pending.length },
    { label: 'Factures en retard', value: overdue.length },
    { label: 'Total factures', value: list.filter((i) => i.type === 'invoice').length },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Vue d&apos;ensemble</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
