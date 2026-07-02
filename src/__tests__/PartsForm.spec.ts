import { describe, it, expect } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import PartsForm from '../components/PartsForm.vue'
import { createEmptyPart, type Part } from '../types/enemy'

const makePart = (overrides: Partial<Part> = {}): Part => ({
  ...createEmptyPart(),
  ...overrides,
})

const createParent = (initialParts: Part[]) =>
  defineComponent({
    components: { PartsForm },
    setup() {
      const parts = ref<Part[]>(initialParts)
      return { parts }
    },
    template: '<PartsForm v-model="parts" />',
  })

describe('PartsForm', () => {
  it('初期状態で 1 つの部位が表示される', () => {
    const Parent = createParent([makePart()])
    const wrapper = mount(Parent)
    expect(wrapper.findAll('.part-card')).toHaveLength(1)
  })

  it('攻撃方法(部位)の入力が parts に反映される', async () => {
    const Parent = createParent([makePart()])
    const wrapper = mount(Parent)
    const input = wrapper.find('input[type="text"]')
    await input.setValue('爪(右手)')
    expect(wrapper.vm.parts[0]?.rawName).toBe('爪(右手)')
  })

  it('打撃点の入力が parts に反映される', async () => {
    const Parent = createParent([makePart()])
    const wrapper = mount(Parent)
    const inputs = wrapper.findAll('input[type="text"]')
    const damageInput = inputs[1]!
    await damageInput.setValue('1d+5')
    expect(wrapper.vm.parts[0]?.damage).toBe('1d+5')
  })

  it('命中力の入力が parts に反映される', async () => {
    const Parent = createParent([makePart()])
    const wrapper = mount(Parent)
    const input = wrapper.find('input[type="number"]')
    await input.setValue('5')
    expect(wrapper.vm.parts[0]?.accuracy).toBe(5)
  })

  it('攻撃方法や打撃点が、他の数値入力でリセットされない', async () => {
    const Parent = createParent([makePart({ rawName: '爪(右手)', damage: '1d+5' })])
    const wrapper = mount(Parent)
    const input = wrapper.find('input[type="number"]')
    await input.setValue('10')
    expect(wrapper.vm.parts[0]?.rawName).toBe('爪(右手)')
    expect(wrapper.vm.parts[0]?.damage).toBe('1d+5')
    expect(wrapper.vm.parts[0]?.accuracy).toBe(10)
  })

  it('2 部位で部位 1 の入力が部位 2 に影響しない', async () => {
    const Parent = createParent([
      makePart({ rawName: '爪(右手)' }),
      makePart({ rawName: '牙(頭部)' }),
    ])
    const wrapper = mount(Parent)
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0]!.setValue('7')
    expect(wrapper.vm.parts[0]?.accuracy).toBe(7)
    expect(wrapper.vm.parts[1]?.accuracy).toBe(0)
  })

  it('部位追加ボタンで部位が増える', async () => {
    const Parent = createParent([makePart()])
    const wrapper = mount(Parent)
    await wrapper.find('.btn--add').trigger('click')
    expect(wrapper.vm.parts).toHaveLength(2)
  })

  it('部位削除ボタンで部位が減る', async () => {
    const Parent = createParent([
      makePart({ rawName: '爪(右手)' }),
      makePart({ rawName: '牙(頭部)' }),
    ])
    const wrapper = mount(Parent)
    await wrapper.find('.btn--remove').trigger('click')
    expect(wrapper.vm.parts).toHaveLength(1)
    expect(wrapper.vm.parts[0]?.rawName).toBe('牙(頭部)')
  })

  it('剣のかけらを変更すると同じ部位の HP/MP suffix 計算に反映される', async () => {
    const Parent = createParent([makePart({ swordFragment: 2 })])
    const wrapper = mount(Parent)
    expect(wrapper.text()).toContain('+10')
    expect(wrapper.text()).toContain('+2')
  })

  it('剣のかけらの変更は他部位の HP/MP suffix に影響しない', async () => {
    const Parent = createParent([
      makePart({ rawName: 'A', swordFragment: 3 }),
      makePart({ rawName: 'B', swordFragment: 1 }),
    ])
    const wrapper = mount(Parent)
    const text = wrapper.text()
    expect(text).toContain('+15') // A: 3*5
    expect(text).toContain('+3') // A MP
    expect(text).toContain('+5') // B: 1*5
    expect(text).toContain('+1') // B MP
  })
})
