'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

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
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-sm border-b border-stone-200'
          : 'bg-white/70 backdrop-blur-md border-b border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*
          The row itself changes height via h-* classes.
          Both logo and nav are items-center inside this flex row,
          so they always stay vertically centered regardless of height.
          transition-all on the row animates the height change smoothly.
        */}
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-14' : 'h-20'
          }`}
        >
          {/* Logo — height transitions with the header */}
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label={dealershipName ?? 'BR Stockholm Bil'}
          >
            <img
              src="/logo.png"
              alt={dealershipName ?? 'BR Stockholm Bil'}
              className={`w-auto transition-all duration-300 ease-out ${
                scrolled ? 'h-8' : 'h-12'
              }`}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Huvudnavigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-base font-medium tracking-wide transition-colors ${
                  pathname?.startsWith(href)
                    ? 'text-stone-900'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white shadow-sm">
          <nav
            className="max-w-7xl mx-auto px-4 py-2 flex flex-col"
            aria-label="Mobilnavigation"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`py-3 text-base font-medium tracking-wide border-b border-stone-100 last:border-b-0 transition-colors ${
                  pathname?.startsWith(href)
                    ? 'text-stone-900'
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