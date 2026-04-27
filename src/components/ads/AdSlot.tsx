/**
 * AdSlot — reusable ad placement component
 *
 * Design philosophy:
 * - Ad zones are named, not hardcoded to any network
 * - Rendering is deferred to the client (required for AdSense, GPT)
 * - Gracefully renders nothing when not enabled or slot ID is missing
 * - Does NOT feel cheap — proper spacing and container ensure ads sit cleanly
 */

'use client'

import { useEffect, useRef } from 'react'

export type AdSlotName =
  | 'article_top'
  | 'article_inline_1'
  | 'article_inline_2'
  | 'article_sidebar'
  | 'article_bottom'

interface AdSlotProps {
  slot: AdSlotName
  slotId: string           // AdSense slot ID or GPT ad unit path
  publisherId?: string     // AdSense publisher ID (ca-pub-XXXX)
  className?: string
  label?: boolean          // Show "Annons" label (required in Sweden by law)
}

/**
 * Usage:
 * <AdSlot slot="article_top" slotId="1234567890" publisherId="ca-pub-XXXXXXXXXXXXXXXX" />
 *
 * To swap ad provider: update this component only. Page templates remain unchanged.
 */
export function AdSlot({ slot, slotId, publisherId, className = '', label = true }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const initialised = useRef(false)

  useEffect(() => {
    if (initialised.current) return
    if (!slotId || !publisherId) return
    initialised.current = true

    try {
      // AdSense push — works once adsbygoogle script is loaded globally
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).adsbygoogle.push({})
    } catch {
      // AdSense not loaded — silently skip
    }
  }, [slotId, publisherId])

  // Nothing to show — return null cleanly, no empty placeholder divs
  if (!slotId) return null

  const sizeClasses: Record<AdSlotName, string> = {
    article_top: 'min-h-[90px] md:min-h-[90px]',
    article_inline_1: 'min-h-[250px]',
    article_inline_2: 'min-h-[250px]',
    article_sidebar: 'min-h-[600px] sticky top-8',
    article_bottom: 'min-h-[250px]',
  }

  return (
    <div
      className={`ad-slot ad-slot--${slot} ${className}`}
      data-slot={slot}
    >
      {label && (
        <p className="text-[10px] tracking-widest uppercase text-stone-400 text-center mb-1 select-none">
          Annons
        </p>
      )}
      <div ref={adRef} className={`w-full overflow-hidden ${sizeClasses[slot]}`}>
        {/* AdSense auto ad */}
        {publisherId && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={publisherId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
        {/* If no publisherId but slotId exists — treat as custom/GPT slot placeholder */}
        {!publisherId && (
          <div
            id={`ad-${slot}`}
            className={`w-full bg-stone-50 border border-stone-100 ${sizeClasses[slot]}`}
          />
        )}
      </div>
    </div>
  )
}

// ─── Affiliate Block ──────────────────────────────────────────────────────────

interface AffiliateBlockProps {
  headline: string
  description: string
  ctaLabel: string
  ctaUrl: string
  disclosure?: string
  imageUrl?: string
}

/**
 * Affiliate product/recommendation block.
 * Styled as editorial content — not a banner ad.
 * Naturally embedded in article flow between content sections.
 */
export function AffiliateBlock({
  headline,
  description,
  ctaLabel,
  ctaUrl,
  disclosure,
  imageUrl,
}: AffiliateBlockProps) {
  return (
    <aside
      className="my-10 border border-stone-200 rounded-sm p-6 bg-stone-50 not-prose"
      aria-label="Samarbetsinnehåll"
    >
      {disclosure && (
        <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-3">
          {disclosure}
        </p>
      )}
      <div className="flex gap-4 items-start">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={headline}
            className="w-20 h-20 object-cover rounded-sm flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h3 className="font-medium text-stone-900 mb-1">{headline}</h3>
          <p className="text-sm text-stone-600 mb-4 leading-relaxed">{description}</p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-900 border border-stone-900 px-4 py-2 hover:bg-stone-900 hover:text-white transition-colors duration-200"
          >
            {ctaLabel}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </aside>
  )
}

// ─── Native Promo Block ───────────────────────────────────────────────────────

interface NativePromoBlockProps {
  label: string        // e.g. "Sponsrat innehåll" or "Samarbete"
  headline: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
  brandName?: string
}

/**
 * Native/sponsored content block.
 * Visually distinct from editorial but not garish.
 * Left border accent distinguishes it clearly without screaming "ad".
 * Label is required — both for transparency and Swedish consumer law compliance.
 */
export function NativePromoBlock({
  label,
  headline,
  body,
  ctaLabel,
  ctaUrl,
  brandName,
}: NativePromoBlockProps) {
  return (
    <aside
      className="my-10 pl-5 border-l-2 border-stone-300 not-prose"
      aria-label="Sponsrat innehåll"
    >
      <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-3">
        {label}{brandName ? ` · ${brandName}` : ''}
      </p>
      <h3 className="font-medium text-stone-900 mb-2">{headline}</h3>
      <p className="text-sm text-stone-600 leading-relaxed mb-4">{body}</p>
      {ctaLabel && ctaUrl && (
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-sm text-stone-500 underline underline-offset-4 hover:text-stone-900 transition-colors"
        >
          {ctaLabel} →
        </a>
      )}
    </aside>
  )
}
