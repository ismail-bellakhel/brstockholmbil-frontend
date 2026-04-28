/**
 * WordPress REST API client
 */

import type {
  Vehicle,
  VehicleFilters,
  Article,
  SiteSettings,
  PaginatedResponse,
  WPImage,
} from '@/types'

import {
  MOCK_SETTINGS,
  MOCK_REGULAR_VEHICLES,
  MOCK_COLLECTOR_VEHICLES,
  MOCK_ARTICLES,
} from './mock-data'

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL ?? ''
const WP_API = `${WP_BASE_URL}/wp-json/wp/v2`
const WP_ACF_API = `${WP_BASE_URL}/wp-json/acf/v3`

function isWpConfigured(): boolean {
  if (!WP_BASE_URL) return false
  if (WP_BASE_URL.includes('yourdomain') || WP_BASE_URL.includes('example')) return false
  return true
}

const FETCH_TIMEOUT_MS = 5000

async function safeFetch(url: string, options: RequestInit = {}): Promise<Response | null> {
  if (!isWpConfigured()) return null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return null
    return res
  } catch {
    clearTimeout(timer)
    return null
  }
}

async function wpFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  const res = await safeFetch(`${WP_API}${path}`, {
    next: { revalidate },
  } as RequestInit)

  if (!res) return null

  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

function normaliseImage(raw: Record<string, unknown> | null): WPImage | null {
  if (!raw || typeof raw !== 'object') return null

  const mediaDetails = (raw.media_details as Record<string, unknown>) ?? {}
  const mediaSizes =
    (mediaDetails.sizes as Record<string, { source_url?: string }>) ?? {}

  const acfSizes = (raw.sizes as Record<string, string>) ?? {}

  const url = (raw.source_url ?? raw.url ?? '') as string
  if (!url) return null

  return {
    id: (raw.id as number) ?? 0,
    url,
    alt: (raw.alt_text ?? raw.alt ?? '') as string,
    width: (raw.width as number) ?? (mediaDetails.width as number) ?? 0,
    height: (raw.height as number) ?? (mediaDetails.height as number) ?? 0,
    sizes: {
      thumbnail: acfSizes.thumbnail ?? mediaSizes.thumbnail?.source_url ?? url,
      medium: acfSizes.medium ?? mediaSizes.medium?.source_url ?? url,
      large: acfSizes.large ?? mediaSizes.large?.source_url ?? url,
      full: acfSizes.full ?? mediaSizes.full?.source_url ?? url,
    },
  }
}

async function getMediaById(id: number): Promise<WPImage | null> {
  if (!id) return null

  const res = await safeFetch(`${WP_API}/media/${id}`, {
    next: { revalidate: 3600 },
  } as RequestInit)

  if (!res) return null

  try {
    const data = await res.json()
    return normaliseImage(data as Record<string, unknown>)
  } catch {
    return null
  }
}

async function resolveImage(field: unknown): Promise<WPImage | null> {
  if (!field) return null

  if (typeof field === 'number') {
    return getMediaById(field)
  }

  if (typeof field === 'object') {
    return normaliseImage(field as Record<string, unknown>)
  }

  return null
}

