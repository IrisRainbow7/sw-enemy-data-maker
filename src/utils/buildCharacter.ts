import type { Character, CharacterClipboardData } from './ccfolia'
import type { EnemyData } from '@/types/enemy'
import { parsePartName } from './parser'

const buildStatus = (data: EnemyData) => {
  const status: { label: string; value: number; max: number }[] = []
  for (const p of data.parts) {
    const { part } = parsePartName(p.rawName)
    const label = part === '' ? p.rawName || '(無名)' : part
    const enhancedHp = p.hp + p.swordFragment * 5
    const enhancedMp = p.mp + p.swordFragment
    status.push({ label: `${label}：HP`, value: enhancedHp, max: enhancedHp })
    status.push({ label: `${label}：MP`, value: enhancedMp, max: enhancedMp })
  }
  return status
}

const buildParams = (data: EnemyData) => {
  const params: { label: string; value: string }[] = [
    { label: '生命抵抗修正', value: '0' },
    { label: '精神抵抗修正', value: '0' },
    { label: '回避修正', value: '0' },
    { label: '命中修正', value: '0' },
    { label: '打撃修正', value: '0' },
    { label: 'LV', value: String(data.level) },
    { label: '生命抵抗', value: String(data.lifeResist) },
    { label: '精神抵抗', value: String(data.mindResist) },
  ]
  data.parts.forEach((p, i) => {
    params.push({ label: `命中${i + 1}`, value: String(p.accuracy) })
    params.push({ label: `回避${i + 1}`, value: String(p.evasion) })
  })
  return params
}

const buildMemo = (data: EnemyData): string => {
  const partsLines = data.parts
    .map((p) => {
      const raw = p.rawName === '' ? '(無名)' : p.rawName
      const enhancedHp = p.hp + p.swordFragment * 5
      const enhancedMp = p.mp + p.swordFragment
      return `${raw}/${p.accuracy}(${p.accuracy + 7})/${p.damage}/${p.evasion}(${p.evasion + 7})/${p.defense}/${enhancedHp}/${enhancedMp}`
    })
    .join('\n')

  const lines: string[] = []
  lines.push(data.name)
  lines.push('----------')
  lines.push(`分類：${data.category}　レベル：${data.level}`)
  lines.push(`知能：${data.intelligence}　知覚：${data.perception}　反応：${data.reaction}`)
  lines.push(`言語：${data.language}　生息地：${data.habitat}`)
  lines.push(`知名度／弱点値：${data.fame}／${data.weaknessValue}　弱点：${data.weakness}`)
  lines.push(
    `先制値：${data.initiative}　移動速度：${data.speed}　生命抵抗力：${data.lifeResist}（${data.lifeResist + 7}）　精神抵抗力：${data.mindResist}（${data.mindResist + 7}）`,
  )
  lines.push('----------')
  lines.push('攻撃方法（部位）/命中力/打撃点/回避力/防護点/HP/MP')
  if (partsLines !== '') {
    lines.push(partsLines)
  }
  lines.push('----------')
  if (data.special.trim() !== '') {
    lines.push(data.special)
  }
  if (data.loot.trim() !== '') {
    lines.push(data.loot)
  }
  return lines.join('\n')
}

export const buildCharacterData = (data: EnemyData): CharacterClipboardData => {
  const character: Character = {
    name: data.name,
    memo: buildMemo(data),
    initiative: 0,
    externalUrl: '',
    status: buildStatus(data),
    params: buildParams(data),
    faces: [],
    x: 0,
    y: 0,
    angle: 0,
    width: 4,
    height: 4,
    active: true,
    secret: false,
    invisible: false,
    hideStatus: false,
    color: '',
    commands: '',
  }
  return { kind: 'character', data: character }
}
