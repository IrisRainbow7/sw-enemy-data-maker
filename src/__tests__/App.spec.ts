import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

const selectCategory = async (wrapper: ReturnType<typeof mount>, value: string) => {
  const select = wrapper.find('select')
  await select.setValue(value)
}

describe('App', () => {
  it('マウントして見出しが表示される', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('SW2.5 敵データメーカー')
  })

  it('コピーと履歴クリアのボタンが表示される', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('JSON をコピー')
    expect(wrapper.text()).toContain('全クリア')
  })

  it('初期状態で履歴は空である', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('履歴はまだありません')
  })

  it('分類「アンデッド」で弱点・穢れ・特殊能力が自動入力される', async () => {
    const wrapper = mount(App)
    await selectCategory(wrapper, 'アンデッド')
    expect(wrapper.vm.enemy.weakness).toBe('回復効果ダメージ+3点')
    expect(wrapper.vm.enemy.impurity).toBe(5)
    expect(wrapper.vm.enemy.special).toBe('○毒無効、○病気無効、○精神効果属性(弱)無効')
  })

  it('分類「人族」で弱点が「なし」に上書きされる', async () => {
    const wrapper = mount(App)
    wrapper.vm.enemy.weakness = '手動入力'
    await selectCategory(wrapper, '人族')
    expect(wrapper.vm.enemy.weakness).toBe('なし')
  })

  it('分類「魔法生物」「魔動機」「魔神」で穢れが0に上書きされる', async () => {
    for (const category of ['魔法生物', '魔動機', '魔神'] as const) {
      const wrapper = mount(App)
      wrapper.vm.enemy.impurity = 10
      await selectCategory(wrapper, category)
      expect(wrapper.vm.enemy.impurity).toBe(0)
    }
  })

  it('分類「魔法生物」「魔動機」で特殊能力が追記される', async () => {
    for (const category of ['魔法生物', '魔動機'] as const) {
      const wrapper = mount(App)
      wrapper.vm.enemy.special = '○暗視'
      await selectCategory(wrapper, category)
      expect(wrapper.vm.enemy.special).toBe('○暗視\n○毒無効、○病気無効、○精神効果属性無効')
    }
  })

  it('分類「アンデッド」でも既存の特殊能力に追記される', async () => {
    const wrapper = mount(App)
    wrapper.vm.enemy.special = '○暗視'
    await selectCategory(wrapper, 'アンデッド')
    expect(wrapper.vm.enemy.special).toBe('○暗視\n○毒無効、○病気無効、○精神効果属性(弱)無効')
  })

  it('特殊能力の追記は重複しない', async () => {
    const wrapper = mount(App)
    wrapper.vm.enemy.special = '○毒無効、○病気無効、○精神効果属性無効'
    await selectCategory(wrapper, '魔法生物')
    expect(wrapper.vm.enemy.special).toBe('○毒無効、○病気無効、○精神効果属性無効')
  })
})
