import { forwardRef } from 'react'
import type { CSSProperties } from 'react'

import type { BrandDefinition, CoverPalette } from '../lib/brands'
import type { CoverDesignPreset } from '../lib/designs'
import type { PosterLayoutPreset } from '../lib/posterLayouts'
import type { PosterCard } from '../types'

const LOGO_VISUAL_BOOST = {
  landscape: 1.62,
  poster: 1.58,
  square: 1.6,
} as const

type CoverPreviewProps = {
  brand: BrandDefinition | null
  posters: PosterCard[]
  title: string
  titleScale: number
  useBrandMark: boolean
  backgroundMode: 'default' | 'custom' | 'transparent' | 'tint'
  palette: CoverPalette
  preset: CoverDesignPreset
  posterLayout: PosterLayoutPreset
  tintBackground: string | null
  tintLine: string | null
  tintWash: string | null
  titleFontFamily: string
  backgroundOverride: string | null
}

function getWrappedPoster(posters: PosterCard[], index: number) {
  if (posters.length === 0) {
    return {
      src: null,
      title: 'Placeholder',
    }
  }

  const normalizedIndex = ((index % posters.length) + posters.length) % posters.length
  return posters[normalizedIndex]
}

function splitPosters(
  posters: PosterCard[],
  pattern: number[],
  bleedCount: number,
) {
  const columns: PosterCard[][] = []
  let cursor = 0

  for (const count of pattern) {
    const column: PosterCard[] = []

    for (let bleedIndex = bleedCount; bleedIndex > 0; bleedIndex -= 1) {
      column.push(getWrappedPoster(posters, cursor - bleedIndex))
    }

    for (let index = 0; index < count; index += 1) {
      column.push(getWrappedPoster(posters, cursor + index))
    }

    for (let bleedIndex = 0; bleedIndex < bleedCount; bleedIndex += 1) {
      column.push(getWrappedPoster(posters, cursor + count + bleedIndex))
    }

    columns.push(column)
    cursor += count
  }

  return columns
}

function buildFreeformPosters(
  posters: PosterCard[],
  placements: PosterLayoutPreset['placements'],
) {
  return placements.map((placement, index) => ({
    ...placement,
    ...getWrappedPoster(posters, index),
  }))
}

function scaleLength(length: string, factor: number) {
  const match = length.match(/^(-?\d*\.?\d+)(.*)$/)

  if (!match) {
    return length
  }

  const [, rawValue, unit] = match
  return `${Number.parseFloat(rawValue) * factor}${unit}`
}

function scaleCssExpression(expression: string, factor: number) {
  if (factor === 1) {
    return expression
  }

  return expression.replace(
    /(-?\d*\.?\d+)(rem|vw|vh|px|%|em)/g,
    (_, rawValue: string, unit: string) =>
      `${Number.parseFloat(rawValue) * factor}${unit}`,
  )
}

function BrandMark({
  brand,
  preset,
}: {
  brand: BrandDefinition
  preset: CoverDesignPreset
}) {
  const baseStyle = {
    '--logo-width': scaleLength(
      brand.logoWidth,
      preset.logoScale * LOGO_VISUAL_BOOST[preset.aspectRatio],
    ),
    '--logo-aspect': `${brand.aspectRatio}`,
  } as CSSProperties

  if (brand.kind === 'mask') {
    return (
      <div
        aria-label={brand.label}
        className="brand-mark brand-mark--mask"
        role="img"
        style={
          {
            ...baseStyle,
            '--logo-mask': `url(${brand.asset})`,
          } as CSSProperties
        }
      />
    )
  }

  return (
    <div className="brand-mark brand-mark--simple" style={baseStyle}>
      <svg aria-label={brand.label} role="img" viewBox="0 0 24 24">
        <path d={brand.icon.path} />
      </svg>
    </div>
  )
}

