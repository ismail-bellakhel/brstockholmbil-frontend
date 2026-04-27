// ─────────────────────────────────────────────────────────────────────────────
// Core data types — matching WordPress ACF field structure exactly
// ─────────────────────────────────────────────────────────────────────────────

export type VehicleStatus = 'available' | 'sold' | 'reserved' | 'incoming'
export type VehicleCategory = 'regular' | 'collector'
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'plug-in-hybrid' | 'other'
export type Transmission = 'automatic' | 'manual'
export type Drivetrain = 'fwd' | 'rwd' | 'awd' | '4wd'
export type Currency = 'SEK' | 'EUR'

export interface WPImage {
  id: number
  url: string
  alt: string
  width: number
  height: number
  sizes: {
    thumbnail: string
    medium: string
    large: string
    full: string
  }
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────

export interface VehicleSpecs {
  brand: string
  model: string
  year: number
  mileage: number        // km
  fuel: FuelType
  transmission: Transmission
  drivetrain: Drivetrain
  engine: string         // e.g. "2.0T 16V"
  horsepower: number
  exterior_color: string
  interior_color: string
}

export interface Vehicle {
  id: number
  slug: string
  title: string

  // Status & classification
  category: VehicleCategory
  status: VehicleStatus
  featured: boolean
  show_internal_detail_page: boolean

  // Specs
  specs: VehicleSpecs

  // Pricing
  price: number
  currency: Currency

  // Content
  short_description: string
  full_description: string  // HTML from WP editor

  // Media
  hero_image: WPImage
  gallery_images: WPImage[]

  // External
  blocket_url: string | null

  // SEO
  seo_title: string
  seo_description: string

  // Meta
  updated_at: string
}

// ─── Article / Blog Post ──────────────────────────────────────────────────────

export interface ArticleCategory {
  id: number
  name: string
  slug: string
}

export interface ArticleAuthor {
  name: string
  avatar: string | null
}

export interface AdSettings {
  show_top_ad: boolean
  show_inline_ads: boolean
  show_sidebar_ad: boolean
  show_bottom_ad: boolean
  show_affiliate_block: boolean
  show_native_promo: boolean
  // Optional post-level overrides; falls back to global settings
  custom_ad_slot_id?: string
}

export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string  // HTML
  featured_image: WPImage | null
  categories: ArticleCategory[]
  tags: string[]
  author: ArticleAuthor
  published_at: string
  updated_at: string

  // ACF extras
  intro: string
  subheadline: string
  featured_cta_label: string
  featured_cta_url: string

  // Ad controls
  ad_settings: AdSettings

  // SEO
  seo_title: string
  seo_description: string
}

// ─── Site Settings (ACF Options Page) ────────────────────────────────────────

export interface OpeningHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

export interface SiteSettings {
  dealership_name: string
  tagline: string
  logo: WPImage
  phone: string
  email: string
  address: string
  opening_hours: OpeningHours
  social_facebook: string
  social_instagram: string
  footer_text: string
  affiliate_disclosure: string

  // Homepage
  hero_headline: string
  hero_subheadline: string
  hero_image: WPImage
  hero_cta_label: string
  hero_cta_url: string

  // Global ad defaults
  ads_enabled: boolean
  adsense_publisher_id: string
  ad_slot_article_top: string
  ad_slot_article_inline_1: string
  ad_slot_article_inline_2: string
  ad_slot_article_sidebar: string
  ad_slot_article_bottom: string
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface VehicleFilters {
  category?: VehicleCategory
  brand?: string
  fuel?: FuelType
  transmission?: Transmission
  year_min?: number
  year_max?: number
  price_min?: number
  price_max?: number
  status?: VehicleStatus
  featured?: boolean
}
