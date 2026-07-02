import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

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
})
