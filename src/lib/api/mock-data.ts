/**
 * Mock fallback data — used when WordPress is unreachable or unconfigured.
 * All shapes match the real TypeScript types exactly.
 * Images use unoptimized placeholder SVGs via data URIs — no remote host needed.
 */

import type { Vehicle, Article, SiteSettings, WPImage } from '@/types'

// A plain SVG placeholder that works as a data URI — no external host, no next/image issues.
const placeholder = (label: string): WPImage => ({
  id: 0,
  url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750' viewBox='0 0 1200 750'><rect width='1200' height='750' fill='%23e8e4de'/><text x='50%25' y='50%25' font-family='system-ui' font-size='28' fill='%23aaa' text-anchor='middle' dominant-baseline='middle'>${encodeURIComponent(label)}</text></svg>`,
  alt: label,
  width: 1200,
  height: 750,
  sizes: {
    thumbnail: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='94' viewBox='0 0 150 94'><rect width='150' height='94' fill='%23e8e4de'/></svg>`,
    medium: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='375' viewBox='0 0 600 375'><rect width='600' height='375' fill='%23e8e4de'/></svg>`,
    large: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750' viewBox='0 0 1200 750'><rect width='1200' height='750' fill='%23e8e4de'/><text x='50%25' y='50%25' font-family='system-ui' font-size='28' fill='%23aaa' text-anchor='middle' dominant-baseline='middle'>${encodeURIComponent(label)}</text></svg>`,
    full: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750' viewBox='0 0 1200 750'><rect width='1200' height='750' fill='%23e8e4de'/></svg>`,
  },
})

export const MOCK_SETTINGS: SiteSettings = {
  dealership_name: 'BR Stockholm Bil',
  tagline: 'Noggrant utvalda begagnade bilar i Farsta',
  logo: placeholder('BR Stockholm Bil'),
  phone: '08-920 315',
  email: 'info@brstockholmbil.se',
  address: 'Mårbackagatan 19, 123 43 Farsta',
  opening_hours: {
    monday: '10:00–18:00',
    tuesday: '10:00–18:00',
    wednesday: '10:00–18:00',
    thursday: '10:00–18:00',
    friday: '10:00–18:00',
    saturday: '11:00–15:00',
    sunday: 'Stängt',
  },
  social_facebook: '',
  social_instagram: '',
  footer_text: 'Oberoende bilhandlare i Farsta, Stockholm. Vi hjälper privatpersoner och företag att hitta rätt bil.',
  affiliate_disclosure: 'Webbplatsen kan innehålla affiliatelänkar.',
  hero_headline: 'Rätt bil.\nÄrligt pris.',
  hero_subheadline:
    'Vi är en oberoende bilhandlare i Farsta med noggrant utvalda begagnade bilar. Enkel finansiering via DNB Finans och Mymoney.',
  hero_image: placeholder('BR Stockholm Bil'),
  hero_cta_label: 'Se alla bilar',
  hero_cta_url: '/vehicles',
  ads_enabled: false,
  adsense_publisher_id: '',
  ad_slot_article_top: '',
  ad_slot_article_inline_1: '',
  ad_slot_article_inline_2: '',
  ad_slot_article_sidebar: '',
  ad_slot_article_bottom: '',
}

const makeVehicle = (
  id: number,
  slug: string,
  brand: string,
  model: string,
  year: number,
  price: number,
  mileage: number,
  category: 'regular' | 'collector',
  extras: Partial<Vehicle> = {}
): Vehicle => ({
  id,
  slug,
  title: `${brand} ${model} ${year}`,
  category,
  status: 'available',
  featured: true,
  show_internal_detail_page: true,
  specs: {
    brand,
    model,
    year,
    mileage,
    fuel: 'petrol',
    transmission: 'automatic',
    drivetrain: 'fwd',
    engine: '2.0T',
    horsepower: 190,
    exterior_color: 'Silvermetallic',
    interior_color: 'Svart läder',
  },
  price,
  currency: 'SEK',
  short_description: `Välvårdad ${brand} ${model} med dokumenterad servicehistorik. Nybesiktad utan anmärkningar.`,
  full_description: `<p>En välskött ${brand} ${model} från ${year} med full servicehistorik. Bilen är i utmärkt skick för åldern och körs precis som den ska.</p>`,
  hero_image: placeholder(`${brand} ${model}`),
  gallery_images: [placeholder(`${brand} ${model} — exteriör`), placeholder(`${brand} ${model} — interiör`)],
  blocket_url: null,
  seo_title: `${brand} ${model} ${year} — ${new Intl.NumberFormat('sv-SE').format(price)} kr`,
  seo_description: `${brand} ${model} ${year}, ${new Intl.NumberFormat('sv-SE').format(mileage)} km. Pris: ${new Intl.NumberFormat('sv-SE').format(price)} kr.`,
  updated_at: new Date().toISOString(),
  ...extras,
})

