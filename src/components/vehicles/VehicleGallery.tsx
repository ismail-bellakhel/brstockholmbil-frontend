'use client'

import { useEffect, useState } from 'react'
import type { Vehicle, WPImage } from '@/types'

export function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const images = [vehicle.hero_image, ...vehicle.gallery_images].filter(Boolean) as WPImage[]
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const currentImage = images[current]

  function goNext() {
    setCurrent((prev) => (prev + 1) % images.length)
  }

  function goPrev() {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!lightboxOpen) return
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, images.length])

  if (!currentImage) {
    return (
      <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden mb-3 flex items-center justify-center">
        <span className="text-stone-400 text-sm">Ingen bild</span>
      </div>
    )
  }

  return (
    <>
      <div>
        <div
          className="relative aspect-[16/10] bg-stone-100 overflow-hidden mb-3 cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={currentImage.sizes?.large || currentImage.url}
            alt={`${vehicle.specs.brand} ${vehicle.specs.model}`}
            className="w-full h-full object-cover"
          />
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.slice(0, 10).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`relative aspect-square bg-stone-100 overflow-hidden border transition ${
                  i === current ? 'border-stone-900' : 'border-transparent hover:border-stone-300'
                }`}
              >
                <img
                  src={img.sizes?.thumbnail || img.sizes?.medium || img.url}
                  alt={`${vehicle.specs.brand} ${vehicle.specs.model} bild ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white text-3xl leading-none"
            aria-label="Stäng"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 sm:left-8 text-white/80 hover:text-white text-4xl"
              aria-label="Föregående bild"
            >
              ‹
            </button>
          )}

          <img
            src={currentImage.sizes?.full || currentImage.sizes?.large || currentImage.url}
            alt={`${vehicle.specs.brand} ${vehicle.specs.model}`}
            className="max-w-[92vw] max-h-[86vh] object-contain"
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 sm:right-8 text-white/80 hover:text-white text-4xl"
              aria-label="Nästa bild"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {current + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}