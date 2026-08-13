'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase
    .from('profiles')
    .update({
      company_name: String(formData.get('company_name') || ''),
      full_name: String(formData.get('full_name') || ''),
      address: String(formData.get('address') || ''),
      siret: String(formData.get('siret') || ''),
    })
    .eq('id', user.id)

  revalidatePath('/dashboard/settings/profile')
  redirect('/dashboard/settings/profile?success=1')
}
