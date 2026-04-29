'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '/vehicles', label: 'Bilar till salu' },
  { href: '/collector', label: 'Premiumbilar' },
  { href: '/about', label: 'Om oss' },
  { href: '/contact', label: 'Kontakt' },
]

export function SiteHeader({ dealershipName }: { dealershipName?: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/95 backdrop-blur border-stone-200 shadow-sm'
          : 'bg-white/75 backdrop-blur-md border-white/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 sm:h-20">
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label={dealershipName ?? 'BR Stockholm Bil'}
          >
            <img
              src="/logo.png"
              alt={dealershipName ?? 'BR Stockholm Bil'}
              className={`w-auto transition-all duration-300 ${
                scrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-16'
              }`}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Huvudnavigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm tracking-wide transition-colors ${
                  pathname?.startsWith(href)
                    ? 'text-stone-900'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-stone-300 bg-white/70 text-stone-800 hover:bg-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col" aria-label="Mobilnavigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`py-3 text-base tracking-wide border-b border-stone-100 last:border-b-0 ${
                  pathname?.startsWith(href)
                    ? 'text-stone-900 font-medium'
                    : 'text-stone-500'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}