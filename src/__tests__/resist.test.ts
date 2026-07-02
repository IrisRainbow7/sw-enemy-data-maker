import { describe, it, expect } from 'vitest'
import { resistBonus } from '../utils/resist'

describe('resistBonus', () => {
  it('0個以下は0', () => {
    expect(resistBonus(0)).toBe(0)
    expect(resistBonus(-1)).toBe(0)
  })

  it('1〜5個は1', () => {
    for (let n = 1; n <= 5; n++) {
      expect(resistBonus(n)).toBe(1)
    }
  })

  it('6〜10個は2', () => {
    for (let n = 6; n <= 10; n++) {
      expect(resistBonus(n)).toBe(2)
    }
  })

  it('11〜15個は3', () => {
    for (let n = 11; n <= 15; n++) {
      expect(resistBonus(n)).toBe(3)
    }
  })

  it('16個以上は最大4で頭打ち', () => {
    expect(resistBonus(16)).toBe(4)
    expect(resistBonus(20)).toBe(4)
    expect(resistBonus(100)).toBe(4)
  })
})
