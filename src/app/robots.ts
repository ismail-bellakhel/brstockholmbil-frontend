import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.brstockholmbil.se'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/wp-admin/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
