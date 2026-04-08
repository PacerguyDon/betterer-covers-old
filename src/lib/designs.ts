export type AspectRatioId = 'landscape' | 'poster' | 'square'
export type DesignFamilyId =
  | 'studio'
  | 'ember'
  | 'aurora'
  | 'dusk'
  | 'monolith'

type AspectRatioConfig = {
  id: AspectRatioId
  label: string
  frameAspect: string
  frameMaxWidth: string
  previewScale: number
  exportWidth: number
  exportHeight: number
  mosaicPattern: number[]
  columnShifts: string[]
  vars: Record<string, string>
}

type DesignFamily = {
  id: DesignFamilyId
  label: string
  vars?: Record<string, string>
  ratioVars?: Partial<Record<AspectRatioId, Record<string, string>>>
  mosaicPattern?: Partial<Record<AspectRatioId, number[]>>
  columnShifts?: Partial<Record<AspectRatioId, string[]>>
  logoScale?: Partial<Record<AspectRatioId, number>>
}

export type CoverDesignPreset = {
  id: string
  familyId: DesignFamilyId
  label: string
  aspectRatio: AspectRatioId
  aspectLabel: string
  frameAspect: string
  frameMaxWidth: string
  previewScale: number
  exportWidth: number
  exportHeight: number
  mosaicPattern: number[]
  columnShifts: string[]
  logoScale: number
  vars: Record<string, string>
}

export const DEFAULT_ASPECT_RATIO: AspectRatioId = 'landscape'
export const DEFAULT_DESIGN_FAMILY: DesignFamilyId = 'studio'

