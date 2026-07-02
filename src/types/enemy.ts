export type Category =
  | '未分類'
  | '蛮族'
  | '動物'
  | '植物'
  | 'アンデッド'
  | '魔法生物'
  | '魔動機'
  | '幻獣'
  | '妖精'
  | '魔神'
  | '人族'
  | '神族'
  | 'その他'

export const CATEGORIES: Category[] = [
  '未分類',
  '蛮族',
  '動物',
  '植物',
  'アンデッド',
  '魔法生物',
  '魔動機',
  '幻獣',
  '妖精',
  '魔神',
  '人族',
  '神族',
  'その他',
]

export type Intelligence = 'なし' | '動物並み' | '低い' | '人間並み' | '高い' | '命令を聞く'

export const INTELLIGENCES: Intelligence[] = [
  'なし',
  '動物並み',
  '低い',
  '人間並み',
  '高い',
  '命令を聞く',
]

export type Perception = '五感' | '五感(暗視)' | '魔法' | '機械'

export const PERCEPTIONS: Perception[] = ['五感', '五感(暗視)', '魔法', '機械']

export type Reaction = '友好的' | '中立' | '敵対的' | '腹具合による' | '命令による'

export const REACTIONS: Reaction[] = ['友好的', '中立', '敵対的', '腹具合による', '命令による']

export interface Part {
  id: string
  rawName: string
  accuracy: number
  damage: string
  evasion: number
  defense: number
  hp: number
  mp: number
  swordFragment: number
}

export interface EnemyData {
  category: Category
  name: string
  level: number
  intelligence: Intelligence
  perception: Perception
  reaction: Reaction
  impurity: number
  language: string
  habitat: string
  fame: number
  weaknessValue: number
  weakness: string
  initiative: number
  speed: number
  lifeResist: number
  mindResist: number
  parts: Part[]
  special: string
  loot: string
}

export const createEmptyPart = (): Part => ({
  id: crypto.randomUUID(),
  rawName: '',
  accuracy: 0,
  damage: '2d+',
  evasion: 0,
  defense: 0,
  hp: 0,
  mp: 0,
  swordFragment: 0,
})

export const createEmptyEnemy = (): EnemyData => ({
  category: '未分類',
  name: '',
  level: 1,
  intelligence: 'なし',
  perception: '五感',
  reaction: '中立',
  impurity: 0,
  language: '',
  habitat: '',
  fame: 0,
  weaknessValue: 0,
  weakness: '',
  initiative: 0,
  speed: 0,
  lifeResist: 0,
  mindResist: 0,
  parts: [createEmptyPart()],
  special: '',
  loot: '',
})
