import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PartsForm from '../components/PartsForm.vue'
import { createEmptyPart, type Part } from '../types/enemy'

const makePart = (overrides: Partial<Part> = {}): Part => ({
  ...createEmptyPart(),
  ...overrides,
})

const lastEmit = (wrapper: ReturnType<typeof mount>): Part[] => {
  const events = wrapper.emitted('update:modelValue') as [Part[]][] | undefined
  if (events === undefined || events.length < 1) return []
  const args = events[events.length - 1]
  if (args === undefined || args.length < 1) return []
  const payload = args[0]
  return payload === undefined ? [] : payload
}

describe('PartsForm', () => {
  it('初期状態で 1 つの部位が表示される', () => {
    const wrapper = mount(PartsForm, {
      props: { modelValue: [makePart()] },
    })
    expect(wrapper.findAll('.part-card')).toHaveLength(1)
  })

  it('数値入力で parts[0].accuracy が更新される', async () => {
    const wrapper = mount(PartsForm, {
      props: { modelValue: [makePart()] },
    })
    const input = wrapper.find('input[type="number"]')
    await input.setValue('5')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const parts = lastEmit(wrapper)
    expect(parts[0]?.accuracy).toBe(5)
  })

  it('攻撃方法や打撃点の入力が、他の数値入力でリセットされない', async () => {
    const part = makePart({ rawName: '爪(右手)', damage: '1d+5' })
    const wrapper = mount(PartsForm, {
      props: { modelValue: [part] },
    })
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0]!.setValue('10')

    const parts = lastEmit(wrapper)
    expect(parts[0]?.rawName).toBe('爪(右手)')
    expect(parts[0]?.damage).toBe('1d+5')
    expect(parts[0]?.accuracy).toBe(10)
  })

  it('2 部位で部位 1 の入力が部位 2 に影響しない', async () => {
    const parts = [makePart({ rawName: '爪(右手)' }), makePart({ rawName: '牙(頭部)' })]
    const wrapper = mount(PartsForm, {
      props: { modelValue: parts },
    })
    const inputs = wrapper.findAll('input[type="number"]')
    // 1 つ目の part の命中力
    await inputs[0]!.setValue('7')

    const updated = lastEmit(wrapper)
    expect(updated[0]?.accuracy).toBe(7)
    expect(updated[1]?.accuracy).toBe(0)
  })

  it('部位追加ボタンで部位が増える', async () => {
    const wrapper = mount(PartsForm, {
      props: { modelValue: [makePart()] },
    })
    await wrapper.find('.btn--add').trigger('click')

    const parts = lastEmit(wrapper)
    expect(parts).toHaveLength(2)
  })

  it('部位削除ボタンで部位が減る', async () => {
    const parts = [makePart({ rawName: '爪(右手)' }), makePart({ rawName: '牙(頭部)' })]
    const wrapper = mount(PartsForm, {
      props: { modelValue: parts },
    })
    await wrapper.find('.btn--remove').trigger('click')

    const updated = lastEmit(wrapper)
    expect(updated).toHaveLength(1)
    expect(updated[0]?.rawName).toBe('牙(頭部)')
  })

  it('剣のかけらを変更すると同じ部位の HP/MP suffix 計算に反映される', async () => {
    const wrapper = mount(PartsForm, {
      props: { modelValue: [makePart({ swordFragment: 2 })] },
    })
    expect(wrapper.text()).toContain('+10')
    expect(wrapper.text()).toContain('+2')
  })

  it('剣のかけらの変更は他部位の HP/MP suffix に影響しない', async () => {
    const parts = [
      makePart({ rawName: 'A', swordFragment: 3 }),
      makePart({ rawName: 'B', swordFragment: 1 }),
    ]
    const wrapper = mount(PartsForm, {
      props: { modelValue: parts },
    })
    const text = wrapper.text()
    expect(text).toContain('+15') // A: 3*5
    expect(text).toContain('+3') // A MP
    expect(text).toContain('+5') // B: 1*5
    expect(text).toContain('+1') // B MP
  })
})
