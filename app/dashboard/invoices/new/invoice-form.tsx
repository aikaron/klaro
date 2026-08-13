'use client'

import { useState } from 'react'
import { createInvoice } from '../actions'

type Client = { id: string; name: string }

export function InvoiceForm({ clients }: { clients: Client[] }) {
  const [items, setItems] = useState([{ id: 0 }])

  return (
    <form action={createInvoice} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
          <select name="type" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="invoice">Facture</option>
            <option value="quote">Devis</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
          <select
            name="client_id"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Choisir un client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Échéance</label>
          <input
            type="date"
            name="due_date"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Prestations</label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={item.id} className="grid grid-cols-12 gap-2">
              <input
                name="item_description"
                placeholder="Description"
                className="col-span-6 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="item_quantity"
                type="number"
                step="0.01"
                defaultValue={1}
                placeholder="Qté"
                className="col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="item_price"
                type="number"
                step="0.01"
                placeholder="Prix unitaire (€)"
                className="col-span-4 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, { id: prev.length }])}
          className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          + Ajouter une ligne
        </button>
      </div>

      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Créer
      </button>
    </form>
  )
}