const ASPECT_RATIOS: Record<AspectRatioId, AspectRatioConfig> = {
  landscape: {
    id: 'landscape',
    label: 'Landscape 16:9',
    frameAspect: '990 / 557',
    frameMaxWidth: '100%',
    previewScale: 1,
    exportWidth: 990,
    exportHeight: 557,
    mosaicPattern: [5, 4, 5],
    columnShifts: ['-11%', '4%', '-6%'],
    vars: {
      '--copy-inset': '0 45% 0 0',
      '--copy-padding': '0 8.2%',
      '--copy-brand-padding': '0 5.4%',
      '--copy-justify': 'center',
      '--copy-align': 'center',
      '--copy-text-align': 'left',
      '--copy-content-align': 'flex-start',
      '--copy-width': '72%',
      '--brand-copy-width': '90%',
      '--title-size': 'clamp(3.1rem, 7vw, 6.6rem)',
      '--title-compact-size': 'clamp(2.45rem, 5.6vw, 4.95rem)',
      '--title-max-width': '82%',
      '--tint-fade-background':
        'linear-gradient(90deg, transparent 54%, var(--stage-tint-line, var(--accent-line)) 72%, transparent 88%)',
      '--fade-background':
        'linear-gradient(90deg, rgba(12, 10, 10, 0.98) 0%, rgba(12, 10, 10, 0.95) 28%, rgba(12, 10, 10, 0.82) 45%, rgba(12, 10, 10, 0.46) 61%, rgba(12, 10, 10, 0.12) 74%, rgba(12, 10, 10, 0) 86%), linear-gradient(90deg, transparent 54%, var(--accent-line) 72%, transparent 88%)',
      '--mosaic-inset': '-15% -8% -18% 60%',
      '--mosaic-rotate': '10.5deg',
      '--mosaic-gap': '2.15%',
      '--mosaic-opacity': '1',
      '--mosaic-scale': '1',
      '--poster-radius': '9.5%',
      '--sheen-inset': '-28% auto -20% 50%',
      '--sheen-width': '24%',
      '--sheen-rotate': '-11deg',
      '--sheen-opacity': '0.26',
    },
  },
  poster: {
    id: 'poster',
    label: 'Poster 2:3',
    frameAspect: '557 / 836',
    frameMaxWidth: '24rem',
    previewScale: 0.68,
    exportWidth: 557,
    exportHeight: 836,
    mosaicPattern: [6, 6],
    columnShifts: ['-10%', '4%'],
    vars: {
      '--copy-inset': '0 30% 0 0',
      '--copy-padding': '0 9.8%',
      '--copy-brand-padding': '0 6.8%',
      '--copy-justify': 'center',
      '--copy-align': 'center',
      '--copy-text-align': 'left',
      '--copy-content-align': 'flex-start',
      '--copy-width': '88%',
      '--brand-copy-width': '92%',
      '--title-size': 'clamp(4.15rem, 11.9vw, 6.75rem)',
      '--title-compact-size': 'clamp(3rem, 8.75vw, 5.15rem)',
      '--title-max-width': '94%',
      '--tint-fade-background':
        'linear-gradient(90deg, transparent 63%, var(--stage-tint-line, var(--accent-line)) 79%, transparent 92%)',
      '--fade-background':
        'linear-gradient(90deg, rgba(12, 10, 10, 0.99) 0%, rgba(12, 10, 10, 0.96) 30%, rgba(12, 10, 10, 0.84) 46%, rgba(12, 10, 10, 0.52) 63%, rgba(12, 10, 10, 0.16) 78%, rgba(12, 10, 10, 0) 90%), linear-gradient(180deg, rgba(12, 10, 10, 0.12) 0%, rgba(12, 10, 10, 0) 28%, rgba(12, 10, 10, 0.08) 100%), linear-gradient(90deg, transparent 63%, var(--accent-line) 79%, transparent 92%)',
      '--mosaic-inset': '8% -12% -18% 48%',
      '--mosaic-rotate': '6.25deg',
      '--mosaic-gap': '2.35%',
      '--mosaic-opacity': '1',
      '--mosaic-scale': '1.07',
      '--poster-radius': '9%',
      '--sheen-inset': '-14% auto -10% 42%',
      '--sheen-width': '36%',
      '--sheen-rotate': '-8deg',
      '--sheen-opacity': '0.18',
    },
  },
  square: {
    id: 'square',
    label: 'Square 1:1',
    frameAspect: '557 / 557',
    frameMaxWidth: '27rem',
    previewScale: 0.74,
    exportWidth: 557,
    exportHeight: 557,
    mosaicPattern: [6, 5, 6],
    columnShifts: ['-15%', '3%', '-9%'],
    vars: {
      '--copy-inset': '0 36% 0 0',
      '--copy-padding': '0 8.4%',
      '--copy-brand-padding': '0 6%',
      '--copy-justify': 'center',
      '--copy-align': 'center',
      '--copy-text-align': 'left',
      '--copy-content-align': 'flex-start',
      '--copy-width': '82%',
      '--brand-copy-width': '94%',
      '--title-size': 'clamp(4.7rem, 13.4vw, 7.4rem)',
      '--title-compact-size': 'clamp(3.5rem, 10vw, 5.7rem)',
      '--title-max-width': '88%',
      '--tint-fade-background':
        'linear-gradient(90deg, transparent 56%, var(--stage-tint-line, var(--accent-line)) 74%, transparent 88%)',
      '--fade-background':
        'linear-gradient(90deg, rgba(12, 10, 10, 0.99) 0%, rgba(12, 10, 10, 0.95) 22%, rgba(12, 10, 10, 0.84) 40%, rgba(12, 10, 10, 0.48) 58%, rgba(12, 10, 10, 0.14) 72%, rgba(12, 10, 10, 0) 84%), linear-gradient(180deg, rgba(12, 10, 10, 0.08) 0%, rgba(12, 10, 10, 0) 24%, rgba(12, 10, 10, 0.06) 100%), linear-gradient(90deg, transparent 56%, var(--accent-line) 74%, transparent 88%)',
      '--mosaic-inset': '-4% -12% -18% 48%',
      '--mosaic-rotate': '8.75deg',
      '--mosaic-gap': '2.15%',
      '--mosaic-opacity': '1',
      '--mosaic-scale': '1.03',
      '--poster-radius': '9%',
      '--sheen-inset': '-18% auto -12% 44%',
      '--sheen-width': '32%',
      '--sheen-rotate': '-9deg',
      '--sheen-opacity': '0.2',
    },
  },
}

