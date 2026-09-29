export interface GroupRule {
  title: string
  description: string
}

export interface GroupImage {
  url: string
  width: number
  height: number
  alt: string
}

export interface GroupEvent {
  title: string
  description: string
  image?: GroupImage
}

export interface GroupContent {
  name: string
  tagline: string
  description: string
  about: string
  activities: string[]
  rules: GroupRule[]
  events: GroupEvent[]
  instagram?: string
  facebook?: string
}
