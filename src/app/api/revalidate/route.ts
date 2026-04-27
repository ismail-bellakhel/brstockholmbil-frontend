/**
 * /api/revalidate
 *
 * Called by WordPress save_post webhook when a vehicle or article is published/updated.
 * Triggers Next.js ISR on-demand revalidation for the affected page + listing pages.
 *
 * Setup:
 *   - Set NEXTJS_REVALIDATION_SECRET in both .env and WordPress wp-config.php
 *   - Set NEXTJS_REVALIDATION_URL in wp-config.php to https://your-site.se/api/revalidate
 */

import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.NEXTJS_REVALIDATION_SECRET ?? ''

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''

  if (!SECRET || auth !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { type?: string; slug?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, slug } = body

  try {
    if (type === 'vehicle' && slug) {
      revalidatePath(`/vehicles/${slug}`)
      revalidatePath('/vehicles')
      revalidatePath('/collector')
      revalidatePath('/')
    } else if (type === 'post' && slug) {
      revalidatePath(`/blog/${slug}`)
      revalidatePath('/blog')
      revalidatePath('/')
    } else {
      // Fallback: revalidate all key pages
      revalidatePath('/')
      revalidatePath('/vehicles')
      revalidatePath('/collector')
      revalidatePath('/blog')
    }

    return NextResponse.json({ revalidated: true, type, slug })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
