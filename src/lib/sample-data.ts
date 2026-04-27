/**
 * Sample vehicle data — realistic Swedish dealership content.
 * Use this for local development, Storybook, or as reference when
 * configuring WordPress for the first time.
 *
 * These are typed to match the Vehicle interface exactly.
 */

import type { Vehicle } from '@/types'

const placeholderImage = {
  id: 1,
  url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80',
  alt: 'Bil i showroom',
  width: 1200,
  height: 750,
  sizes: {
    thumbnail: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=150&q=80',
    medium: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
    large: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80',
    full: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80',
  },
}

export const sampleVehicles: Vehicle[] = [
  {
    id: 1,
    slug: 'volvo-v70-t5-2004',
    title: 'Volvo V70 T5 2004',
    category: 'regular',
    status: 'available',
    featured: true,
    show_internal_detail_page: true,
    specs: {
      brand: 'Volvo',
      model: 'V70 T5',
      year: 2004,
      mileage: 178000,
      fuel: 'petrol',
      transmission: 'automatic',
      drivetrain: 'fwd',
      engine: '2.5T 20V',
      horsepower: 210,
      exterior_color: 'Silvergrå metallic',
      interior_color: 'Beige textil',
    },
    price: 64900,
    currency: 'SEK',
    short_description:
      'Välvårdad V70 T5 med full servicehistorik från auktoriserad verkstad. Nybesiktad utan anmärkningar. Dragkrok, vinterhjul och nytt kamrem ingår.',
    full_description: `
      <p>En ägares bil sedan 2008, köpt ny hos Bilia i Göteborg. Full dokumenterad servicehistorik från auktoriserad Volvoverkstad hela vägen.</p>
      <p>Bilen är nybesiktad utan anmärkningar och genomgick full service inklusive kamremsbyte i januari i år. Servostyrning, el-fönster, elspeglar, bakre parksensorer och integrerat GPS-nav ingår.</p>
      <p>Karosseri: Mycket gott skick för åldern. Inga bulor eller genomgående rost. Mindre märken på bakre stötfångare som inte syns i vardaglig körning. Lacken är polerad och välbevarad.</p>
      <p>Ingår: Vinterhjul på originalfälgar, dragkrok med avtagbar kula, extraservicekort och original bildäck med gott mönsterdjup.</p>
    `,
    hero_image: placeholderImage,
    gallery_images: [placeholderImage, placeholderImage, placeholderImage],
    blocket_url: 'https://www.blocket.se/annons/example',
    seo_title: 'Volvo V70 T5 2004 — 178 000 km — 64 900 kr',
    seo_description: 'Välvårdad Volvo V70 T5 2004 med full servicehistorik och nybesiktad. Dragkrok och vinterhjul ingår. Pris: 64 900 kr.',
    updated_at: '2024-11-15T10:00:00Z',
  },
  {
    id: 2,
    slug: 'bmw-530d-touring-2018',
    title: 'BMW 530d Touring 2018',
    category: 'regular',
    status: 'available',
    featured: true,
    show_internal_detail_page: true,
    specs: {
      brand: 'BMW',
      model: '530d Touring',
      year: 2018,
      mileage: 112000,
      fuel: 'diesel',
      transmission: 'automatic',
      drivetrain: 'rwd',
      engine: '3.0d 24V',
      horsepower: 265,
      exterior_color: 'Mineralvit metallic',
      interior_color: 'Svart Dakota-läder',
    },
    price: 289000,
    currency: 'SEK',
    short_description:
      'BMW 530d Touring i utmärkt skick med M-sport exteriör och panoramatak. Välservad med dokumenterad historik. Dragkrok och head-up display.',
    full_description: `
      <p>Välutrustad 530d Touring med M-sport-paket, panoramatak, head-up display och harman/kardon-ljud. Importerad från Tyskland 2019 och servad sedan dess hos auktoriserad BMW-verkstad i Sverige.</p>
      <p>Karosseri och interiör i mycket gott skick. Inga dolda fel. Fyra nya Michelin Pilot Sport 4 sommardäck monterades i vår.</p>
    `,
    hero_image: placeholderImage,
    gallery_images: [placeholderImage, placeholderImage],
    blocket_url: null,
    seo_title: 'BMW 530d Touring 2018 M-sport — 112 000 km',
    seo_description: 'BMW 530d Touring 2018 med M-sport, panoramatak och head-up display. Välservad. 289 000 kr.',
    updated_at: '2024-11-20T08:00:00Z',
  },
  {
    id: 3,
    slug: 'porsche-911-carrera-1989',
    title: 'Porsche 911 Carrera 3.2 1989',
    category: 'collector',
    status: 'available',
    featured: true,
    show_internal_detail_page: true,
    specs: {
      brand: 'Porsche',
      model: '911 Carrera 3.2',
      year: 1989,
      mileage: 94000,
      fuel: 'petrol',
      transmission: 'manual',
      drivetrain: 'rwd',
      engine: '3.2 Boxer',
      horsepower: 231,
      exterior_color: 'Guards Red',
      interior_color: 'Svart halvläder',
    },
    price: 649000,
    currency: 'SEK',
    short_description:
      'Sällsynt välbevarad 911 Carrera 3.2 i ikonisk Guards Red. Matchande nummer, dokumenterad historia sedan ny och ett av få exemplar på den svenska marknaden i detta skick.',
    full_description: `
      <p>En av de finaste 911 Carrera 3.2 vi haft förmånen att representera. Bilen säljs med komplett Porsche-historik och samtliga originaldokument från leverans 1989.</p>
      <p>Motor och växellåda med matchande nummer. Originallack i Guards Red med mycket välbevarad yta — inga överlackerade ytor, all lack original. Underredet är rengjort och förseglade 2021.</p>
      <p>Interiör: välbevarad originalinteriör med ett slitage som är korrekt för åldern. Inga ersatta delar i kabinen.</p>
      <p>Service utförd av Porsche-specialist. Ny kamrem, kopplingssats och bromsbelägg runt om. Bilen körs och låter som den ska.</p>
    `,
    hero_image: placeholderImage,
    gallery_images: [placeholderImage, placeholderImage, placeholderImage, placeholderImage],
    blocket_url: null,
    seo_title: 'Porsche 911 Carrera 3.2 1989 — Guards Red — Matchande nummer',
    seo_description: 'Välbevarad Porsche 911 Carrera 3.2 1989 i Guards Red med matchande nummer och komplett historik. 649 000 kr.',
    updated_at: '2024-11-10T14:00:00Z',
  },
  {
    id: 4,
    slug: 'volvo-p1800-1966',
    title: 'Volvo P1800 1966',
    category: 'collector',
    status: 'available',
    featured: false,
    show_internal_detail_page: true,
    specs: {
      brand: 'Volvo',
      model: 'P1800',
      year: 1966,
      mileage: 138000,
      fuel: 'petrol',
      transmission: 'manual',
      drivetrain: 'rwd',
      engine: '1.8 B18',
      horsepower: 108,
      exterior_color: 'Vit',
      interior_color: 'Röd textil',
    },
    price: 285000,
    currency: 'SEK',
    short_description:
      'Tidlös Volvo P1800 i klassisk vit/röd-kombination. Restaurerad karosseri, väl fungerande mekanik och ett utseende som aldrig åldras.',
    full_description: `
      <p>Volvo P1800 är en av de vackraste bilarna Sverige någonsin producerat. Den här exemplaret är i ett skick som gör det enkelt att ta den till shows eller använda som sommarbil.</p>
      <p>Karosseriet är restaurerat professionellt för ca fem år sedan. Lacken har patinerat vackert sedan dess och är fri från rost eller sprickor. Interiören är original med ett naturligt slitage.</p>
      <p>Motorn är genomgången och startar säkert, kör jämnt och har inga oljeläckage. 4-växlad manuell låda med tydlig och precis känsla.</p>
    `,
    hero_image: placeholderImage,
    gallery_images: [placeholderImage, placeholderImage],
    blocket_url: 'https://www.blocket.se/annons/example-p1800',
    seo_title: 'Volvo P1800 1966 — Restaurerad — 285 000 kr',
    seo_description: 'Klassisk Volvo P1800 1966 i vit/röd. Restaurerad karosseri, välskött mekanik. 285 000 kr.',
    updated_at: '2024-10-28T09:00:00Z',
  },
]

