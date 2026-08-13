'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createClientRecord(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('clients').insert({
    user_id: user.id,
    name: String(formData.get('name') || ''),
    email: String(formData.get('email') || ''),
    address: String(formData.get('address') || ''),
  })

  revalidatePath('/dashboard/clients')
}

export async function deleteClientRecord(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = String(formData.get('id') || '')
  await supabase.from('clients').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/dashboard/clients')
}
