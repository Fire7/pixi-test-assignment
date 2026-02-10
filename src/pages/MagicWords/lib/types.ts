export interface Replic {
  name: string
  text: string
}

export interface Emoji {
  name: string
  url: string
}

export type AvatarPosition = 'left' | 'right'

export interface Avatar {
  name: string
  url: string
  position: AvatarPosition
}

export interface DialogResponse {
  dialogue: Array<Replic>
  emojies: Array<Emoji>
  avatars: Array<Avatar>
}
