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

export async function uploadLogo(formData: FormData) {
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
    redirect('/dashboard/settings/profile?error=pro_required')
  }

  const file = formData.get('logo') as File
  if (!file || file.size === 0) {
    redirect('/dashboard/settings/profile?error=no_file')
  }

  if (!file.type.startsWith('image/')) {
    redirect('/dashboard/settings/profile?error=invalid_type')
  }

  const extension = file.name.split('.').pop() || 'png'
  const path = `${user.id}/logo.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    redirect('/dashboard/settings/profile?error=upload_failed')
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('logos').getPublicUrl(path)

  await supabase
    .from('profiles')
    .update({ logo_url: `${publicUrl}?v=${Date.now()}` })
    .eq('id', user.id)

  revalidatePath('/dashboard/settings/profile')
  redirect('/dashboard/settings/profile?success=logo')
}
