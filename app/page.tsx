import Link from 'next/link'

const features = [
  {
    title: 'Devis & factures en 2 minutes',
    text: 'Crée un devis ou une facture professionnelle, exportable en PDF, sans te battre avec Word ou Excel.',
  },
  {
    title: 'Suivi des paiements',
    text: 'Vois en un coup d’œil qui a payé, qui est en retard, et relance tes clients sans effort.',
  },
  {
    title: 'Tableau de bord clair',
    text: 'Ton chiffre d’affaires du mois, tes factures en attente et tes impayés, sur un seul écran.',
  },
]

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '',
    features: ['5 factures / mois', 'Export PDF avec filigrane MonKlaro', 'Clients illimités'],
    cta: 'Commencer gratuitement',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '9€',
    period: '/mois',
    features: ['Factures & devis illimités', 'Logo personnalisé sur les PDF', 'Relances automatiques'],
    cta: 'Essayer Pro',
    href: '/signup',
  },
]

export default function Home() {
  return (
    <div className="flex-1 bg-white text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-bold text-indigo-600">MonKlaro</span>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            Connexion
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Créer un compte
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Fini les factures bricolées sous Word.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          MonKlaro est l&apos;outil de devis et factures pensé pour les auto-entrepreneurs et
          freelances français. Crée, envoie, suis tes paiements — en quelques clics.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Essayer gratuitement
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-400">Aucune carte bancaire requise</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 p-6">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Tarifs simples</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-xl border border-slate-200 p-8">
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                {plan.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className="mt-8 block rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} MonKlaro
      </footer>
    </div>
  )
}