async function resolveGallery(field: unknown): Promise<WPImage[]> {
  if (!Array.isArray(field)) return []

  const images = await Promise.all(field.map((item) => resolveImage(item)))

  return images.filter((image): image is WPImage => image !== null)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mapVehicle(raw: any): Promise<Vehicle> {
  const acf = raw.acf ?? {}

  const [heroImage, galleryImages] = await Promise.all([
    resolveImage(acf.hero_image),
    resolveGallery(acf.gallery ?? acf.gallery_images ?? []),
  ])

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title?.rendered ?? '',
    category: acf.vehicle_category ?? 'regular',
    status: acf.status ?? 'available',
    featured: acf.featured ?? false,
    show_internal_detail_page: acf.show_internal_detail_page ?? true,

    specs: {
      brand: acf.brand ?? '',
      model: acf.model ?? '',
      year: Number(acf.year ?? 0),
      mileage: Number(acf.mileage ?? 0),
      fuel: acf.fuel ?? 'petrol',
      transmission: acf.transmission ?? 'automatic',
      drivetrain: acf.drivetrain ?? 'fwd',
      engine: acf.engine ?? '',
      horsepower: Number(acf.horsepower ?? 0),
      exterior_color: acf.exterior_color ?? '',
      interior_color: acf.interior_color ?? '',
    },

    price: Number(acf.price ?? 0),
    currency: acf.currency ?? 'SEK',

    short_description: acf.short_description ?? '',
    full_description: acf.full_description ?? '',

    hero_image: heroImage as WPImage,
    gallery_images: galleryImages,

    blocket_url: acf.blocket_url || null,

    seo_title: acf.seo_title ?? raw.title?.rendered ?? '',
    seo_description: acf.seo_description ?? '',

    updated_at: raw.modified ?? raw.date,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArticle(raw: any): Article {
  const acf = raw.acf ?? {}

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title?.rendered ?? '',
    excerpt: raw.excerpt?.rendered?.replace(/<[^>]+>/g, '') ?? '',
    content: raw.content?.rendered ?? '',

    featured_image: normaliseImage(raw._embedded?.['wp:featuredmedia']?.[0] ?? null),

    categories: (raw._embedded?.['wp:term']?.[0] ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) => ({ id: c.id, name: c.name, slug: c.slug })
    ),

    tags: (raw._embedded?.['wp:term']?.[1] ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (t: any) => t.name
    ),

    author: {
      name: raw._embedded?.author?.[0]?.name ?? '',
      avatar: raw._embedded?.author?.[0]?.avatar_urls?.['96'] ?? null,
    },

    published_at: raw.date,
    updated_at: raw.modified,

    intro: acf.intro ?? '',
    subheadline: acf.subheadline ?? '',
    featured_cta_label: acf.featured_cta_label ?? '',
    featured_cta_url: acf.featured_cta_url ?? '',

    ad_settings: {
      show_top_ad: acf.show_top_ad ?? true,
      show_inline_ads: acf.show_inline_ads ?? true,
      show_sidebar_ad: acf.show_sidebar_ad ?? true,
      show_bottom_ad: acf.show_bottom_ad ?? true,
      show_affiliate_block: acf.show_affiliate_block ?? false,
      show_native_promo: acf.show_native_promo ?? false,
      custom_ad_slot_id: acf.custom_ad_slot_id || undefined,
    },

    seo_title: acf.seo_title ?? raw.title?.rendered ?? '',
    seo_description: acf.seo_description ?? '',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSettings(raw: any): SiteSettings {
  return {
    dealership_name: raw.dealership_name ?? '',
    tagline: raw.tagline ?? '',
    logo: normaliseImage(raw.logo) as WPImage,
    phone: raw.phone ?? '',
    email: raw.email ?? '',
    address: raw.address ?? '',
    opening_hours: raw.opening_hours ?? {},
    social_facebook: raw.social_facebook ?? '',
    social_instagram: raw.social_instagram ?? '',
    footer_text: raw.footer_text ?? '',
    affiliate_disclosure: raw.affiliate_disclosure ?? '',
    hero_headline: raw.hero_headline ?? '',
    hero_subheadline: raw.hero_subheadline ?? '',
    hero_image: normaliseImage(raw.hero_image) as WPImage,
    hero_cta_label: raw.hero_cta_label ?? '',
    hero_cta_url: raw.hero_cta_url ?? '',
    ads_enabled: raw.ads_enabled ?? false,
    adsense_publisher_id: raw.adsense_publisher_id ?? '',
    ad_slot_article_top: raw.ad_slot_article_top ?? '',
    ad_slot_article_inline_1: raw.ad_slot_article_inline_1 ?? '',
    ad_slot_article_inline_2: raw.ad_slot_article_inline_2 ?? '',
    ad_slot_article_sidebar: raw.ad_slot_article_sidebar ?? '',
    ad_slot_article_bottom: raw.ad_slot_article_bottom ?? '',
  }
}

export async function getVehicles(
  filters: VehicleFilters = {},
  page = 1,
  perPage = 24
): Promise<PaginatedResponse<Vehicle>> {
  const mockItems =
    filters.category === 'collector' ? MOCK_COLLECTOR_VEHICLES : MOCK_REGULAR_VEHICLES

  const fallback: PaginatedResponse<Vehicle> = {
    items: mockItems,
    total: mockItems.length,
    page: 1,
    per_page: perPage,
    total_pages: 1,
  }

  if (!isWpConfigured()) return fallback

  try {
    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      _embed: '1',
      status: 'publish',
    })

    const res = await safeFetch(`${WP_API}/vehicle?${params}`, {
      next: { revalidate: 60 },
    } as RequestInit)

    if (!res) return fallback

    const total = Number(res.headers.get('X-WP-Total') ?? 0)
    const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? 1)
    const data = await res.json()

    const vehicles = Array.isArray(data) ? await Promise.all(data.map(mapVehicle)) : []

    const filtered = filters.category
      ? vehicles.filter((vehicle) => vehicle.category === filters.category)
      : vehicles

    return {
      items: filtered,
      total: filtered.length || total,
      page,
      per_page: perPage,
      total_pages: totalPages,
    }
  } catch {
    return fallback
  }
}

