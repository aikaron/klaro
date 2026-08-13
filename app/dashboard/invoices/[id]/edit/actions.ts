'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateInvoice(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = String(formData.get('id') || '')
  const clientId = String(formData.get('client_id') || '')
  const dueDate = String(formData.get('due_date') || '') || null

  const { error } = await supabase
    .from('invoices')
    .update({ client_id: clientId, due_date: dueDate })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  await supabase.from('invoice_items').delete().eq('invoice_id', id)

  const descriptions = formData.getAll('item_description') as string[]
  const quantities = formData.getAll('item_quantity') as string[]
  const prices = formData.getAll('item_price') as string[]

  const items = descriptions
    .map((description, i) => ({
      invoice_id: id,
      description,
      quantity: Number(quantities[i] || 0),
      unit_price: Number(prices[i] || 0),
    }))
    .filter((item) => item.description.trim() !== '')

  if (items.length > 0) {
    await supabase.from('invoice_items').insert(items)
  }

  revalidatePath(`/dashboard/invoices/${id}`)
  revalidatePath('/dashboard/invoices')
  redirect(`/dashboard/invoices/${id}`)
}