export const CoverPreview = forwardRef<HTMLDivElement, CoverPreviewProps>(
  function CoverPreview(
    {
      backgroundOverride,
      backgroundMode,
      brand,
      posterLayout,
      posters,
      tintBackground,
      tintLine,
      tintWash,
      title,
      titleFontFamily,
      titleScale,
      useBrandMark,
      palette,
      preset,
    },
    ref,
  ) {
    const bleedCount = preset.aspectRatio === 'landscape' ? 2 : 3
    const columns =
      posterLayout.mode === 'columns'
        ? splitPosters(posters, posterLayout.mosaicPattern, bleedCount)
        : []
    const freeformPosters =
      posterLayout.mode === 'freeform'
        ? buildFreeformPosters(posters, posterLayout.placements)
        : []
    const titleClassName =
      title.length > 24
        ? 'preview-stage__title preview-stage__title--compact'
        : 'preview-stage__title'
    const scaledTitleSize = scaleCssExpression(
      preset.vars['--title-size'],
      titleScale,
    )
    const scaledCompactTitleSize = scaleCssExpression(
      preset.vars['--title-compact-size'],
      titleScale,
    )

    return (
      <div
        className={`preview-stage ${
          backgroundMode === 'transparent'
            ? 'preview-stage--transparent'
            : backgroundMode === 'tint'
              ? 'preview-stage--tint'
              : ''
        }`}
        ref={ref}
        style={
          {
            '--accent': palette.accent,
            '--accent-line': palette.line,
            '--accent-glow': palette.glow,
            '--accent-wash': palette.wash,
            ...(tintBackground
              ? { '--stage-tint-background': tintBackground }
              : {}),
            ...(tintLine ? { '--stage-tint-line': tintLine } : {}),
            ...(tintWash ? { '--stage-tint-wash': tintWash } : {}),
            '--title-font-family': titleFontFamily,
            ...(backgroundOverride
              ? { '--custom-stage-background': backgroundOverride }
              : {}),
            ...preset.vars,
            '--title-size': scaledTitleSize,
            '--title-compact-size': scaledCompactTitleSize,
            ...posterLayout.vars,
          } as CSSProperties
        }
      >
        <div className="preview-stage__grain" />
        <div className="preview-stage__sheen" />
        <div
          className={`preview-stage__copy ${
            useBrandMark && brand ? 'preview-stage__copy--brand' : ''
          }`}
        >
          <div
            className={`preview-stage__copy-inner ${
              useBrandMark && brand ? 'preview-stage__copy-inner--brand' : ''
            }`}
          >
            {useBrandMark && brand ? (
              <BrandMark brand={brand} preset={preset} />
            ) : (
              <div className={titleClassName}>{title}</div>
            )}
          </div>
        </div>

        <div className="preview-stage__fade" />

        <div
          className={`preview-stage__mosaic preview-stage__mosaic--${posterLayout.mode}`}
          aria-hidden="true"
        >
          {posterLayout.mode === 'columns'
            ? columns.map((column, columnIndex) => (
                <div
                  className="preview-stage__column"
                  key={`column-${columnIndex + 1}`}
                  style={
                    {
                      '--column-shift':
                        posterLayout.columnShifts[columnIndex] ?? '0%',
                    } as CSSProperties
                  }
                >
                  {column.map((poster, posterIndex) => (
                    <figure
                      className="preview-stage__poster"
                      data-filled={poster.src ? 'true' : 'false'}
                      key={`${columnIndex + 1}-${posterIndex + 1}-${poster.title}`}
                    >
                      {poster.src ? (
                        <img
                          alt={poster.title}
                          crossOrigin="anonymous"
                          loading="eager"
                          src={poster.src}
                        />
                      ) : (
                        <div className="preview-stage__poster-placeholder" />
                      )}
                    </figure>
                  ))}
                </div>
              ))
            : freeformPosters.map((poster, posterIndex) => (
                <figure
                  className="preview-stage__poster preview-stage__poster--freeform"
                  data-filled={poster.src ? 'true' : 'false'}
                  key={`freeform-${posterIndex + 1}-${poster.title}`}
                  style={
                    {
                      '--poster-left': poster.left,
                      '--poster-top': poster.top,
                      '--poster-width': poster.width,
                      '--poster-rotate': poster.rotate,
                      '--poster-z-index': `${poster.zIndex ?? posterIndex + 1}`,
                    } as CSSProperties
                  }
                >
                  {poster.src ? (
                    <img
                      alt={poster.title}
                      crossOrigin="anonymous"
                      loading="eager"
                      src={poster.src}
                    />
                  ) : (
                    <div className="preview-stage__poster-placeholder" />
                  )}
                </figure>
              ))}
        </div>
      </div>
    )
  },
)
