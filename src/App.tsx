import { startTransition, useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'

import './App.css'

import { CoverPreview } from './components/CoverPreview'
import { trackEvent } from './lib/analytics'
import { buildPalette, detectBrand } from './lib/brands'
import {
  ASPECT_RATIO_OPTIONS,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_DESIGN_FAMILY,
  getDesignOptions,
  getDesignPreset,
} from './lib/designs'
import {
  DEFAULT_POSTER_LAYOUT,
  POSTER_LAYOUT_OPTIONS,
  getPosterLayoutPreset,
} from './lib/posterLayouts'
import { buildPosterDeck } from './lib/posters'
import {
  fetchListItemsForUser,
  fetchListsForUser,
  fetchTraktContext,
} from './lib/trakt'
import type { TraktContext, TraktList, TraktListItem } from './types'

const DEFAULT_TITLE = 'Choose a list'
const DEFAULT_BACKGROUND_PICKER = '#191216'
const RECENT_USERS_STORAGE_KEY = 'betterer-covers:recent-users'
const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
const COVER_FONT_OPTIONS = [
  {
    id: 'syne',
    label: 'Syne',
    family: "'Syne', sans-serif",
    fontLoad: '800 64px "Syne"',
  },
  {
    id: 'bebas',
    label: 'Bebas Neue',
    family: "'Bebas Neue', sans-serif",
    fontLoad: '400 64px "Bebas Neue"',
  },
  {
    id: 'sora',
    label: 'Sora',
    family: "'Sora', sans-serif",
    fontLoad: '800 64px "Sora"',
  },
  {
    id: 'cormorant',
    label: 'Cormorant Garamond',
    family: "'Cormorant Garamond', serif",
    fontLoad: '700 64px "Cormorant Garamond"',
  },
  {
    id: 'archivo',
    label: 'Archivo Black',
    family: "'Archivo Black', sans-serif",
    fontLoad: '400 64px "Archivo Black"',
  },
  {
    id: 'anton',
    label: 'Anton',
    family: "'Anton', sans-serif",
    fontLoad: '400 64px "Anton"',
  },
  {
    id: 'teko',
    label: 'Teko',
    family: "'Teko', sans-serif",
    fontLoad: '700 64px "Teko"',
  },
  {
    id: 'unbounded',
    label: 'Unbounded',
    family: "'Unbounded', sans-serif",
    fontLoad: '800 64px "Unbounded"',
  },
  {
    id: 'cinzel',
    label: 'Cinzel',
    family: "'Cinzel', serif",
    fontLoad: '800 64px "Cinzel"',
  },
  {
    id: 'dm-serif',
    label: 'DM Serif Display',
    family: "'DM Serif Display', serif",
    fontLoad: '400 64px "DM Serif Display"',
  },
  {
    id: 'oswald',
    label: 'Oswald',
    family: "'Oswald', sans-serif",
    fontLoad: '700 64px "Oswald"',
  },
  {
    id: 'orbitron',
    label: 'Orbitron',
    family: "'Orbitron', sans-serif",
    fontLoad: '800 64px "Orbitron"',
  },
  {
    id: 'righteous',
    label: 'Righteous',
    family: "'Righteous', sans-serif",
    fontLoad: '400 64px "Righteous"',
  },
  {
    id: 'alfa-slab',
    label: 'Alfa Slab One',
    family: "'Alfa Slab One', serif",
    fontLoad: '400 64px "Alfa Slab One"',
  },
  {
    id: 'playfair',
    label: 'Playfair Display',
    family: "'Playfair Display', serif",
    fontLoad: '900 64px "Playfair Display"',
  },
  {
    id: 'bricolage',
    label: 'Bricolage Grotesque',
    family: "'Bricolage Grotesque', sans-serif",
    fontLoad: '800 64px "Bricolage Grotesque"',
  },
  {
    id: 'fjalla',
    label: 'Fjalla One',
    family: "'Fjalla One', sans-serif",
    fontLoad: '400 64px "Fjalla One"',
  },
  {
    id: 'prata',
    label: 'Prata',
    family: "'Prata', serif",
    fontLoad: '400 64px "Prata"',
  },
] as const

const TITLE_SIZE_OPTIONS = [
  {
    id: '70',
    label: '70%',
    scale: 0.7,
  },
  {
    id: '80',
    label: '80%',
    scale: 0.8,
  },
  {
    id: '90',
    label: '90%',
    scale: 0.9,
  },
  {
    id: '100',
    label: '100%',
    scale: 1,
  },
  {
    id: '110',
    label: '110%',
    scale: 1.1,
  },
  {
    id: '120',
    label: '120%',
    scale: 1.2,
  },
  {
    id: '130',
    label: '130%',
    scale: 1.3,
  },
  {
    id: '140',
    label: '140%',
    scale: 1.4,
  },
] as const

type CoverFontId = (typeof COVER_FONT_OPTIONS)[number]['id']
type TitleSizeId = (typeof TITLE_SIZE_OPTIONS)[number]['id']
type BackgroundMode = 'default' | 'custom' | 'transparent' | 'tint'

function chooseInitialList(lists: TraktList[]) {
  const preferredNames = [
    'Latest Netflix Shows',
    'Latest Netflix Movies',
    'Latest Amazon Prime Shows',
    'Latest Disney+ Shows',
  ]

  const exactMatch = preferredNames
    .map((name) => lists.find((list) => list.name === name))
    .find(Boolean)

  if (exactMatch) {
    return exactMatch
  }

  return lists.find((list) => detectBrand(list.name)) ?? lists[0]
}

function mergeRecentUsers(existingUsers: string[], nextUsers: string[]) {
  return [...new Set(
    [...nextUsers, ...existingUsers]
      .map((value) => value.trim())
      .filter(Boolean),
  )].slice(0, 6)
}

function normalizeHexColor(value: string) {
  const normalized = value.trim()

  if (!/^#[\da-f]{6}$/i.test(normalized)) {
    return null
  }

  return normalized.toLowerCase()
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const parsed = Number.parseInt(normalized, 16)

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  }
}

