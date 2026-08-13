import Stripe from 'stripe'

let _stripe: Stripe | undefined

// Instanciation paresseuse : évite de planter le build quand STRIPE_SECRET_KEY
// n'est pas encore configurée (elle n'est nécessaire qu'à l'exécution des routes Stripe).
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return _stripe
}