export const sampleArticles = [
  {
    id: 1,
    slug: 'kopa-begagnad-bil-guide',
    title: 'Guide: Vad bör du kontrollera när du köper en begagnad bil?',
    excerpt:
      'En grundlig checklista för dig som köper begagnad bil. Vi går igenom vad du ska titta på — från karosseri och motor till servicehistorik och besiktningsprotokoll.',
    category: 'Köpguide',
    publishedAt: '2024-11-01',
  },
  {
    id: 2,
    slug: 'porsche-911-investering-2024',
    title: 'Porsche 911 som investering: Vilka årsmodeller håller värdet bäst?',
    excerpt:
      'Luftkylda 911:or har stigit dramatiskt i värde de senaste åren. Vi analyserar vilka modeller och årsmodeller som historiskt sett haft den starkaste värdeutvecklingen.',
    category: 'Analys',
    publishedAt: '2024-10-20',
  },
  {
    id: 3,
    slug: 'volvo-klassiker-att-kopa-nu',
    title: 'Fem Volvo-klassiker du bör köpa innan de blir för dyra',
    excerpt:
      'P1800, 240 GLT, 480 och fler — några Volvos som fortfarande kan köpas till rimliga priser men som sannolikt fortsätter stiga i värde.',
    category: 'Samlarsektionen',
    publishedAt: '2024-09-15',
  },
]
