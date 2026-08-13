import { Resend } from 'resend'

let _resend: Resend | undefined

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!)
  }
  return _resend
}

// Domaine partagé de test Resend — fonctionne sans vérifier de nom de domaine.
export const REMINDER_FROM = 'MonKlaro <onboarding@resend.dev>'
