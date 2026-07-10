import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import './globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'City Handloom — Premium Handloom Bedding from Kanpur',
  description: 'Shop the finest handloom bedsheets, curtains, quilts and more from City Handloom, Kanpur.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${lato.variable} font-body`}>
        {children}
      </body>
    </html>
  )
}