const DESIGN_FAMILIES: DesignFamily[] = [
  {
    id: 'studio',
    label: 'Studio Split',
    vars: {
      '--stage-background':
        'linear-gradient(135deg, #231713 0%, #181213 44%, #111114 100%)',
      '--surface-overlay':
        'linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 18%), linear-gradient(90deg, rgba(255, 255, 255, 0.02), transparent 16%)',
      '--sheen-background':
        'linear-gradient(90deg, transparent, rgba(255, 168, 125, 0.18), transparent)',
      '--copy-surface': 'linear-gradient(180deg, transparent, transparent)',
      '--copy-surface-border': '1px solid transparent',
      '--copy-surface-radius': '32px',
      '--copy-surface-opacity': '0',
      '--copy-surface-blur': '0px',
      '--copy-surface-shadow': 'none',
    },
    logoScale: {
      landscape: 1.12,
      poster: 1.18,
      square: 1.16,
    },
  },
  {
    id: 'ember',
    label: 'Signal Ember',
    vars: {
      '--stage-background':
        'linear-gradient(140deg, #2b1714 0%, #1f1313 42%, #101115 100%)',
      '--surface-overlay':
        'linear-gradient(180deg, rgba(255, 255, 255, 0.028), transparent 16%), linear-gradient(90deg, rgba(255, 191, 132, 0.035), transparent 18%)',
      '--sheen-background':
        'linear-gradient(90deg, transparent, rgba(255, 151, 106, 0.22), transparent)',
    },
    ratioVars: {
      landscape: {
        '--copy-padding': '2% 8.2% 0',
        '--mosaic-inset': '-14% -9% -18% 59%',
        '--mosaic-rotate': '9deg',
      },
      poster: {
        '--copy-inset': '0 28% 0 0',
        '--mosaic-inset': '5% -11% -19% 47%',
        '--mosaic-rotate': '5.75deg',
      },
      square: {
        '--copy-inset': '0 34% 0 0',
        '--mosaic-inset': '-2% -10% -16% 47%',
        '--mosaic-rotate': '8.25deg',
      },
    },
    columnShifts: {
      landscape: ['-9%', '6%', '-4%'],
      poster: ['-11%', '5%', '-6%'],
      square: ['-12%', '4%', '-7%'],
    },
    logoScale: {
      landscape: 1.16,
      poster: 1.22,
      square: 1.18,
    },
  },
  {
    id: 'aurora',
    label: 'Blue Horizon',
    vars: {
      '--stage-background':
        'linear-gradient(140deg, #10141b 0%, #16131f 42%, #111214 100%)',
      '--surface-overlay':
        'linear-gradient(180deg, rgba(255, 255, 255, 0.022), transparent 16%), linear-gradient(90deg, rgba(119, 203, 255, 0.05), transparent 18%)',
      '--sheen-background':
        'linear-gradient(90deg, transparent, rgba(108, 185, 255, 0.18), transparent)',
    },
    ratioVars: {
      landscape: {
        '--mosaic-inset': '-16% -8% -18% 61%',
        '--mosaic-rotate': '11.5deg',
      },
      poster: {
        '--mosaic-inset': '8% -10% -18% 49%',
        '--mosaic-rotate': '6.5deg',
      },
      square: {
        '--mosaic-inset': '2% -8% -16% 49%',
        '--mosaic-rotate': '9.25deg',
      },
    },
    columnShifts: {
      landscape: ['-13%', '1%', '-8%'],
      poster: ['-15%', '1%', '-9%'],
      square: ['-16%', '0%', '-10%'],
    },
    logoScale: {
      landscape: 1.1,
      poster: 1.15,
      square: 1.12,
    },
  },
  {
    id: 'dusk',
    label: 'Afterglow Noir',
    vars: {
      '--stage-background':
        'linear-gradient(145deg, #17151c 0%, #1a1217 40%, #231411 100%)',
      '--surface-overlay':
        'linear-gradient(180deg, rgba(255, 255, 255, 0.022), transparent 16%), linear-gradient(90deg, rgba(255, 130, 96, 0.03), transparent 18%)',
      '--sheen-background':
        'linear-gradient(90deg, transparent, rgba(255, 122, 94, 0.18), transparent)',
    },
    ratioVars: {
      landscape: {
        '--copy-padding': '2% 8.2% 0',
        '--mosaic-inset': '-18% -9% -14% 60%',
        '--mosaic-rotate': '12deg',
      },
      poster: {
        '--copy-inset': '0 29% 0 0',
        '--mosaic-inset': '6% -11% -20% 48%',
        '--mosaic-rotate': '6.9deg',
      },
      square: {
        '--copy-inset': '0 35% 2% 0',
        '--mosaic-inset': '-2% -10% -18% 48%',
        '--mosaic-rotate': '9.75deg',
      },
    },
    columnShifts: {
      landscape: ['-15%', '1%', '-9%'],
      poster: ['-17%', '2%', '-10%'],
      square: ['-18%', '1%', '-11%'],
    },
    logoScale: {
      landscape: 1.1,
      poster: 1.16,
      square: 1.12,
    },
  },
  {
    id: 'monolith',
    label: 'Monolith Edge',
    vars: {
      '--stage-background':
        'linear-gradient(140deg, #141111 0%, #101316 46%, #101215 100%)',
      '--surface-overlay':
        'linear-gradient(180deg, rgba(255, 255, 255, 0.018), transparent 15%), linear-gradient(90deg, rgba(255, 255, 255, 0.012), transparent 14%)',
      '--sheen-background':
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    },
    ratioVars: {
      landscape: {
        '--copy-inset': '0 51% 0 0',
        '--mosaic-inset': '-10% -6% -14% 66%',
        '--mosaic-rotate': '5.5deg',
      },
      poster: {
        '--copy-inset': '0 34% 0 0',
        '--mosaic-inset': '11% -5% -16% 56%',
        '--mosaic-rotate': '3.85deg',
      },
      square: {
        '--copy-inset': '0 40% 0 0',
        '--mosaic-inset': '2% -5% -14% 56%',
        '--mosaic-rotate': '4.75deg',
      },
    },
    mosaicPattern: {
      landscape: [5, 5, 4],
      poster: [6, 6],
      square: [6, 6, 5],
    },
    columnShifts: {
      landscape: ['-4%', '5%', '-2%'],
      poster: ['-5%', '3%'],
      square: ['-6%', '4%', '-3%'],
    },
    logoScale: {
      landscape: 1.08,
      poster: 1.14,
      square: 1.1,
    },
  },
]

