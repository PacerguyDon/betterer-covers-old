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
    id: 'discovery',
    label: 'Discovery Channel',
    kind: 'mask',
    asset: '/logos/discovery.svg',
    accent: '#ff5313',
    logoWidth: '60%',
    aspectRatio: 1150 / 238.05,
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
    logoWidth: '60%',
    aspectRatio: 196.9 / 60.5,
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
    id: 'angel',
    label: 'Angel Studios',
    kind: 'mask',
    asset: '/logos/angel.svg',
    accent: '#5a470f',
    logoWidth: '70%',
    aspectRatio: 90 / 32,
  },
   {
    id: 'the-cw',
    label: 'The CW',
    kind: 'mask',
    asset: '/logos/the-cw.svg',
    accent: '#008000',
    logoWidth: '50%',
    aspectRatio: 950 / 381,
  },
  {
    id: 'tv-land',
    label: 'TV Land',
    kind: 'mask',
    asset: '/logos/tv-land.svg',
    accent: '#00a9e0',
    logoWidth: '50%',
    aspectRatio: 2500 / 2500,
  },
  {
    id: 'abc',
    label: 'Abc',
    kind: 'mask',
    asset: '/logos/abc.svg',
    accent: '#000000',
    logoWidth: '35%',
    aspectRatio: 150 / 150,
  },
  {
    id: 'cbs',
    label: 'Cbs',
    kind: 'mask',
    asset: '/logos/cbs.svg',
    accent: '#005daa',
    logoWidth: '50%',
    aspectRatio: 1000 / 288,
  },
  {
    id: 'fox',
    label: 'Fox',
    kind: 'mask',
    asset: '/logos/fox.svg',
    accent: '003366',
    logoWidth: '50%',
    aspectRatio: 850 / 358,
  },
  {
    id: 'nbc',
    label: 'Nbc',
    kind: 'mask',
    asset: '/logos/nbc.svg',
    accent: '#0089d0',
    logoWidth: '35%',
    aspectRatio: 453 / 479,
  },
  {
    id: 'history',
    label: 'History',
    kind: 'mask',
    asset: '/logos/history.svg',
    accent: 'f7a800',
    logoWidth: '35%',
    aspectRatio: 800 / 839,
  },
  {
    id: 'lifetime',
    label: 'Lifetime',
    kind: 'mask',
    asset: '/logos/lifetime.svg',
    accent: '#c2002f',
    logoWidth: '50%',
    aspectRatio: 897 / 272,
  },
  {
    id: 'amc-plus',
    label: 'Amc Plus',
    kind: 'mask',
    asset: '/logos/amc-plus.svg',
    accent: '#00eee6',
    logoWidth: '65%',
    aspectRatio: 210 / 157.5,
  },
  {
    id: 'a&e',
    label: 'A&E',
    kind: 'mask',
    asset: '/logos/a&e.svg',
    accent: '#000000',
    logoWidth: '40%',
    aspectRatio: 221 / 114.75,
  },
  {
    id: 'comedy-central',
    label: 'Comedy Central',
    kind: 'mask',
    asset: '/logos/comedy-central.svg',
    accent: '#fdc600',
    logoWidth: '50%',
    aspectRatio: 1000 / 345,
  },
  {
    id: 'investigation-discovery',
    label: 'Investigation Discovery',
    kind: 'mask',
    asset: '/logos/investigation-discovery.svg',
    accent: '#e21f26',
    logoWidth: '40%',
    aspectRatio: 153 / 144.5,
  },
  {
    id: 'the-wb',
    label: 'The WB',
    kind: 'mask',
    asset: '/logos/the-wb.svg',
    accent: '#002272',
    logoWidth: '65%',
    aspectRatio: 248 / 127,
  },
  {
    id: 'hgtv',
    label: 'HGTV',
    kind: 'mask',
    asset: '/logos/hgtv.svg',
    accent: '#17b890',
    logoWidth: '50%',
    aspectRatio: 215 / 104,
  },
  {
    id: '20th-century-fox',
    label: '20th Century Fox',
    kind: 'mask',
    asset: '/logos/20th.svg',
    accent: '#f3ba2f',
    logoWidth: '50%',
    aspectRatio: 170 / 150,
  },
  {
    id: 'columbia',
    label: 'Columbia',
    kind: 'mask',
    asset: '/logos/columbia.svg',
    accent: '#3c2ff3',
    logoWidth: '50%',
    aspectRatio: 1000 / 269,
  },
  {
    id: 'mgm',
    label: 'MGM',
    kind: 'mask',
    asset: '/logos/mgm.svg',
    accent: '#f3a82f',
    logoWidth: '50%',
    aspectRatio: 1000 / 583,
  },
  {
    id: 'paramount',
    label: 'Paramount Pictures',
    kind: 'mask',
    asset: '/logos/paramount.svg',
    accent: '#035ae8',
    logoWidth: '50%',
    aspectRatio: 358 / 280,
  },
  {
    id: 'pixar',
    label: 'Pixar',
    kind: 'mask',
    asset: '/logos/pixar.svg',
    accent: '#5e9aae',
    logoWidth: '50%',
    aspectRatio: 667 / 108,
  },
  {
    id: 'touchstone',
    label: 'Touchstone',
    kind: 'mask',
    asset: '/logos/touchstone.svg',
    accent: '#0814eb',
    logoWidth: '70%',
    aspectRatio: 2000 / 817,
  },
  {
    id: 'universal',
    label: 'Universal',
    kind: 'mask',
    asset: '/logos/universal.svg',
    accent: '#2303f5',
    logoWidth: '50%',
    aspectRatio: 1000 / 529,
  },
  {
    id: 'warner-bros',
    label: 'Warner Bros',
    kind: 'mask',
    asset: '/logos/wb.svg',
    accent: '#0374f5',
    logoWidth: '40%',
    aspectRatio: 355 / 370,
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

  if (/\bparamount\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'paramount') ?? null
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

  if (/\bangel\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'angel') ?? null
  }
  
  if (/\bpeacock\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'peacock') ?? null
  }

  if (/\bmax\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'max') ?? null
  }

    if (/\b20th\s*century(?:\s*fox)?\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === '20th-century-fox') ?? null
  }

  if (/\bwarner\s*bros?\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'warner-bros') ?? null
  }

   if (/\bthe[- ]?cw\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'the-cw') ?? null
  }

  if (/\btv[- ]?land\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'tv-land') ?? null
  }

  if (/\binvestigation[- ]?discovery\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'investigation-discovery') ?? null
  }

  if (/\bdiscovery\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'discovery') ?? null
  }

  if (/\babc\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'abc') ?? null
  }

  if (/\bcbs\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'cbs') ?? null
  }

  if (/\bfox\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'fox') ?? null
  }

  if (/\bnbc\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'nbc') ?? null
  }

  if (/\blifetime\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'lifetime') ?? null
  }

  if (/\bhistory\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'history') ?? null
  }

  if (/\bamc\b\s*(?:\+|-?plus)?/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'amc-plus') ?? null
  }

  if (/\bcomedy[- ]?central\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'comedy-central') ?? null
  }

  if (/\bthe[- ]?wb\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'the-wb') ?? null
  }

  if (/\ba\s*(?:&|and)\s*e\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'a&e') ?? null 
  }
  
  if (/\bhgtv\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'hgtv') ?? null
  }

  if (/\bcolumbia\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'columbia') ?? null
  }

  if (/\bmgm\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'mgm') ?? null
  }
  
  if (/\bpixar\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'pixar') ?? null
  }

  if (/\btouchstone\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'touchstone') ?? null
  }

  if (/\buniversal\b/.test(lowerName)) {
    return BRAND_LIBRARY.find((brand) => brand.id === 'universal') ?? null
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
