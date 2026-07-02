export interface CharacterStatus {
  label: string
  value: number
  max: number
}

export interface CharacterParam {
  label: string
  value: string
}

export interface Character {
  name: string
  memo: string
  initiative: number
  externalUrl: string
  status: CharacterStatus[]
  params: CharacterParam[]
  faces: { iconUrl: string | null; label: string }[]
  x: number
  y: number
  angle: number
  width: number
  height: number
  active: boolean
  secret: boolean
  invisible: boolean
  hideStatus: boolean
  color: string
  commands: string
}

export interface CharacterClipboardData {
  kind: 'character'
  data: Character
}
