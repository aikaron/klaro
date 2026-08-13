import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonKlaro — Devis et factures pour indépendants",
  description:
    "Crée tes devis et factures en quelques clics, suis tes paiements et ton chiffre d'affaires. Fait pour les auto-entrepreneurs et freelances.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
