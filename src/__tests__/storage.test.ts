import { describe, it, expect, beforeEach } from 'vitest'
import { loadHistory, saveToHistory, removeFromHistory, clearHistory } from '../utils/storage'
import { createEmptyEnemy } from '../types/enemy'

const STORAGE_KEY = 'sw-enemy-history:v1'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('空のときは空配列を返す', () => {
    expect(loadHistory()).toEqual([])
  })

  it('新規データを追加できる', () => {
    const enemy = { ...createEmptyEnemy(), name: 'ゴブリン' }
    const result = saveToHistory(enemy)
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('ゴブリン')
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('同じ name のデータは上書きされる', () => {
    saveToHistory({ ...createEmptyEnemy(), name: 'ゴブリン', level: 1 })
    const result = saveToHistory({
      ...createEmptyEnemy(),
      name: 'ゴブリン',
      level: 5,
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.level).toBe(5)
  })

  it('異なる name は別データとして追加される', () => {
    saveToHistory({ ...createEmptyEnemy(), name: 'ゴブリン' })
    saveToHistory({ ...createEmptyEnemy(), name: 'オーク' })
    const result = loadHistory()
    expect(result).toHaveLength(2)
    expect(result.map((d) => d.name)).toEqual(['ゴブリン', 'オーク'])
  })

  it('name が空のデータは保存しない', () => {
    saveToHistory({ ...createEmptyEnemy(), name: '' })
    expect(loadHistory()).toEqual([])
  })

  it('指定した name のデータを削除できる', () => {
    saveToHistory({ ...createEmptyEnemy(), name: 'ゴブリン' })
    saveToHistory({ ...createEmptyEnemy(), name: 'オーク' })
    const result = removeFromHistory('ゴブリン')
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('オーク')
  })

  it('存在しない name を削除しても結果は同じ', () => {
    saveToHistory({ ...createEmptyEnemy(), name: 'ゴブリン' })
    const result = removeFromHistory('ドラゴン')
    expect(result).toHaveLength(1)
  })

  it('全クリアできる', () => {
    saveToHistory({ ...createEmptyEnemy(), name: 'ゴブリン' })
    clearHistory()
    expect(loadHistory()).toEqual([])
  })

  it('壊れた JSON は空配列として扱う', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    expect(loadHistory()).toEqual([])
  })

  it('配列でない JSON は空配列として扱う', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }))
    expect(loadHistory()).toEqual([])
  })
})
