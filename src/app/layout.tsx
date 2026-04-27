import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/api/wordpress'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { organizationJsonLd } from '@/lib/utils/metadata'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'BR Stockholm Bil — Begagnade bilar i Farsta',
    template: '%s | BR Stockholm Bil',
  },
  description: 'Oberoende bilhandlare i Farsta, Stockholm. Noggrant utvalda begagnade bilar med transparent prissättning och enkel finansiering via DNB Finans och Mymoney.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.brstockholmbil.se'),
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="sv">
      <head>
        {/* AdSense script — only injected when publisher ID is configured */}
        {settings?.ads_enabled && settings?.adsense_publisher_id && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsense_publisher_id}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Organization structured data */}
        {settings && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd(settings)),
            }}
          />
        )}
      </head>
      <body className="bg-white text-stone-900 antialiased">
        <SiteHeader dealershipName={settings?.dealership_name} />
        <main>{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  )
}
