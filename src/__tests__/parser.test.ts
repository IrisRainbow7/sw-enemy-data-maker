import { describe, it, expect } from 'vitest'
import { parsePartName } from '../utils/parser'

describe('parsePartName', () => {
  it('半角丸括弧のパース', () => {
    expect(parsePartName('爪(右手)')).toEqual({ attack: '爪', part: '右手' })
  })

  it('全角丸括弧のパース', () => {
    expect(parsePartName('爪（右手）')).toEqual({ attack: '爪', part: '右手' })
  })

  it('括弧がない場合は全体を部位名として扱う', () => {
    expect(parsePartName('爪')).toEqual({ attack: '爪', part: '爪' })
  })

  it('空文字は空文字を返す', () => {
    expect(parsePartName('')).toEqual({ attack: '', part: '' })
  })

  it('空白を含む入力をトリムする', () => {
    expect(parsePartName('  爪 ( 右手 )  ')).toEqual({
      attack: '爪',
      part: '右手',
    })
  })

  it('前後に空白を含む全角括弧', () => {
    expect(parsePartName('牙 （頭部）')).toEqual({
      attack: '牙',
      part: '頭部',
    })
  })

  it('括弧の中身が空の場合は全体が部位名', () => {
    expect(parsePartName('爪( )')).toEqual({ attack: '爪', part: '爪' })
  })

  it('閉じ括弧の前にスペース', () => {
    expect(parsePartName('爪(右手 )')).toEqual({ attack: '爪', part: '右手' })
  })

  it('複数の括弧がある場合は最初のものを使う', () => {
    expect(parsePartName('爪(右手)(長)')).toEqual({
      attack: '爪',
      part: '右手',
    })
  })
})
