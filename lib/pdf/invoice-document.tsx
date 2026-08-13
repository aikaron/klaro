import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica', color: '#1e293b' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 20, fontWeight: 700 },
  label: { color: '#64748b', fontSize: 9, marginBottom: 2 },
  block: { marginBottom: 20 },
  table: { marginTop: 10 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 6 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 6, fontWeight: 700 },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'right' },
  colPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 },
  totalLabel: { fontSize: 13, fontWeight: 700, marginRight: 10 },
  totalValue: { fontSize: 13, fontWeight: 700 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, color: '#94a3b8' },
  watermark: {
    position: 'absolute',
    top: '45%',
    left: '15%',
    fontSize: 60,
    color: '#f1f5f9',
    transform: 'rotate(-30deg)',
    zIndex: -1,
  },
})

const eur = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

export type InvoiceForPdf = {
  number: string
  type: 'invoice' | 'quote'
  issue_date: string
  due_date: string | null
  company_name?: string | null
  company_address?: string | null
  company_siret?: string | null
  plan?: 'free' | 'pro'
  client: { name: string; email?: string | null; address?: string | null }
  items: { description: string; quantity: number; unit_price: number }[]
}

export function InvoiceDocument({ invoice }: { invoice: InvoiceForPdf }) {
  const total = invoice.items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0)
  const isFree = invoice.plan !== 'pro'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isFree && <Text style={styles.watermark}>KLARO</Text>}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{invoice.type === 'quote' ? 'DEVIS' : 'FACTURE'}</Text>
            <Text>{invoice.company_name || 'Klaro'}</Text>
            {invoice.company_address && <Text style={styles.label}>{invoice.company_address}</Text>}
            {invoice.company_siret && <Text style={styles.label}>SIRET : {invoice.company_siret}</Text>}
          </View>
          <View>
            <Text style={styles.label}>Numéro</Text>
            <Text>#{invoice.number}</Text>
            <Text style={styles.label}>Date</Text>
            <Text>{invoice.issue_date}</Text>
            {invoice.due_date && (
              <>
                <Text style={styles.label}>Échéance</Text>
                <Text>{invoice.due_date}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Facturé à</Text>
          <Text>{invoice.client.name}</Text>
          {invoice.client.email && <Text>{invoice.client.email}</Text>}
          {invoice.client.address && <Text>{invoice.client.address}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qté</Text>
            <Text style={styles.colPrice}>Prix unitaire</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {invoice.items.map((it, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.colDesc}>{it.description}</Text>
              <Text style={styles.colQty}>{it.quantity}</Text>
              <Text style={styles.colPrice}>{eur(it.unit_price)}</Text>
              <Text style={styles.colTotal}>{eur(it.quantity * it.unit_price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{eur(total)}</Text>
        </View>

        {isFree && (
          <Text style={styles.footer}>
            Document généré gratuitement avec Klaro
          </Text>
        )}
      </Page>
    </Document>
  )
}
