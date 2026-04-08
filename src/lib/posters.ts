import { toPosterProxyUrl } from './trakt'
import type { PosterCard, TraktListItem, TraktMedia } from '../types'

const POSTER_COUNT = 14

const PLACEHOLDER_POSTERS: PosterCard[] = Array.from(
  { length: POSTER_COUNT },
  (_, index) => ({
    src: null,
    title: `Placeholder ${index + 1}`,
  }),
)

function hashString(value: string) {
  let hash = 1779033703 ^ value.length

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353)
    hash = (hash << 13) | (hash >>> 19)
  }

  return hash >>> 0
}

function mulberry32(seed: number) {
  return () => {
    let next = (seed += 0x6d2b79f5)
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleWithSeed<T>(items: T[], seed: string) {
  const random = mulberry32(hashString(seed))
  const cloned = [...items]

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))
    ;[cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]]
  }

  return cloned
}

function getMedia(item: TraktListItem): TraktMedia | undefined {
  return item.show ?? item.movie
}

function getPosterUrl(item: TraktListItem) {
  const images = getMedia(item)?.images
  const preferred =
    images?.poster?.[0] ??
    images?.thumb?.[0] ??
    images?.fanart?.[0] ??
    images?.banner?.[0] ??
    null

  return toPosterProxyUrl(preferred)
}

function padPosterDeck(posters: PosterCard[]) {
  if (posters.length === 0) {
    return PLACEHOLDER_POSTERS
  }

  const padded = [...posters]

  while (padded.length < POSTER_COUNT) {
    padded.push(posters[padded.length % posters.length])
  }

  return padded.slice(0, POSTER_COUNT)
}

export function buildPosterDeck(
  items: TraktListItem[],
  listSlug: string,
  shuffleSeed: number,
) {
  const uniquePosterMap = new Map<string, PosterCard>()

  for (const item of items) {
    const src = getPosterUrl(item)
    const title = getMedia(item)?.title ?? 'Untitled'

    if (!src || uniquePosterMap.has(src)) {
      continue
    }

    uniquePosterMap.set(src, {
      src,
      title,
    })
  }

  const shuffled = shuffleWithSeed(
    [...uniquePosterMap.values()],
    `${listSlug}:${shuffleSeed}`,
  )

  return padPosterDeck(shuffled)
}
