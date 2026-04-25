import { siMax } from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

export type BrandDefinition = {
  id: string
  label: string
  accent: string
  logoWidth: string
  aspectRatio: number
} & (
  | {
      kind: 'mask'
      asset: string
    }
  | {
      kind: 'simple'
      icon: SimpleIcon
    }
)

export type CoverPalette = {
  accent: string
  wash: string
  glow: string
  line: string
}

const BRAND_LIBRARY: BrandDefinition[] = [
  {
    id: 'netflix',
    label: 'Netflix',
    kind: 'mask',
    asset: '/logos/netflix.svg',
    accent: '#e50914',
    logoWidth: '50%',
    aspectRatio: 1024 / 276.742,
  },
  {
    id: 'prime-video',
    label: 'Prime Video',
    kind: 'mask',
    asset: '/logos/prime-video.svg',
    accent: '#35c1f1',
    logoWidth: '55%',
    aspectRatio: 84.6 / 26.6,
  },
  {
    id: 'apple-tv-plus',
    label: 'Apple TV+',
    kind: 'mask',
    asset: '/logos/apple-tv-plus.svg',
    accent: '#d6dde8',
    logoWidth: '44%',
    aspectRatio: 45.046 / 17.091,
  },
  {
    id: 'disney-plus',
    label: 'Disney+',
    kind: 'mask',
    asset: '/logos/disney-plus.svg',
    accent: '#0d74ff',
    logoWidth: '43%',
    aspectRatio: 1033 / 565,
  },
  {
    id: 'paramount-plus',
    label: 'Paramount+',
    kind: 'mask',
    asset: '/logos/paramount-plus.svg',
    accent: '#2d69ff',
    logoWidth: '52%',
    aspectRatio: 1000 / 230.363,
  },
  {
    id: 'hbo-max',
    label: 'HBO Max',
    kind: 'mask',
    asset: '/logos/hbo-max.svg',
    accent: '#8b48ff',
    logoWidth: '54%',
    aspectRatio: 1000 / 173.26677,
  },
  {
    id: 'hulu',
    label: 'Hulu',
    kind: 'mask',
    asset: '/logos/hulu.svg',
    accent: '#1ce783',
    logoWidth: '46%',
    aspectRatio: 216 / 71.15,
  },
  {
    id: 'peacock',
    label: 'Peacock',
    kind: 'mask',
    asset: '/logos/peacock.svg',
    accent: '#ff6600',
    logoWidth: '50%',
    aspectRatio: 179 / 55,
  },
  {
    id: 'max',
    label: 'Max',
    kind: 'simple',
    icon: siMax,
    accent: '#5b52ff',
    logoWidth: '22%',
    aspectRatio: 1,
  },
   {
    id: 'the-cw',
    label: 'The CW',
    kind: 'mask',
    asset: '/logos/the-cw.svg',
    accent: '#ff4500',
    logoWidth: '50%',
    aspectRatio: 1000 / 401,
  },
]

const FALLBACK_ACCENTS = [
  '#f08a4b',
  '#3a9fff',
  '#17b890',
  '#ff5d73',
  '#c17cff',
  '#f3ba2f',
]

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : normalized

  const numericValue = Number.parseInt(value, 16)

  return {
    r: (numericValue >> 16) & 255,
    g: (numericValue >> 8) & 255,
    b: numericValue & 255,
  }
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function accentFromSeed(seed: string) {
  let hash = 0

  for (const character of seed) {
    hash = (hash << 5) - hash + character.charCodeAt(0)
    hash |= 0
  }

  return FALLBACK_ACCENTS[Math.abs(hash) % FALLBACK_ACCENTS.length]
}

export function detectBrand(name: string) {
  const lowerName = name.toLowerCase()

  if (/\bhbo\s*max\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'hbo-max') ?? null
  }

  if (/\bnetflix\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'netflix') ?? null
  }

  if (/\bamazon\s+prime\b|\bprime\s+video\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'prime-video') ?? null
  }

  if (/\bapple\s*tv\+?\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'apple-tv-plus') ?? null
  }

  if (/\bdisney\+?\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'disney-plus') ?? null
  }

  if (/\bparamount\+?\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'paramount-plus') ?? null
  }

  if (/\bhulu\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'hulu') ?? null
  }
  
    if (/\bpeacock\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'peacock') ?? null
  }

  if (/\bmax\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'max') ?? null
  }

   if (/\bmax\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'max') ?? null
  }

    if (/\bthe[- ]?cw\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'the-cw') ?? null
  }

  return null
}

export function buildPalette(seed: string, brand: BrandDefinition | null): CoverPalette {
  const accent = brand?.accent ?? accentFromSeed(seed)

  return {
    accent,
    wash: withAlpha(accent, brand ? 0.09 : 0.08),
    glow: withAlpha(accent, brand ? 0.22 : 0.18),
    line: withAlpha(accent, 0.34),
  }
}
