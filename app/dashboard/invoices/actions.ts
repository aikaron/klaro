'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createInvoice(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'pro') {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'invoice')
      .gte('created_at', startOfMonth.toISOString())

    if ((count ?? 0) >= 5) {
      redirect('/dashboard/settings/billing?limit=1')
    }
  }

  const clientId = String(formData.get('client_id') || '')
  const type = String(formData.get('type') || 'invoice')
  const dueDate = String(formData.get('due_date') || '') || null

  const prefix = type === 'quote' ? 'DEV' : 'FAC'

  const { data: existing } = await supabase
    .from('invoices')
    .select('number')
    .eq('user_id', user.id)
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(1)

  const nextSeq = existing?.[0]?.number
    ? Number(existing[0].number.replace(/\D/g, '')) + 1
    : 1
  const nextNumber = `${prefix}-${String(nextSeq).padStart(4, '0')}`

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      client_id: clientId,
      type,
      number: nextNumber,
      due_date: dueDate,
      status: 'draft',
    })
    .select('id')
    .single()

  if (error || !invoice) {
    throw new Error(error?.message || 'Impossible de créer la facture')
  }

  const descriptions = formData.getAll('item_description') as string[]
  const quantities = formData.getAll('item_quantity') as string[]
  const prices = formData.getAll('item_price') as string[]

  const items = descriptions
    .map((description, i) => ({
      invoice_id: invoice.id,
      description,
      quantity: Number(quantities[i] || 0),
      unit_price: Number(prices[i] || 0),
    }))
    .filter((item) => item.description.trim() !== '')

  if (items.length > 0) {
    await supabase.from('invoice_items').insert(items)
  }

  revalidatePath('/dashboard/invoices')
  redirect(`/dashboard/invoices/${invoice.id}`)
}

export async function updateInvoiceStatus(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = String(formData.get('id') || '')
  const status = String(formData.get('status') || '')

  await supabase.from('invoices').update({ status }).eq('id', id).eq('user_id', user.id)

  revalidatePath(`/dashboard/invoices/${id}`)
  revalidatePath('/dashboard/invoices')
}
