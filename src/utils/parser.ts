export interface ParsedPartName {
  attack: string
  part: string
}

export const parsePartName = (raw: string): ParsedPartName => {
  const trimmed = (raw ?? '').trim()
  if (trimmed === '') {
    return { attack: '', part: '' }
  }
  const match = trimmed.match(/[（(]([^)）]+)[)）]/)
  if (!match || match.index === undefined) {
    return { attack: trimmed, part: trimmed }
  }
  const attack = trimmed.slice(0, match.index).trim()
  const part = (match[1] ?? '').trim()
  if (part === '' || attack === '') {
    const cleaned = trimmed.replace(/[（(][^)）]*[)）]/g, '').trim()
    return { attack: cleaned, part: cleaned }
  }
  return { attack, part }
}
