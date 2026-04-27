import type { Metadata } from 'next'
import type { Vehicle, Article, SiteSettings } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.brstockholmbil.se'
const DEFAULT_TITLE = 'BR Stockholm Bil'
const DEFAULT_DESCRIPTION = 'Oberoende bilhandlare i Farsta, Stockholm. Noggrant utvalda begagnade bilar med enkel finansiering via DNB Finans och Mymoney.'

export function buildVehicleMetadata(vehicle: Vehicle, settings: SiteSettings | null): Metadata {
  const title = vehicle.seo_title || `${vehicle.specs.brand} ${vehicle.specs.model} ${vehicle.specs.year} | ${settings?.dealership_name ?? DEFAULT_TITLE}`
  const description = vehicle.seo_description || vehicle.short_description || DEFAULT_DESCRIPTION

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/vehicles/${vehicle.slug}`,
      images: vehicle.hero_image
        ? [{ url: vehicle.hero_image.url, width: vehicle.hero_image.width, height: vehicle.hero_image.height }]
        : [],
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/vehicles/${vehicle.slug}`,
    },
  }
}

export function buildArticleMetadata(article: Article, settings: SiteSettings | null): Metadata {
  const title = article.seo_title || `${article.title} | ${settings?.dealership_name ?? DEFAULT_TITLE}`
  const description = article.seo_description || article.excerpt || DEFAULT_DESCRIPTION

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog/${article.slug}`,
      images: article.featured_image
        ? [{ url: article.featured_image.url }]
        : [],
      type: 'article',
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${article.slug}`,
    },
  }
}

// JSON-LD structured data

export function vehicleJsonLd(vehicle: Vehicle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.specs.brand} ${vehicle.specs.model}`,
    modelDate: String(vehicle.specs.year),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.specs.mileage,
      unitCode: 'KMT',
    },
    fuelType: vehicle.specs.fuel,
    vehicleTransmission: vehicle.specs.transmission,
    color: vehicle.specs.exterior_color,
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: vehicle.currency,
      availability:
        vehicle.status === 'available'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
    },
    image: vehicle.hero_image?.url,
    description: vehicle.short_description,
  }
}

export function articleJsonLd(article: Article, settings: SiteSettings | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image?.url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: settings?.dealership_name ?? DEFAULT_TITLE,
    },
  }
}

export function organizationJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: settings.dealership_name,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mårbackagatan 19',
      postalCode: '123 43',
      addressLocality: 'Farsta',
      addressCountry: 'SE',
    },
  }
}

// Format helpers

export function formatPrice(price: number, currency = 'SEK'): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatMileage(km: number): string {
  return new Intl.NumberFormat('sv-SE').format(km) + ' km'
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}
