'use client'

import { useState } from 'react'
import { updateInvoice } from './actions'

type Client = { id: string; name: string }
type Item = { description: string; quantity: number; unit_price: number }

export function InvoiceEditForm({
  invoiceId,
  clients,
  currentClientId,
  currentDueDate,
  initialItems,
}: {
  invoiceId: string
  clients: Client[]
  currentClientId: string
  currentDueDate: string
  initialItems: Item[]
}) {
  const [items, setItems] = useState(
    initialItems.length > 0 ? initialItems : [{ description: '', quantity: 1, unit_price: 0 }]
  )

  return (
    <form action={updateInvoice} className="max-w-2xl space-y-6">
      <input type="hidden" name="id" value={invoiceId} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
          <select
            name="client_id"
            required
            defaultValue={currentClientId}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
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
            defaultValue={currentDueDate}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Prestations</label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                name="item_description"
                placeholder="Description"
                defaultValue={item.description}
                className="col-span-6 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="item_quantity"
                type="number"
                step="0.01"
                defaultValue={item.quantity}
                placeholder="Qté"
                className="col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="item_price"
                type="number"
                step="0.01"
                defaultValue={item.unit_price}
                placeholder="Prix unitaire (€)"
                className="col-span-4 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, { description: '', quantity: 1, unit_price: 0 }])}
          className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          + Ajouter une ligne
        </button>
      </div>

      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Enregistrer les modifications
      </button>
    </form>
  )
}
