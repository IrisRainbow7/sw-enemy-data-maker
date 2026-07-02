import { describe, it, expect } from 'vitest'
import { buildCharacterData } from '../utils/buildCharacter'
import { createEmptyEnemy, createEmptyPart } from '../types/enemy'
import type { EnemyData, Part } from '../types/enemy'

const makePart = (overrides: Partial<Part> = {}): Part => ({
  ...createEmptyPart(),
  ...overrides,
})

const makeEnemy = (overrides: Partial<EnemyData> = {}): EnemyData => ({
  ...createEmptyEnemy(),
  ...overrides,
})

describe('buildCharacterData', () => {
  it('kind が character である', () => {
    const result = buildCharacterData(makeEnemy())
    expect(result.kind).toBe('character')
  })

  it('iconUrl と owner を含まない', () => {
    const result = buildCharacterData(makeEnemy()) as unknown as Record<string, unknown>
    expect(result).not.toHaveProperty('iconUrl')
    expect(result.data).not.toHaveProperty('owner')
  })

  it('status は部位ごとに HP と MP の2つずつ作成される', () => {
    const data = makeEnemy({
      parts: [
        makePart({ rawName: '爪(右手)', hp: 20, mp: 5 }),
        makePart({ rawName: '牙（頭部）', hp: 30, mp: 10 }),
      ],
    })
    const result = buildCharacterData(data)
    expect(result.data.status).toHaveLength(4)
    expect(result.data.status[0]).toEqual({
      label: '右手：HP',
      value: 20,
      max: 20,
    })
    expect(result.data.status[1]).toEqual({
      label: '右手：MP',
      value: 5,
      max: 5,
    })
    expect(result.data.status[2]).toEqual({
      label: '頭部：HP',
      value: 30,
      max: 30,
    })
    expect(result.data.status[3]).toEqual({
      label: '頭部：MP',
      value: 10,
      max: 10,
    })
  })

  it('params は固定5項目 + LV/生命抵抗/精神抵抗 + 部位ごとに命中N/回避N', () => {
    const data = makeEnemy({
      level: 7,
      lifeResist: 12,
      mindResist: 15,
      parts: [makePart({ accuracy: 10, evasion: 8 }), makePart({ accuracy: 5, evasion: 3 })],
    })
    const params = buildCharacterData(data).data.params
    expect(params[0]).toEqual({ label: '生命抵抗修正', value: '0' })
    expect(params[4]).toEqual({ label: '打撃修正', value: '0' })
    expect(params[5]).toEqual({ label: 'LV', value: '7' })
    expect(params[6]).toEqual({ label: '生命抵抗', value: '12' })
    expect(params[7]).toEqual({ label: '精神抵抗', value: '15' })
    expect(params[8]).toEqual({ label: '命中1', value: '10' })
    expect(params[9]).toEqual({ label: '回避1', value: '8' })
    expect(params[10]).toEqual({ label: '命中2', value: '5' })
    expect(params[11]).toEqual({ label: '回避2', value: '3' })
  })

  it('memo テンプレ通りの文字列が生成される', () => {
    const data = makeEnemy({
      name: 'ゴブリン',
      category: '蛮族',
      level: 3,
      intelligence: '低い',
      perception: '五感',
      reaction: '敵対的',
      language: 'ゴブリン語',
      habitat: '森林',
      fame: 5,
      weaknessValue: 4,
      weakness: 'なし',
      initiative: 10,
      speed: 15,
      lifeResist: 5,
      mindResist: 8,
      parts: [
        makePart({
          rawName: '棍(右手)',
          accuracy: 10,
          damage: '1d+5',
          evasion: 8,
          defense: 3,
          hp: 12,
          mp: 0,
        }),
      ],
      special: '○暗視',
      loot: '金貨 2d6 枚',
    })
    const memo = buildCharacterData(data).data.memo
    expect(memo).toContain('ゴブリン')
    expect(memo).toContain('分類：蛮族　レベル：3')
    expect(memo).toContain('知名度／弱点値：5／4　弱点：なし')
    expect(memo).toContain('生命抵抗力：5（12）　精神抵抗力：8（15）')
    expect(memo).toContain('棍(右手)/10(17)/1d+5/8(15)/3/12/0')
    expect(memo).toContain('○暗視')
    expect(memo).toContain('金貨 2d6 枚')
  })

  it('memo に name や特殊能力が無くても例外を出さない', () => {
    const data = makeEnemy({ name: '', special: '', loot: '' })
    expect(() => buildCharacterData(data)).not.toThrow()
  })

  it('剣のかけらで強化後の HP/MP が status に反映される (部位ごと独立)', () => {
    const data = makeEnemy({
      parts: [
        makePart({ rawName: '爪(右手)', hp: 20, mp: 5, swordFragment: 3 }),
        makePart({ rawName: '牙(頭部)', hp: 30, mp: 10, swordFragment: 0 }),
      ],
    })
    const status = buildCharacterData(data).data.status
    expect(status[0]).toEqual({ label: '右手：HP', value: 35, max: 35 })
    expect(status[1]).toEqual({ label: '右手：MP', value: 8, max: 8 })
    expect(status[2]).toEqual({ label: '頭部：HP', value: 30, max: 30 })
    expect(status[3]).toEqual({ label: '頭部：MP', value: 10, max: 10 })
  })

  it('剣のかけらで強化後の HP/MP が memo に反映される (部位ごと独立)', () => {
    const data = makeEnemy({
      parts: [
        makePart({
          rawName: '爪(右手)',
          accuracy: 10,
          damage: '1d+5',
          evasion: 8,
          defense: 3,
          hp: 20,
          mp: 5,
          swordFragment: 3,
        }),
        makePart({
          rawName: '牙(頭部)',
          accuracy: 8,
          damage: '2d+6',
          evasion: 5,
          defense: 2,
          hp: 30,
          mp: 10,
          swordFragment: 0,
        }),
      ],
    })
    const memo = buildCharacterData(data).data.memo
    expect(memo).toContain('爪(右手)/10(17)/1d+5/8(15)/3/35/8')
    expect(memo).toContain('牙(頭部)/8(15)/2d+6/5(12)/2/30/10')
  })

  it('character の基本プロパティが固定値で出力される', () => {
    const result = buildCharacterData(makeEnemy())
    expect(result.data.x).toBe(0)
    expect(result.data.y).toBe(0)
    expect(result.data.angle).toBe(0)
    expect(result.data.width).toBe(4)
    expect(result.data.height).toBe(4)
    expect(result.data.active).toBe(true)
    expect(result.data.secret).toBe(false)
    expect(result.data.invisible).toBe(false)
    expect(result.data.hideStatus).toBe(false)
    expect(result.data.color).toBe('')
    expect(result.data.commands).toBe('')
    expect(result.data.initiative).toBe(0)
    expect(result.data.externalUrl).toBe('')
    expect(result.data.faces).toEqual([])
  })
})
