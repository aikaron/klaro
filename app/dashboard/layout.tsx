import Link from 'next/link'
import { logout } from '@/app/lib/auth-actions'

const links = [
  { href: '/dashboard', label: 'Vue d’ensemble' },
  { href: '/dashboard/invoices', label: 'Factures & devis' },
  { href: '/dashboard/clients', label: 'Clients' },
  { href: '/dashboard/settings/profile', label: 'Mon entreprise' },
  { href: '/dashboard/settings/billing', label: 'Abonnement' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white">
        <div className="px-5 py-5">
          <span className="text-lg font-bold text-indigo-600">Klaro</span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="mt-6 px-3">
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            Se déconnecter
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
