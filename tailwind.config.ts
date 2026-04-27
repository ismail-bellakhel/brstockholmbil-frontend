// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'system-ui', 'sans-serif'],
        serif: ['EB Garamond', 'Georgia', 'serif'],
      },
      colors: {
        // Stone is the primary palette — Tailwind's stone scale fits the Scandinavian minimal tone
        // No custom colors needed; use stone shades throughout
      },
      maxWidth: {
        // Article reading width
        'prose': '68ch',
      },
      typography: {
        // Handled manually in globals.css to keep complete control
      },
    },
  },
  plugins: [],
}

export default config
