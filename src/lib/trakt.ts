import type { TraktContext, TraktList, TraktListItem } from '../types'

export async function fetchTraktContext(): Promise<TraktContext | null> {
  return null;
}

export async function fetchListsForUser(_user: string): Promise<TraktList[]> {
  return [];
}

export async function fetchListItemsForUser(_args: { user: string; slug: string }): Promise<TraktListItem[]> {
  return [];
}
