import Link from 'next/link'
import type { SiteSettings } from '@/types'

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-200 bg-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="font-medium text-stone-900 mb-3">
              {settings?.dealership_name ?? 'BR Stockholm Bil'}
            </p>
            <p className="text-sm text-stone-500 leading-relaxed">
              {settings?.footer_text ?? 'Oberoende bilhandlare i Farsta, Stockholm. Vi hjälper privatpersoner och företag att hitta rätt bil.'}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Navigera</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/vehicles', label: 'Bilar till salu' },
                { href: '/collector', label: 'Samlarsektionen' },
                { href: '/blog', label: 'Nyheter' },
                { href: '/about', label: 'Om oss' },
                { href: '/contact', label: 'Kontakt' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Kontakt</p>
            <div className="flex flex-col gap-2">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                >
                  {settings.phone}
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                >
                  {settings.email}
                </a>
              )}
              {settings?.address && (
                <p className="text-sm text-stone-500">
                  {settings.address}
                </p>
              )}
            </div>

            {/* Social */}
            {(settings?.social_instagram || settings?.social_facebook) && (
              <div className="flex gap-4 mt-5">
                {settings?.social_instagram && (
                  <a
                    href={settings.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-400 hover:text-stone-900 transition-colors tracking-wide"
                  >
                    Instagram
                  </a>
                )}
                {settings?.social_facebook && (
                  <a
                    href={settings.social_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-400 hover:text-stone-900 transition-colors tracking-wide"
                  >
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-stone-400">
            © {year} {settings?.dealership_name ?? 'BR Stockholm Bil'}. Alla rättigheter förbehållna.
          </p>
          {settings?.affiliate_disclosure && (
            <p className="text-xs text-stone-400 max-w-sm text-right">
              {settings.affiliate_disclosure}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
