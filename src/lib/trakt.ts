import type { TraktContext, TraktList, TraktListItem } from '../types'

async function fetchJson<T>(input: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(input, { signal });
  return (await response.json()) as T;
}

export function fetchTraktContext(signal?: AbortSignal) {
  return fetchJson<TraktContext>('/api/trakt/context', signal);
}

export function fetchListsForUser(user: string, signal?: AbortSignal) {
  return fetchJson<TraktList[]>(`/api/trakt/users/${encodeURIComponent(user)}/lists`, signal);
}

export function fetchListItemsForUser({ user, slug, signal }: { user: string; slug: string; signal?: AbortSignal }) {
  return fetchJson<TraktListItem[]>(`/api/trakt/users/${encodeURIComponent(user)}/lists/${encodeURIComponent(slug)}/items`, signal);
}

export function toPosterProxyUrl(url: string, _type?: any, _size?: any) {
  return url;
}
