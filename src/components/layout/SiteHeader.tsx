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
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-stone-200/80'
          : 'bg-white/30 backdrop-blur-lg border-b border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controlled-height row — position:relative so absolute nav is anchored here */}
        <div
          className={`relative flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 z-10"
            aria-label={dealershipName ?? 'BR Stockholm Bil'}
          >
            <img
              src="/logo.png"
              alt={dealershipName ?? 'BR Stockholm Bil'}
              className={`w-auto transition-all duration-500 ease-out ${
                scrolled
                  ? 'h-8 sm:h-9 scale-95'
                  : 'h-11 sm:h-13 scale-105'
              }`}
            />
          </Link>

          {/*
            Desktop nav — two positions:
              top:      static in normal flow, aligned right (justify-between pushes it right)
              scrolled: absolute, centered horizontally in the header row

            Switching between these via conditional classes.
            Both states keep items-center so vertical alignment tracks the row height.
          */}
          <nav
            className={`hidden md:flex items-center gap-7 transition-all duration-500 ${
              scrolled
                ? 'absolute left-1/2 -translate-x-1/2'
                : 'static translate-x-0'
            }`}
            aria-label="Huvudnavigation"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-medium tracking-wide transition-all duration-500 whitespace-nowrap ${
                  scrolled ? 'text-sm' : 'text-base'
                } ${
                  pathname?.startsWith(href)
                    ? 'text-stone-900'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button — always right-aligned, z-10 so it stays above abs nav */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-stone-300/60 text-stone-700 hover:bg-white/60 transition-colors z-10"
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