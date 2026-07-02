import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ExtraForm from '../components/ExtraForm.vue'

const KAGI =
  '○剣の加護／運命変転\n行為判定や打撃点決定で2dを振った時、直後にその出目をひっくり返します。\nこの能力は1日に1回だけ使えます。'
const ZENRYOKU =
  '🗨全力攻撃Ⅰ\n打撃点を+4点します。リスクとして、自身の回避判定に-2のペナルティ修正をします。'

describe('ExtraForm', () => {
  it('手動入力が v-model 経由で反映される', async () => {
    const wrapper = mount(ExtraForm, {
      props: { special: '', loot: '' },
    })
    const textarea = wrapper.find('textarea')
    await textarea.setValue('手動で入力')
    const events = wrapper.emitted('update:special')
    expect(events).toBeDefined()
    if (!events) throw new Error('event not emitted')
    expect(events[0]).toEqual(['手動で入力'])
  })

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
    const buttons = wrapper.findAll('.template-btn')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    await buttons[1]!.trigger('click')
    const events = wrapper.emitted('update:special')
    expect(events).toBeDefined()
    if (!events) throw new Error('event not emitted')
    expect(events[0]).toEqual([`○暗視\n\n${KAGI}\n\n${ZENRYOKU}\n\n`])
  })

  it('同じテンプレートを2回クリックしても重複しない', async () => {
    const wrapper = mount(ExtraForm, {
      props: { special: KAGI, loot: '' },
    })
    await wrapper.find('.template-btn').trigger('click')
    expect(wrapper.emitted('update:special')).toBeUndefined()
  })

  it('手動編集後も既存のテンプレートは重複して追加されない', async () => {
    const wrapper = mount(ExtraForm, {
      props: { special: `${KAGI}\n\n手動で追加したテキスト`, loot: '' },
    })
    await wrapper.find('.template-btn').trigger('click')
    expect(wrapper.emitted('update:special')).toBeUndefined()
  })
})
