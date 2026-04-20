import type {
  TraktContext,
  TraktList,
  TraktListItem,
} from '../types'

async function fetchJson<T>(input: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(input, { signal });
    if (!response.ok) return {} as T;
    return (await response.json()) as T;
  } catch (e) {
    return {} as T; 
  }
export function fetchTraktContext(signal?: AbortSignal) {
  return fetchJson<TraktContext>('/api/trakt/context', signal)
}

export function fetchListsForUser(user: string, signal?: AbortSignal) {
  return fetchJson<TraktList[]>(
    `/api/trakt/users/${encodeURIComponent(user)}/lists`,
    signal,
  )
}

export function fetchListItemsForUser(
  user: string,
  slug: string,
  signal?: AbortSignal,
) {
  return fetchJson<TraktListItem[]>(
    `/api/trakt/users/${encodeURIComponent(user)}/lists/${encodeURIComponent(slug)}/items`,
    signal,
  )
}

export function toAbsoluteMediaUrl(path?: string | null) {
  if (!path) {
    return null
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `https://${path.replace(/^\/+/, '')}`
}

export function toPosterProxyUrl(path?: string | null) {
  const mediaUrl = toAbsoluteMediaUrl(path)

  if (!mediaUrl) {
    return null
  }

  return `/api/poster?src=${encodeURIComponent(mediaUrl)}`
}
