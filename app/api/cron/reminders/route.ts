import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getResend, REMINDER_FROM } from '@/lib/resend'

const eur = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data: overdueInvoices, error } = await supabase
    .from('invoices')
    .select(
      'id, number, due_date, user_id, clients(name, email), invoice_items(quantity, unit_price)'
    )
    .eq('type', 'invoice')
    .eq('status', 'sent')
    .lt('due_date', today)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const userIds = [...new Set((overdueInvoices ?? []).map((inv) => inv.user_id))]

  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id, plan, company_name').in('id', userIds)
    : { data: [] }

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]))

  const resend = getResend()
  let sent = 0
  let skipped = 0

  for (const invoice of overdueInvoices ?? []) {
    const profile = profileById.get(invoice.user_id)
    const client = invoice.clients as unknown as { name: string; email: string | null } | null

    if (profile?.plan !== 'pro' || !client?.email) {
      skipped++
      continue
    }

    const total = (invoice.invoice_items ?? []).reduce(
      (sum: number, it: { quantity: number; unit_price: number }) => sum + it.quantity * it.unit_price,
      0
    )

    await resend.emails.send({
      from: REMINDER_FROM,
      to: client.email,
      subject: `Rappel : facture ${invoice.number} en attente de paiement`,
      html: `
        <p>Bonjour ${client.name},</p>
        <p>Nous n'avons pas encore reçu le paiement de la facture <strong>${invoice.number}</strong>
        d'un montant de <strong>${eur(total)}</strong>, échue le ${invoice.due_date}.</p>
        <p>Merci de bien vouloir procéder au règlement dans les meilleurs délais.</p>
        <p>Cordialement,<br/>${profile.company_name || 'L’équipe'}</p>
      `,
    })

    await supabase.from('invoices').update({ status: 'overdue' }).eq('id', invoice.id)
    sent++
  }

  return NextResponse.json({ sent, skipped })
}
