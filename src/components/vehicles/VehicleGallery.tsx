'use client'

import { useState } from 'react'
import type { Vehicle } from '@/types'

export function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const images = [
    vehicle.hero_image,
    ...vehicle.gallery_images,
  ].filter(Boolean)

  const [current, setCurrent] = useState(0)

  const currentImage = images[current]

  if (!currentImage) return null

  return (
    <div>
      {/* MAIN IMAGE */}
      <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden mb-3">
        <img
          src={currentImage.sizes?.large || currentImage.url}
          alt=""
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
        />
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative aspect-square overflow-hidden cursor-pointer border ${
                i === current ? 'border-stone-900' : 'border-transparent'
              }`}
              onClick={() => setCurrent(i)}
            >
              <img
                src={img.sizes?.thumbnail || img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}