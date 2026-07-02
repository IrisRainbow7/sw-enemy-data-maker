import type { EnemyData } from '@/types/enemy'

const STORAGE_KEY = 'sw-enemy-history:v1'
const MAX_HISTORY = 50

export const loadHistory = (): EnemyData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as EnemyData[]
  } catch (e) {
    console.warn('Failed to load history', e)
    return []
  }
}

export const saveToHistory = (data: EnemyData): EnemyData[] => {
  if (data.name.trim() === '') return loadHistory()
  const history = loadHistory()
  const idx = history.findIndex((d) => d.name === data.name)
  let next: EnemyData[]
  if (idx >= 0) {
    next = [...history]
    next[idx] = data
  } else {
    next = [...history, data]
  }
  if (next.length > MAX_HISTORY) {
    next = next.slice(next.length - MAX_HISTORY)
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (e) {
    console.warn('Failed to save history', e)
  }
  return next
}

export const removeFromHistory = (name: string): EnemyData[] => {
  const next = loadHistory().filter((d) => d.name !== name)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (e) {
    console.warn('Failed to remove from history', e)
  }
  return next
}

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('Failed to clear history', e)
  }
}
