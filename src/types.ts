export type TraktList = {
  name: string
  description: string | null
  item_count: number
  updated_at: string
  ids: {
    slug: string
    trakt: number
  }
}

export type TraktMediaImages = Partial<{
  poster: string[]
  fanart: string[]
  thumb: string[]
  banner: string[]
  clearart: string[]
  logo: string[]
}>

export type TraktMedia = {
  title: string
  year: number | null
  network?: string | null
  images?: TraktMediaImages
}

export type TraktListItem = {
  id: number
  rank: number
  type: 'movie' | 'show'
  listed_at: string
  movie?: TraktMedia
  show?: TraktMedia
}

export type PosterCard = {
  src: string | null
  title: string
}

export type TraktContext = {
  defaultUser: string
}
