import type { TraktContext, TraktList, TraktListItem } from '../types'

async function fetchJson<T>(input: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(input, { signal });
  return (await response.json()) as T;
}

export async function fetchTraktContext(signal?: AbortSignal): Promise<TraktContext> {
  return fetchJson<TraktContext>('/api/trakt/context', signal);
}

export async function fetchListsForUser(user: string, signal?: AbortSignal): Promise<TraktList[]> {
  return fetchJson<TraktList[]>(`/api/trakt/users/${encodeURIComponent(user)}/lists`, signal);
}

export async function fetchListItemsForUser({
  user,
  slug,
  signal,
}: {
  user: string;
  slug: string;
  signal?: AbortSignal;
}): Promise<TraktListItem[]> {
  return fetchJson<TraktListItem[]>(
    `/api/trakt/users/${encodeURIComponent(user)}/lists/${encodeURIComponent(slug)}/items`,
    signal
  );
}