export const ASPECT_RATIO_OPTIONS = Object.values(ASPECT_RATIOS).map((ratio) => ({
  id: ratio.id,
  label: ratio.label,
}))

function buildPreset(
  aspectRatio: AspectRatioId,
  family: DesignFamily,
): CoverDesignPreset {
  const ratio = ASPECT_RATIOS[aspectRatio]

  return {
    id: `${aspectRatio}-${family.id}`,
    familyId: family.id,
    label: family.label,
    aspectRatio,
    aspectLabel: ratio.label,
    frameAspect: ratio.frameAspect,
    frameMaxWidth: ratio.frameMaxWidth,
    previewScale: ratio.previewScale,
    exportWidth: ratio.exportWidth,
    exportHeight: ratio.exportHeight,
    mosaicPattern: family.mosaicPattern?.[aspectRatio] ?? ratio.mosaicPattern,
    columnShifts: family.columnShifts?.[aspectRatio] ?? ratio.columnShifts,
    logoScale: family.logoScale?.[aspectRatio] ?? 1,
    vars: {
      ...ratio.vars,
      ...family.vars,
      ...family.ratioVars?.[aspectRatio],
    },
  }
}

export function getDesignOptions(aspectRatio: AspectRatioId) {
  return DESIGN_FAMILIES.map((family) => buildPreset(aspectRatio, family))
}

export function getDesignPreset(
  aspectRatio: AspectRatioId,
  familyId: DesignFamilyId,
) {
  const family =
    DESIGN_FAMILIES.find((entry) => entry.id === familyId) ?? DESIGN_FAMILIES[0]

  return buildPreset(aspectRatio, family)
}