export const MOCK_REGULAR_VEHICLES: Vehicle[] = [
  makeVehicle(1, 'volvo-v70-t5-2004', 'Volvo', 'V70 T5', 2004, 64900, 178000, 'regular', {
    specs: { brand: 'Volvo', model: 'V70 T5', year: 2004, mileage: 178000, fuel: 'petrol', transmission: 'automatic', drivetrain: 'fwd', engine: '2.5T 20V', horsepower: 210, exterior_color: 'Silvergrå metallic', interior_color: 'Beige textil' },
    blocket_url: 'https://www.blocket.se',
    short_description: 'Välvårdad V70 T5 med full servicehistorik. Nybesiktad utan anmärkningar. Dragkrok och vinterhjul ingår.',
  }),
  makeVehicle(2, 'bmw-530d-touring-2018', 'BMW', '530d Touring', 2018, 289000, 112000, 'regular', {
    specs: { brand: 'BMW', model: '530d Touring', year: 2018, mileage: 112000, fuel: 'diesel', transmission: 'automatic', drivetrain: 'rwd', engine: '3.0d 24V', horsepower: 265, exterior_color: 'Mineralvit metallic', interior_color: 'Svart Dakota-läder' },
    short_description: 'BMW 530d Touring med M-sport exteriör och panoramatak. Välservad med dokumenterad historik.',
  }),
  makeVehicle(3, 'mercedes-e220-cdi-2015', 'Mercedes-Benz', 'E220 CDI', 2015, 195000, 98000, 'regular', {
    status: 'reserved',
    specs: { brand: 'Mercedes-Benz', model: 'E220 CDI', year: 2015, mileage: 98000, fuel: 'diesel', transmission: 'automatic', drivetrain: 'rwd', engine: '2.2d 16V', horsepower: 195, exterior_color: 'Obsidianschwarz', interior_color: 'Svart Artico' },
  }),
]

export const MOCK_COLLECTOR_VEHICLES: Vehicle[] = [
  makeVehicle(4, 'porsche-911-carrera-3-2-1989', 'Porsche', '911 Carrera 3.2', 1989, 649000, 94000, 'collector', {
    specs: { brand: 'Porsche', model: '911 Carrera 3.2', year: 1989, mileage: 94000, fuel: 'petrol', transmission: 'manual', drivetrain: 'rwd', engine: '3.2 Boxer', horsepower: 231, exterior_color: 'Guards Red', interior_color: 'Svart halvläder' },
    short_description: 'Sällsynt välbevarad 911 Carrera 3.2 i Guards Red. Matchande nummer och dokumenterad historia sedan ny.',
  }),
  makeVehicle(5, 'volvo-p1800-1966', 'Volvo', 'P1800', 1966, 285000, 138000, 'collector', {
    specs: { brand: 'Volvo', model: 'P1800', year: 1966, mileage: 138000, fuel: 'petrol', transmission: 'manual', drivetrain: 'rwd', engine: '1.8 B18', horsepower: 108, exterior_color: 'Vit', interior_color: 'Röd textil' },
    blocket_url: 'https://www.blocket.se',
    short_description: 'Tidlös Volvo P1800 i klassisk vit/röd. Restaurerad karosseri och väl fungerande mekanik.',
  }),
  makeVehicle(6, 'mercedes-280sl-pagod-1971', 'Mercedes-Benz', '280 SL Pagod', 1971, 895000, 82000, 'collector', {
    specs: { brand: 'Mercedes-Benz', model: '280 SL Pagod', year: 1971, mileage: 82000, fuel: 'petrol', transmission: 'manual', drivetrain: 'rwd', engine: '2.8 M130', horsepower: 170, exterior_color: 'Signalröd', interior_color: 'Crème läder' },
    short_description: 'Välbevarad 280 SL Pagod med manuell växellåda. Sällsynt och eftertraktad klassiker i fint skick.',
  }),
]

const makeArticle = (
  id: number,
  slug: string,
  title: string,
  excerpt: string,
  category: string,
  daysAgo: number
): Article => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return {
    id,
    slug,
    title,
    excerpt,
    content: `<p>${excerpt}</p><p>Läs mer om detta ämne i vår fullständiga artikel.</p>`,
    featured_image: placeholder(title),
    categories: [{ id: 1, name: category, slug: category.toLowerCase().replace(/\s/g, '-') }],
    tags: [],
    author: { name: 'Redaktionen', avatar: null },
    published_at: d.toISOString(),
    updated_at: d.toISOString(),
    intro: excerpt,
    subheadline: '',
    featured_cta_label: '',
    featured_cta_url: '',
    ad_settings: {
      show_top_ad: false,
      show_inline_ads: false,
      show_sidebar_ad: false,
      show_bottom_ad: false,
      show_affiliate_block: false,
      show_native_promo: false,
    },
    seo_title: title,
    seo_description: excerpt,
  }
}

export const MOCK_ARTICLES: Article[] = [
  makeArticle(1, 'kopa-begagnad-bil-guide', 'Guide: Vad bör du kontrollera när du köper en begagnad bil?', 'En grundlig checklista för dig som köper begagnad bil — från karosseri och motor till servicehistorik och besiktningsprotokoll.', 'Köpguide', 23),
  makeArticle(2, 'porsche-911-investering-2024', 'Porsche 911 som investering: vilka årsmodeller håller värdet bäst?', 'Luftkylda 911:or har stigit dramatiskt i värde de senaste åren. Vi analyserar vilka modeller som historiskt haft den starkaste värdeutvecklingen.', 'Analys', 34),
  makeArticle(3, 'volvo-klassiker-att-kopa-nu', 'Fem Volvo-klassiker du bör köpa innan de blir för dyra', 'P1800, 240 GLT, 480 och fler — modeller som fortfarande köps till rimliga priser men sannolikt stiger i värde.', 'Premiumbilar', 55),
]
