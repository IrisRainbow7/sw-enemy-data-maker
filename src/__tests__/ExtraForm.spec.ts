import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ExtraForm from '../components/ExtraForm.vue'

const KAGI =
  '○剣の加護／運命変転\n行為判定や打撃点決定で2dを振った時、直後にその出目をひっくり返します。\nこの能力は1日に1回だけ使えます。'

describe('ExtraForm', () => {
  it('空欄時はテンプレートをそのまま追加する', async () => {
    const wrapper = mount(ExtraForm, {
      props: { special: '', loot: '' },
    })
    await wrapper.find('.template-btn').trigger('click')
    const events = wrapper.emitted('update:special')
    expect(events).toBeDefined()
    if (!events) throw new Error('event not emitted')
    expect(events[0]).toEqual([KAGI])
  })

  it('既存入力あり時は前後に空行を入れて追加する', async () => {
    const wrapper = mount(ExtraForm, {
      props: { special: '○暗視', loot: '' },
    })
    await wrapper.find('.template-btn').trigger('click')
    const events = wrapper.emitted('update:special')
    expect(events).toBeDefined()
    if (!events) throw new Error('event not emitted')
    expect(events[0]).toEqual([`○暗視\n\n${KAGI}\n\n`])
  })

  it('末尾が改行の既存入力でも空行を重複させない', async () => {
    const wrapper = mount(ExtraForm, {
      props: { special: '○暗視\n', loot: '' },
    })
    await wrapper.find('.template-btn').trigger('click')
    const events = wrapper.emitted('update:special')
    expect(events).toBeDefined()
    if (!events) throw new Error('event not emitted')
    expect(events[0]).toEqual([`○暗視\n\n${KAGI}\n\n`])
  })

  it('2回目以降も空行を1つだけ挟んで追加する', async () => {
    const wrapper = mount(ExtraForm, {
      props: { special: `○暗視\n\n${KAGI}\n\n`, loot: '' },
    })
    await wrapper.find('.template-btn').trigger('click')
    const events = wrapper.emitted('update:special')
    expect(events).toBeDefined()
    if (!events) throw new Error('event not emitted')
    expect(events[0]).toEqual([`○暗視\n\n${KAGI}\n\n${KAGI}\n\n`])
  })
})
