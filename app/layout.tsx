import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AURA ROAST — La IA que te destruye con elegancia",
  description: "Subí tu foto. La IA analiza tu estética y te da el diagnóstico que nadie se atreve a darte.",
  metadataBase: new URL("https://roast.tuaura.com.ar"),
  openGraph: {
    title: "AURA ROAST",
    description: "La IA que te destruye con elegancia",
    url: "https://roast.tuaura.com.ar"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
