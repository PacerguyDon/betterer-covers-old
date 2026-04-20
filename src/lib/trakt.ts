import type { TraktContext, TraktList, TraktListItem } from '../types'

async function fetchJson<T>(input: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(input, { signal })
  return await response.json()
}

export async function fetchTraktContext(signal?: AbortSignal): Promise<TraktContext> {
  return fetchJson('/api/trakt/context', signal)
}

export async function fetchListsForUser(user: string, signal?: AbortSignal): Promise<TraktList[]> {
  return fetchJson(`/api/trakt/users/${encodeURIComponent(user)}/lists`, signal)
}

export async function fetchListItemsForUser({ user, slug, signal }: { user: string; slug: string; signal?: AbortSignal }): Promise<TraktListItem[]> {
  return fetchJson(`/api/trakt/users/${encodeURIComponent(user)}/lists/${encodeURIComponent(slug)}/items`, signal)
}