export async function getFeaturedVehicles(category?: string): Promise<Vehicle[]> {
  const fallback =
    category === 'collector' ? MOCK_COLLECTOR_VEHICLES : MOCK_REGULAR_VEHICLES

  if (!isWpConfigured()) return fallback

  try {
    const params = new URLSearchParams({
      per_page: '20',
      _embed: '1',
      status: 'publish',
    })

    const res = await safeFetch(`${WP_API}/vehicle?${params}`, {
      next: { revalidate: 60 },
    } as RequestInit)

    if (!res) return fallback

    const data = await res.json()
    if (!Array.isArray(data)) return fallback

    const vehicles = await Promise.all(data.map(mapVehicle))

    const filtered = category
      ? vehicles.filter((vehicle) => vehicle.category === category)
      : vehicles

    return filtered.slice(0, 6)
  } catch {
    return fallback
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  if (!isWpConfigured()) {
    return (
      [...MOCK_REGULAR_VEHICLES, ...MOCK_COLLECTOR_VEHICLES].find(
        (v) => v.slug === slug
      ) ?? null
    )
  }

  try {
    const data = await wpFetch<unknown[]>(`/vehicle?slug=${slug}&_embed=1`, 300)
    if (!Array.isArray(data) || data.length === 0) return null
    return await mapVehicle(data[0])
  } catch {
    return null
  }
}

export async function getVehicleSlugs(): Promise<string[]> {
  if (!isWpConfigured()) {
    return [...MOCK_REGULAR_VEHICLES, ...MOCK_COLLECTOR_VEHICLES].map(
      (v) => v.slug
    )
  }

  try {
    const data = await wpFetch<Array<{ slug: string }>>(
      '/vehicle?per_page=100&fields=slug',
      3600
    )

    if (!Array.isArray(data)) return []
    return data.map((v) => v.slug)
  } catch {
    return []
  }
}

export async function getArticles(
  page = 1,
  perPage = 12,
  categorySlug?: string
): Promise<PaginatedResponse<Article>> {
  const fallback: PaginatedResponse<Article> = {
    items: [],
    total: MOCK_ARTICLES.length,
    page: 1,
    per_page: perPage,
    total_pages: 1,
  }

  if (!isWpConfigured()) return fallback

  try {
    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      _embed: '1',
      status: 'publish',
    })

    if (categorySlug) params.set('categories', categorySlug)

    const res = await safeFetch(`${WP_API}/posts?${params}`, {
      next: { revalidate: 60 },
    } as RequestInit)

    if (!res) return fallback

    const total = Number(res.headers.get('X-WP-Total') ?? 0)
    const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? 1)
    const data = await res.json()

    return {
      items: Array.isArray(data) ? data.map(mapArticle) : [],
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
    }
  } catch {
    return fallback
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isWpConfigured()) {
    return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null
  }

  try {
    const data = await wpFetch<unknown[]>(`/posts?slug=${slug}&_embed=1`, 300)
    if (!Array.isArray(data) || data.length === 0) return null
    return mapArticle(data[0])
  } catch {
    return null
  }
}

export async function getArticleSlugs(): Promise<string[]> {
  if (!isWpConfigured()) {
    return MOCK_ARTICLES.map((a) => a.slug)
  }

  try {
    const data = await wpFetch<Array<{ slug: string }>>(
      '/posts?per_page=100&fields=slug',
      3600
    )

    if (!Array.isArray(data)) return []
    return data.map((a) => a.slug)
  } catch {
    return []
  }
}

export async function getLatestArticles(count = 3): Promise<Article[]> {
  const { items } = await getArticles(1, count)
  return items
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isWpConfigured()) return MOCK_SETTINGS

  try {
    const res = await safeFetch(`${WP_ACF_API}/options/site_settings`, {
      next: { revalidate: 3600 },
    } as RequestInit)

    if (!res) return MOCK_SETTINGS

    const data = await res.json()
    return mapSettings(data.acf ?? {})
  } catch {
    return MOCK_SETTINGS
  }
}