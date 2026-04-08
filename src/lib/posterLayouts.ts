import type { AspectRatioId, CoverDesignPreset } from './designs'

export type PosterLayoutId =
  | 'cascade'
  | 'staggered-grid'
  | 'fan-stack'
  | 'cinema-columns'
  | 'hero-cluster'

type FreeformPlacement = {
  left: string
  top: string
  width: string
  rotate: string
  zIndex?: number
}

type PosterLayoutDefinition = {
  id: PosterLayoutId
  label: string
  mode: 'columns' | 'freeform'
  vars?: Record<string, string>
  ratioVars?: Partial<Record<AspectRatioId, Record<string, string>>>
  mosaicPattern?: Partial<Record<AspectRatioId, number[]>>
  columnShifts?: Partial<Record<AspectRatioId, string[]>>
  placements?: Partial<Record<AspectRatioId, FreeformPlacement[]>>
}

export type PosterLayoutPreset = {
  id: PosterLayoutId
  label: string
  mode: 'columns' | 'freeform'
  vars: Record<string, string>
  mosaicPattern: number[]
  columnShifts: string[]
  placements: FreeformPlacement[]
}

const POSTER_LAYOUTS: PosterLayoutDefinition[] = [
  {
    id: 'cascade',
    label: 'Cascade',
    mode: 'columns',
  },
  {
    id: 'staggered-grid',
    label: 'Staggered Grid',
    mode: 'freeform',
    ratioVars: {
      landscape: {
        '--mosaic-inset': '4% -2% -8% 55%',
        '--mosaic-rotate': '0deg',
        '--mosaic-scale': '1',
      },
      poster: {
        '--mosaic-inset': '10% -8% -8% 43%',
        '--mosaic-rotate': '0deg',
        '--mosaic-scale': '1',
      },
      square: {
        '--mosaic-inset': '3% -8% -10% 46%',
        '--mosaic-rotate': '0deg',
        '--mosaic-scale': '1',
      },
    },
    placements: {
      landscape: [
        { left: '0%', top: '0%', width: '29%', rotate: '-3deg' },
        { left: '33%', top: '4%', width: '31%', rotate: '2deg' },
        { left: '67%', top: '1%', width: '29%', rotate: '-1deg' },
        { left: '3%', top: '33%', width: '28%', rotate: '1deg' },
        { left: '36%', top: '35%', width: '31%', rotate: '-2deg' },
        { left: '69%', top: '34%', width: '27%', rotate: '1deg' },
        { left: '0%', top: '67%', width: '31%', rotate: '-2deg' },
        { left: '37%', top: '69%', width: '31%', rotate: '1deg' },
        { left: '70%', top: '68%', width: '27%', rotate: '0deg' },
      ],
      poster: [
        { left: '0%', top: '0%', width: '28%', rotate: '-3deg' },
        { left: '35%', top: '2%', width: '30%', rotate: '2deg' },
        { left: '69%', top: '0%', width: '28%', rotate: '-1deg' },
        { left: '2%', top: '31%', width: '28%', rotate: '1deg' },
        { left: '36%', top: '34%', width: '30%', rotate: '-2deg' },
        { left: '70%', top: '33%', width: '27%', rotate: '1deg' },
        { left: '1%', top: '66%', width: '29%', rotate: '-2deg' },
        { left: '38%', top: '69%', width: '29%', rotate: '1deg' },
      ],
      square: [
        { left: '0%', top: '0%', width: '29%', rotate: '-3deg' },
        { left: '34%', top: '3%', width: '31%', rotate: '2deg' },
        { left: '68%', top: '0%', width: '28%', rotate: '-1deg' },
        { left: '2%', top: '36%', width: '28%', rotate: '1deg' },
        { left: '37%', top: '38%', width: '30%', rotate: '-2deg' },
        { left: '70%', top: '37%', width: '27%', rotate: '1deg' },
        { left: '4%', top: '72%', width: '29%', rotate: '-2deg' },
        { left: '40%', top: '74%', width: '29%', rotate: '1deg' },
      ],
    },
  },
  {
    id: 'fan-stack',
    label: 'Fan Stack',
    mode: 'freeform',
    ratioVars: {
      landscape: {
        '--mosaic-inset': '12% -2% 8% 55%',
        '--mosaic-rotate': '0deg',
      },
      poster: {
        '--mosaic-inset': '24% -6% 12% 39%',
        '--mosaic-rotate': '0deg',
      },
      square: {
        '--mosaic-inset': '14% -4% 12% 45%',
        '--mosaic-rotate': '0deg',
      },
    },
    placements: {
      landscape: [
        { left: '4%', top: '18%', width: '27%', rotate: '-10deg', zIndex: 1 },
        { left: '16%', top: '29%', width: '25%', rotate: '-5deg', zIndex: 2 },
        { left: '33%', top: '10%', width: '30%', rotate: '-1deg', zIndex: 6 },
        { left: '49%', top: '25%', width: '27%', rotate: '4deg', zIndex: 4 },
        { left: '63%', top: '8%', width: '29%', rotate: '9deg', zIndex: 3 },
        { left: '74%', top: '22%', width: '24%', rotate: '5deg', zIndex: 5 },
      ],
      poster: [
        { left: '2%', top: '24%', width: '34%', rotate: '-10deg', zIndex: 1 },
        { left: '16%', top: '8%', width: '36%', rotate: '-3deg', zIndex: 2 },
        { left: '31%', top: '28%', width: '38%', rotate: '1deg', zIndex: 6 },
        { left: '48%', top: '12%', width: '37%', rotate: '8deg', zIndex: 3 },
        { left: '63%', top: '35%', width: '31%', rotate: '4deg', zIndex: 4 },
      ],
      square: [
        { left: '1%', top: '20%', width: '30%', rotate: '-10deg', zIndex: 1 },
        { left: '14%', top: '7%', width: '32%', rotate: '-3deg', zIndex: 2 },
        { left: '31%', top: '24%', width: '34%', rotate: '0deg', zIndex: 6 },
        { left: '49%', top: '10%', width: '32%', rotate: '7deg', zIndex: 3 },
        { left: '66%', top: '27%', width: '28%', rotate: '3deg', zIndex: 4 },
      ],
    },
  },
  {
    id: 'cinema-columns',
    label: 'Cinema Columns',
    mode: 'columns',
    ratioVars: {
      landscape: {
        '--mosaic-inset': '-8% -4% -14% 58%',
        '--mosaic-rotate': '5deg',
        '--mosaic-gap': '1.8%',
        '--mosaic-scale': '1.03',
      },
      poster: {
        '--mosaic-inset': '8% -10% -18% 45%',
        '--mosaic-rotate': '3.6deg',
        '--mosaic-gap': '1.8%',
        '--mosaic-scale': '1.04',
      },
      square: {
        '--mosaic-inset': '0% -10% -14% 48%',
        '--mosaic-rotate': '4.5deg',
        '--mosaic-gap': '1.8%',
        '--mosaic-scale': '1.03',
      },
    },
    mosaicPattern: {
      landscape: [6, 6, 5],
      poster: [7, 7],
      square: [6, 6, 6],
    },
    columnShifts: {
      landscape: ['-5%', '2%', '-3%'],
      poster: ['-4%', '2%'],
      square: ['-5%', '1%', '-3%'],
    },
  },
  {
    id: 'hero-cluster',
    label: 'Hero Cluster',
    mode: 'freeform',
    ratioVars: {
      landscape: {
        '--mosaic-inset': '8% -2% 0% 55%',
        '--mosaic-rotate': '0deg',
      },
      poster: {
        '--mosaic-inset': '14% -5% 6% 42%',
        '--mosaic-rotate': '0deg',
      },
      square: {
        '--mosaic-inset': '8% -5% 4% 47%',
        '--mosaic-rotate': '0deg',
      },
    },
    placements: {
      landscape: [
        { left: '3%', top: '4%', width: '26%', rotate: '-7deg', zIndex: 1 },
        { left: '10%', top: '58%', width: '24%', rotate: '-4deg', zIndex: 2 },
        { left: '34%', top: '16%', width: '37%', rotate: '2deg', zIndex: 5 },
        { left: '72%', top: '4%', width: '22%', rotate: '8deg', zIndex: 3 },
        { left: '74%', top: '54%', width: '22%', rotate: '4deg', zIndex: 4 },
      ],
      poster: [
        { left: '1%', top: '8%', width: '33%', rotate: '-8deg', zIndex: 1 },
        { left: '14%', top: '59%', width: '29%', rotate: '-4deg', zIndex: 2 },
        { left: '31%', top: '20%', width: '46%', rotate: '2deg', zIndex: 5 },
        { left: '69%', top: '9%', width: '27%', rotate: '8deg', zIndex: 3 },
        { left: '71%', top: '62%', width: '24%', rotate: '4deg', zIndex: 4 },
      ],
      square: [
        { left: '2%', top: '7%', width: '27%', rotate: '-8deg', zIndex: 1 },
        { left: '12%', top: '56%', width: '25%', rotate: '-4deg', zIndex: 2 },
        { left: '33%', top: '18%', width: '40%', rotate: '2deg', zIndex: 5 },
        { left: '72%', top: '8%', width: '22%', rotate: '7deg', zIndex: 3 },
        { left: '74%', top: '56%', width: '21%', rotate: '4deg', zIndex: 4 },
      ],
    },
  },
]

export const DEFAULT_POSTER_LAYOUT: PosterLayoutId = 'cascade'

export const POSTER_LAYOUT_OPTIONS = POSTER_LAYOUTS.map((layout) => ({
  id: layout.id,
  label: layout.label,
}))

export function getPosterLayoutPreset(
  preset: CoverDesignPreset,
  layoutId: PosterLayoutId,
): PosterLayoutPreset {
  const layout =
    POSTER_LAYOUTS.find((entry) => entry.id === layoutId) ?? POSTER_LAYOUTS[0]
  const aspectRatio = preset.aspectRatio

  return {
    id: layout.id,
    label: layout.label,
    mode: layout.mode,
    vars: {
      ...layout.vars,
      ...layout.ratioVars?.[aspectRatio],
    },
    mosaicPattern: layout.mosaicPattern?.[aspectRatio] ?? preset.mosaicPattern,
    columnShifts: layout.columnShifts?.[aspectRatio] ?? preset.columnShifts,
    placements: layout.placements?.[aspectRatio] ?? [],
  }
}
