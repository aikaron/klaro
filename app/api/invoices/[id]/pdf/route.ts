import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { InvoiceDocument } from '@/lib/pdf/invoice-document'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: invoice } = await supabase
    .from('invoices')
    .select(
      'number, type, issue_date, due_date, clients(name, email, address), invoice_items(description, quantity, unit_price)'
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!invoice) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, address, siret, plan, logo_url')
    .eq('id', user.id)
    .single()

  const client = invoice.clients as unknown as { name: string; email: string; address: string }

  const buffer = await renderToBuffer(
    InvoiceDocument({
      invoice: {
        number: invoice.number,
        type: invoice.type as 'invoice' | 'quote',
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        company_name: profile?.company_name,
        company_address: profile?.address,
        company_siret: profile?.siret,
        company_logo_url: profile?.logo_url,
        plan: (profile?.plan as 'free' | 'pro') ?? 'free',
        client,
        items: invoice.invoice_items ?? [],
      },
    })
  )

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${invoice.number}.pdf"`,
    },
  })
}