function mixHexColors(baseHex: string, targetHex: string, amount: number) {
  const base = hexToRgb(baseHex)
  const target = hexToRgb(targetHex)
  const mixChannel = (baseChannel: number, targetChannel: number) =>
    Math.round(baseChannel * (1 - amount) + targetChannel * amount)

  const r = mixChannel(base.r, target.r).toString(16).padStart(2, '0')
  const g = mixChannel(base.g, target.g).toString(16).padStart(2, '0')
  const b = mixChannel(base.b, target.b).toString(16).padStart(2, '0')

  return `#${r}${g}${b}`
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function buildCustomStageBackground(hex: string) {
  const start = mixHexColors(hex, '#181217', 0.18)
  const middle = mixHexColors(hex, '#101116', 0.54)
  const end = mixHexColors(hex, '#08090c', 0.82)

  return `linear-gradient(135deg, ${start} 0%, ${middle} 46%, ${end} 100%)`
}

function buildTintStageBackground(hex: string, familyId: string) {
  const start = withAlpha(hex, 0)
  const early = withAlpha(mixHexColors(hex, '#0b0d11', 0.62), 0.05)
  const middle = withAlpha(mixHexColors(hex, '#141318', 0.34), 0.16)
  const end = withAlpha(mixHexColors(hex, '#201419', 0.12), 0.3)

  if (familyId === 'studio') {
    return `linear-gradient(135deg, ${start} 0%, ${early} 42%, ${middle} 74%, ${end} 100%)`
  }

  if (familyId === 'dusk') {
    return `linear-gradient(145deg, ${start} 0%, ${early} 40%, ${middle} 72%, ${end} 100%)`
  }

  return `linear-gradient(140deg, ${start} 0%, ${early} 42%, ${middle} 73%, ${end} 100%)`
}

function waitForTimeout(durationMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs)
  })
}

