// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getVehicleSlugs, getArticleSlugs } from '@/lib/api/wordpress'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.brstockholmbil.se'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicleSlugs, articleSlugs] = await Promise.all([
    getVehicleSlugs(),
    getArticleSlugs(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/vehicles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/collector`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const vehiclePages: MetadataRoute.Sitemap = vehicleSlugs.map((slug) => ({
    url: `${SITE_URL}/vehicles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...vehiclePages, ...articlePages]
}