function waitForImageElement(image: HTMLImageElement) {
  if (image.complete) {
    if (image.naturalWidth > 0 && typeof image.decode === 'function') {
      return Promise.race([
        image.decode().catch(() => undefined),
        waitForTimeout(1200),
      ])
    }

    return Promise.resolve()
  }

  return Promise.race([
    new Promise<void>((resolve) => {
      const handleDone = () => resolve()

      image.addEventListener('load', handleDone, { once: true })
      image.addEventListener('error', handleDone, { once: true })
    }),
    waitForTimeout(4000),
  ])
}

async function waitForPreviewAssets(node: HTMLElement, fontToLoad?: string) {
  if (fontToLoad && 'fonts' in document) {
    await Promise.race([
      document.fonts.load(fontToLoad).catch(() => undefined),
      waitForTimeout(1500),
    ])
  }

  if ('fonts' in document) {
    await Promise.race([
      document.fonts.ready.catch(() => undefined),
      waitForTimeout(1500),
    ])
  }

  const images = Array.from(node.querySelectorAll('img'))
  await Promise.all(images.map((image) => waitForImageElement(image)))

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

function App() {
  const previewRef = useRef<HTMLDivElement>(null)
  const sourceUserInputRef = useRef<HTMLInputElement>(null)
  const [traktContext, setTraktContext] = useState<TraktContext>({
    defaultUser: 'snoak',
  })
  const [lists, setLists] = useState<TraktList[]>([])
  const [items, setItems] = useState<TraktListItem[]>([])
  const [sourceUserInput, setSourceUserInput] = useState('snoak')
  const [activeUser, setActiveUser] = useState('snoak')
  const [recentUsers, setRecentUsers] = useState<string[]>([])
  const [isSourceEditorOpen, setIsSourceEditorOpen] = useState(false)
  const [selectedSlug, setSelectedSlug] = useState('')
  const [customTitle, setCustomTitle] = useState(DEFAULT_TITLE)
  const [displayMode, setDisplayMode] = useState<'auto' | 'text'>('text')
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO)
  const [designFamilyId, setDesignFamilyId] = useState(DEFAULT_DESIGN_FAMILY)
  const [posterLayoutId, setPosterLayoutId] = useState(DEFAULT_POSTER_LAYOUT)
  const [titleFontId, setTitleFontId] = useState<CoverFontId>('syne')
  const [titleSizeId, setTitleSizeId] = useState<TitleSizeId>('100')
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('default')
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null)
  const [shuffleSeed, setShuffleSeed] = useState(0)
  const [listsStatus, setListsStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [itemsStatus, setItemsStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const selectedList = lists.find((entry) => entry.ids.slug === selectedSlug) ?? null
  const detectedBrand = detectBrand(selectedList?.name ?? '')
  const designOptions = getDesignOptions(aspectRatio)
  const selectedPreset = getDesignPreset(aspectRatio, designFamilyId)
  const selectedPosterLayout = getPosterLayoutPreset(selectedPreset, posterLayoutId)
  const selectedTitleFont =
    COVER_FONT_OPTIONS.find((option) => option.id === titleFontId) ??
    COVER_FONT_OPTIONS[0]
  const selectedTitleSize =
    TITLE_SIZE_OPTIONS.find((option) => option.id === titleSizeId) ??
    TITLE_SIZE_OPTIONS.find((option) => option.id === '100') ??
    TITLE_SIZE_OPTIONS[0]
  const activePalette = buildPalette(selectedList?.name ?? customTitle, detectedBrand)
  const activeTitle = customTitle.trim() || selectedList?.name || DEFAULT_TITLE
  const usesAlphaBackground =
    backgroundMode === 'transparent' || backgroundMode === 'tint'
  const customStageBackground =
    backgroundMode === 'custom'
      ? buildCustomStageBackground(backgroundColor ?? DEFAULT_BACKGROUND_PICKER)
      : null
  const tintBackground =
    backgroundMode === 'tint'
      ? buildTintStageBackground(
          backgroundColor ?? activePalette.accent,
          selectedPreset.familyId,
        )
      : null
  const tintWashColor =
    backgroundMode === 'tint'
      ? backgroundColor
        ? withAlpha(backgroundColor, detectedBrand ? 0.09 : 0.08)
        : activePalette.wash
      : null
  const tintLineColor =
    backgroundMode === 'tint'
      ? backgroundColor
        ? withAlpha(backgroundColor, 0.34)
        : activePalette.line
      : null
  const backgroundHelpText =
    backgroundMode === 'transparent'
      ? 'Removes the backdrop in both preview and export.'
      : backgroundMode === 'tint'
        ? 'Keeps the accent hue but removes the dark base.'
      : backgroundMode === 'custom'
        ? 'Uses your own accent color for the cover backdrop.'
        : 'Uses the style backdrop exactly as designed.'
  const posters = buildPosterDeck(
    items,
    `${activeUser}:${selectedSlug || 'empty'}`,
    shuffleSeed,
  )
  const useBrandMark = displayMode === 'auto' && detectedBrand !== null
  const selectedAspectText =
    aspectRatio === 'landscape'
      ? 'Landscape'
      : aspectRatio === 'poster'
        ? 'Poster'
        : 'Square'
  const selectedBrandText =
    displayMode === 'auto'
      ? detectedBrand
        ? detectedBrand.label
        : 'No brand detected'
      : 'Custom text'
  const normalizedSourceUser = sourceUserInput.trim()
  const sourceSuggestions = recentUsers.filter((user) => {
    if (user === activeUser) {
      return false
    }

    if (!normalizedSourceUser) {
      return true
    }

    return user.toLowerCase().includes(normalizedSourceUser.toLowerCase())
  })
  const sourceStatusText =
    listsStatus === 'loading'
      ? `Loading @${activeUser}`
      : listsStatus === 'error'
        ? 'Could not load lists'
        : `${lists.length} public lists ready`

  useEffect(() => {
    const controller = new AbortController()

    async function loadContext() {
      try {
        const context = await fetchTraktContext(controller.signal)

        startTransition(() => {
          setTraktContext(context)
          setSourceUserInput(context.defaultUser)
          setActiveUser(context.defaultUser)
        })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setListsStatus('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the Trakt app context.',
        )
      }
    }

    void loadContext()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const rawValue = window.localStorage.getItem(RECENT_USERS_STORAGE_KEY)
      const parsedValue = rawValue ? JSON.parse(rawValue) : []
      const savedUsers = Array.isArray(parsedValue)
        ? parsedValue.filter((value): value is string => typeof value === 'string')
        : []

      setRecentUsers(mergeRecentUsers(savedUsers, [traktContext.defaultUser]))
    } catch {
      setRecentUsers(mergeRecentUsers([], [traktContext.defaultUser]))
    }
  }, [traktContext.defaultUser])

  useEffect(() => {
    if (typeof window === 'undefined' || !activeUser) {
      return
    }

    setRecentUsers((currentUsers) => {
      const nextUsers = mergeRecentUsers(currentUsers, [
        activeUser,
        traktContext.defaultUser,
      ])

      window.localStorage.setItem(
        RECENT_USERS_STORAGE_KEY,
        JSON.stringify(nextUsers),
      )

      return nextUsers
    })
  }, [activeUser, traktContext.defaultUser])

  useEffect(() => {
    if (!activeUser) {
      return
    }

    const controller = new AbortController()

    async function loadLists() {
      setListsStatus('loading')
      setErrorMessage(null)

      try {
        const nextLists = await fetchListsForUser(activeUser, controller.signal)
        const initialList = chooseInitialList(nextLists)

        startTransition(() => {
          setLists(nextLists)
          setItems([])
          setItemsStatus('idle')
          setSelectedSlug(initialList?.ids.slug ?? '')
          setCustomTitle(initialList?.name ?? DEFAULT_TITLE)
          setDisplayMode(detectBrand(initialList?.name ?? '') ? 'auto' : 'text')
          setShuffleSeed(0)
        })

        setListsStatus('ready')
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setListsStatus('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the public Trakt lists.',
        )
      }
    }

    void loadLists()

    return () => controller.abort()
  }, [activeUser])

  useEffect(() => {
    if (!selectedSlug || !activeUser) {
      return
    }

    const controller = new AbortController()

    async function loadItems() {
      setItemsStatus('loading')

      try {
        const nextItems = await fetchListItemsForUser(
          activeUser,
          selectedSlug,
          controller.signal,
        )
        setItems(nextItems)
        setItemsStatus('ready')
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setItemsStatus('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load posters for the selected list.',
        )
      }
    }

    void loadItems()

    return () => controller.abort()
  }, [activeUser, selectedSlug])

  useEffect(() => {
    if (designOptions.some((option) => option.familyId === designFamilyId)) {
      return
    }

    setDesignFamilyId(DEFAULT_DESIGN_FAMILY)
  }, [designFamilyId, designOptions])

  useEffect(() => {
    if (!isSourceEditorOpen) {
      return
    }

    sourceUserInputRef.current?.focus()
    sourceUserInputRef.current?.select()
  }, [isSourceEditorOpen])

  async function handleDownload() {
    if (!previewRef.current || !selectedList) {
      return
    }

    setIsDownloading(true)
    setErrorMessage(null)

    try {
      await waitForPreviewAssets(previewRef.current, selectedTitleFont.fontLoad)

      const dataUrl = await toPng(previewRef.current, {
        includeQueryParams: true,
        imagePlaceholder: TRANSPARENT_PIXEL,
        onImageErrorHandler: () => undefined,
        canvasWidth: selectedPreset.exportWidth,
        canvasHeight: selectedPreset.exportHeight,
        pixelRatio: 1,
      })

      const link = document.createElement('a')
      link.download = `${selectedList.ids.slug}-${aspectRatio}-${designFamilyId}.png`
      link.href = dataUrl
      link.click()
      trackEvent(
        `download/${aspectRatio}/${designFamilyId}`,
        `Download PNG: ${selectedList.name}`,
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Export failed while rendering the cover.',
      )
    } finally {
      setIsDownloading(false)
    }
  }

  function handleListChange(nextSlug: string) {
    const nextList = lists.find((entry) => entry.ids.slug === nextSlug)
    if (nextList) {
      trackEvent(`list/${nextList.ids.slug}`, `Selected list: ${nextList.name}`)
    }

    startTransition(() => {
      setSelectedSlug(nextSlug)
      setCustomTitle(nextList?.name ?? DEFAULT_TITLE)
      setDisplayMode(detectBrand(nextList?.name ?? '') ? 'auto' : 'text')
      setShuffleSeed(0)
      setErrorMessage(null)
    })
  }

  function handleAspectRatioChange(nextAspectRatio: typeof aspectRatio) {
    trackEvent(`aspect-ratio/${nextAspectRatio}`, `Aspect ratio: ${nextAspectRatio}`)

    startTransition(() => {
      setAspectRatio(nextAspectRatio)
    })
  }

  function handleLoadUser(nextUser = sourceUserInput) {
    const normalizedUser = nextUser.trim()

    if (!normalizedUser || normalizedUser === activeUser) {
      return
    }

    startTransition(() => {
      setActiveUser(normalizedUser)
      setLists([])
      setItems([])
      setSelectedSlug('')
      setListsStatus('loading')
      setItemsStatus('idle')
      setIsSourceEditorOpen(false)
      setErrorMessage(null)
    })
  }

  function handleSuggestedUser(user: string) {
    setSourceUserInput(user)
    handleLoadUser(user)
  }

  function handleDesignFamilyChange(nextDesignFamilyId: typeof designFamilyId) {
    trackEvent(`style/${nextDesignFamilyId}`, `Style: ${nextDesignFamilyId}`)
    setDesignFamilyId(nextDesignFamilyId)
  }

  function handlePosterLayoutChange(nextPosterLayoutId: typeof posterLayoutId) {
    trackEvent(`posters/${nextPosterLayoutId}`, `Poster layout: ${nextPosterLayoutId}`)
    setPosterLayoutId(nextPosterLayoutId)
  }

  function handleTitleFontChange(nextTitleFontId: CoverFontId) {
    trackEvent(`font/${nextTitleFontId}`, `Font: ${nextTitleFontId}`)
    setTitleFontId(nextTitleFontId)
  }

  function handleTitleSizeChange(nextTitleSizeId: TitleSizeId) {
    trackEvent(`font-size/${nextTitleSizeId}`, `Font size: ${nextTitleSizeId}`)
    setTitleSizeId(nextTitleSizeId)
  }

  function handleBackgroundModeChange(nextBackgroundMode: BackgroundMode) {
    trackEvent(`background/${nextBackgroundMode}`, `Background: ${nextBackgroundMode}`)
    setBackgroundMode(nextBackgroundMode)
  }

  function handleShuffleMosaic() {
    trackEvent('shuffle-mosaic', 'Shuffle mosaic')
    setShuffleSeed((value) => value + 1)
  }

  return (
    <main className="app-shell">
        <section className="intro">
          <p className="intro__eyebrow">itsrenoria</p>
          <h1>betterer-covers</h1>
          <p className="intro__lede">
            Build Trakt-based promo covers with brand marks, custom titles, modular poster layouts, and export-ready ratios.
          </p>
        </section>

        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

        <div className="workspace">
        <section className="control-panel">
          <div className="control-panel__stack">
            <div className="panel-block panel-block--surface">
              <div className="panel-heading panel-heading--solo">
                <p className="panel-heading__eyebrow">Source</p>
              </div>

              <div className="source-hero">
                <div>
                  <p className="source-hero__eyebrow">Active user</p>
                  <h2 className="source-hero__title">@{activeUser}</h2>
                  <p className="source-hero__meta">{sourceStatusText}</p>
                </div>

                <div className="source-hero__actions">
                  <button
                    className="source-hero__action"
                    onClick={() => setIsSourceEditorOpen((value) => !value)}
                    type="button"
                  >
                    {isSourceEditorOpen ? 'Close' : 'Change'}
                  </button>

                  <button
                    className="source-hero__default"
                    disabled={activeUser === traktContext.defaultUser}
                    onClick={() => handleSuggestedUser(traktContext.defaultUser)}
                    type="button"
                  >
                    Default
                  </button>
                </div>
              </div>

              {isSourceEditorOpen ? (
                <>
                  <div className="source-user-field">
                    <label className="field-label" htmlFor="source-user-input">
                      Trakt user
                    </label>

                    <div className="source-user-row">
                      <div className="source-user-input">
                        <span className="source-user-input__prefix">@</span>
                        <input
                          aria-label="Trakt username"
                          className="field-input field-input--compact source-user-input__field"
                          id="source-user-input"
                          onChange={(event) => setSourceUserInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              handleLoadUser()
                            }
                          }}
                          placeholder="Type a Trakt username"
                          ref={sourceUserInputRef}
                          type="text"
                          value={sourceUserInput}
                        />
                      </div>

                      <button
                        className="action-button action-button--ghost action-button--inline"
                        disabled={
                          listsStatus === 'loading' ||
                          normalizedSourceUser.length === 0 ||
                          normalizedSourceUser === activeUser
                        }
                        onClick={() => handleLoadUser()}
                        type="button"
                      >
                        Open
                      </button>
                    </div>
                  </div>

                  {sourceSuggestions.length > 0 ? (
                    <div className="source-suggestions">
                      <p className="source-suggestions__label">
                        {normalizedSourceUser ? 'Matching recent users' : 'Recent users'}
                      </p>

                      <div className="source-suggestions__list">
                        {sourceSuggestions.map((user) => (
                          <button
                            className="source-suggestion-chip"
                            key={user}
                            onClick={() => handleSuggestedUser(user)}
                            type="button"
                          >
                            @{user}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}

              <div className="source-list-row">
                <div>
                  <p className="field-label">List</p>
                </div>
              </div>

              <select
                className="field-input field-select"
                disabled={listsStatus !== 'ready'}
                id="list-select"
                onChange={(event) => handleListChange(event.target.value)}
                value={selectedSlug}
              >
                {lists.map((list) => (
                  <option key={list.ids.trakt} value={list.ids.slug}>
                    {list.name}
                  </option>
                ))}
              </select>
              <p className="field-note field-note--compact">
                Select a list to pull its posters into the cover.
              </p>
            </div>

            <div className="panel-grid">
              <div className="panel-block panel-block--surface panel-block--compact">
                <div className="panel-heading panel-heading--solo panel-heading--tight">
                  <p className="panel-heading__eyebrow">Aspect ratio</p>
                </div>

                <div
                  className="segmented-control segmented-control--triple segmented-control--compact"
                  role="tablist"
                  aria-label="Aspect ratio"
                >
                  {ASPECT_RATIO_OPTIONS.map((option) => (
                    <button
                      aria-selected={aspectRatio === option.id}
                      className={aspectRatio === option.id ? 'is-active' : ''}
                      key={option.id}
                      onClick={() => handleAspectRatioChange(option.id)}
                      type="button"
                    >
                      {option.id === 'landscape'
                        ? '16:9'
                        : option.id === 'poster'
                          ? '2:3'
                          : '1:1'}
                    </button>
                  ))}
                </div>

                <p className="field-note field-note--selection">{selectedAspectText}</p>
              </div>

              <div className="panel-block panel-block--surface panel-block--compact">
                <div className="panel-heading panel-heading--solo panel-heading--tight">
                  <p className="panel-heading__eyebrow">Brand</p>
                </div>

                <div
                  className="segmented-control segmented-control--compact"
                  role="tablist"
                  aria-label="Display mode"
                >
                  <button
                    aria-selected={displayMode === 'auto'}
                    className={displayMode === 'auto' ? 'is-active' : ''}
                    disabled={!detectedBrand}
                    onClick={() => setDisplayMode('auto')}
                    type="button"
                  >
                    Auto
                  </button>
                  <button
                    aria-selected={displayMode === 'text'}
                    className={displayMode === 'text' ? 'is-active' : ''}
                    onClick={() => setDisplayMode('text')}
                    type="button"
                  >
                    Custom
                  </button>
                </div>
                <p className="field-note field-note--selection">{selectedBrandText}</p>
              </div>
            </div>

            <div className="panel-grid">
              <div className="panel-block panel-block--surface panel-block--compact">
                <div className="panel-heading panel-heading--solo panel-heading--tight">
                  <p className="panel-heading__eyebrow">Style</p>
                </div>

                <select
                  className="field-input field-select"
                  id="design-select"
                  onChange={(event) =>
                    handleDesignFamilyChange(
                      event.target.value as typeof designFamilyId,
                    )
                  }
                  value={designFamilyId}
                >
                  {designOptions.map((option) => (
                    <option key={option.id} value={option.familyId}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="field-note field-note--compact">
                  Sets the overall cover composition and mood.
                </p>
              </div>

              <div className="panel-block panel-block--surface panel-block--compact">
                <div className="panel-heading panel-heading--solo panel-heading--tight">
                  <p className="panel-heading__eyebrow">Posters</p>
                </div>

                <select
                  className="field-input field-select"
                  id="poster-layout-select"
                  onChange={(event) =>
                    handlePosterLayoutChange(
                      event.target.value as typeof posterLayoutId,
                    )
                  }
                  value={posterLayoutId}
                >
                  {POSTER_LAYOUT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="field-note field-note--compact">
                  Changes how the poster stack is arranged on the right.
                </p>
              </div>
            </div>

            <div className="panel-grid">
              <div className="panel-block panel-block--surface panel-block--compact">
                <div className="panel-heading panel-heading--solo panel-heading--tight">
                  <p className="panel-heading__eyebrow">Font</p>
                </div>

                <select
                  className="field-input field-select"
                  id="font-select"
                  onChange={(event) =>
                    handleTitleFontChange(event.target.value as CoverFontId)
                  }
                  value={titleFontId}
                >
                  {COVER_FONT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="field-label field-label--subfield">Font size</p>
                <select
                  aria-label="Font size"
                  className="field-input field-select"
                  id="font-size-select"
                  onChange={(event) =>
                    handleTitleSizeChange(event.target.value as TitleSizeId)
                  }
                  value={titleSizeId}
                >
                  {TITLE_SIZE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="field-note field-note--compact">
                  Typeface and size only affect custom titles and fallback text.
                </p>
              </div>

              <div className="panel-block panel-block--surface panel-block--compact">
                <div className="panel-heading panel-heading--solo panel-heading--tight">
                  <p className="panel-heading__eyebrow">Background</p>
                </div>

                <div className="field-color-row">
                  <input
                    aria-label="Background color"
                    className={`field-color-input ${
                      backgroundMode === 'custom' ? 'field-color-input--active' : ''
                    }`}
                    onChange={(event) => {
                      const nextColor = normalizeHexColor(event.target.value)
                      setBackgroundColor(nextColor)
                      handleBackgroundModeChange('custom')
                    }}
                    type="color"
                    value={backgroundColor ?? DEFAULT_BACKGROUND_PICKER}
                  />
                  <button
                    className={`field-color-reset ${
                      backgroundMode === 'default' ? 'is-active' : ''
                    }`}
                    onClick={() => handleBackgroundModeChange('default')}
                    type="button"
                  >
                    Default
                  </button>
                  <button
                    className={`field-color-reset ${
                      backgroundMode === 'tint' ? 'is-active' : ''
                    }`}
                    onClick={() => handleBackgroundModeChange('tint')}
                    type="button"
                  >
                    Tint
                  </button>
                  <button
                    className={`field-color-reset ${
                      backgroundMode === 'transparent' ? 'is-active' : ''
                    }`}
                    onClick={() => handleBackgroundModeChange('transparent')}
                    type="button"
                  >
                    Transparent
                  </button>
                </div>
                <p className="field-note field-note--compact">
                  {backgroundHelpText}
                </p>
              </div>
            </div>

            <div className="panel-block panel-block--surface panel-block--compact">
              <div className="panel-heading panel-heading--solo panel-heading--tight">
                <p className="panel-heading__eyebrow">Fallback title</p>
              </div>

              <input
                aria-label="Fallback title"
                className="field-input field-input--compact"
                id="title-input"
                onChange={(event) => setCustomTitle(event.target.value)}
                type="text"
                value={customTitle}
              />
              <p className="field-note field-note--compact">
                Defaults to the selected list name.
              </p>
            </div>

            <div className="panel-actions">
              <button
                className="action-button action-button--ghost"
                onClick={handleShuffleMosaic}
                type="button"
              >
                Shuffle mosaic
              </button>
              <button
                className="action-button action-button--primary"
                disabled={!selectedList || itemsStatus !== 'ready' || isDownloading}
                onClick={() => void handleDownload()}
                type="button"
              >
                {isDownloading ? 'Rendering PNG…' : 'Download PNG'}
              </button>
            </div>
          </div>
        </section>

        <section className="preview-panel">
          <div className="preview-panel__meta">
            <div>
              <p className="panel-heading__eyebrow">Preview</p>
              <p className="preview-panel__subhead">
                {selectedPreset.aspectLabel} · {selectedPreset.label}
              </p>
            </div>
          </div>

          <div className="preview-canvas">
            <div
              className={`preview-frame preview-frame--${aspectRatio} ${
                usesAlphaBackground ? 'preview-frame--transparent' : ''
              }`}
              style={
                {
                  '--frame-aspect': selectedPreset.frameAspect,
                  '--frame-max-width': selectedPreset.frameMaxWidth,
                  '--frame-preview-scale': selectedPreset.previewScale,
                } as React.CSSProperties
              }
            >
              <CoverPreview
                backgroundMode={backgroundMode}
                backgroundOverride={customStageBackground}
                brand={detectedBrand}
                palette={activePalette}
                posterLayout={selectedPosterLayout}
                posters={posters}
                preset={selectedPreset}
                ref={previewRef}
                tintBackground={tintBackground}
                tintLine={tintLineColor}
                tintWash={tintWashColor}
                title={activeTitle}
                titleFontFamily={selectedTitleFont.family}
                titleScale={selectedTitleSize.scale}
                useBrandMark={useBrandMark}
              />
            </div>
          </div>
        </section>
        </div>
      </main>
  )
}

export default App
