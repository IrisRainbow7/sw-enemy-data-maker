<script setup lang="ts">
const special = defineModel<string>('special', { required: true })
const loot = defineModel<string>('loot', { required: true })

const emit = defineEmits<{
  (e: 'mark-special-touched'): void
}>()

const SPECIAL_TEMPLATES: { label: string; value: string }[] = [
  {
    label: '剣の加護／運命変転',
    value:
      '○剣の加護／運命変転\n行為判定や打撃点決定で2dを振った時、直後にその出目をひっくり返します。\nこの能力は1日に1回だけ使えます。',
  },
  {
    label: '全力攻撃',
    value:
      '🗨全力攻撃Ⅰ\n打撃点を+4点します。リスクとして、自身の回避判定に-2のペナルティ修正をします。',
  },
  {
    label: '痛恨撃',
    value: '○痛恨撃\n打撃点決定の出目が10以上だった場合、打撃点をさらに「+3」点します。',
  },
  {
    label: '連続攻撃',
    value:
      '○連続攻撃\n攻撃が命中した場合、同じ対象にもう1回攻撃できます。2回目の攻撃が命中しても、この効果はありません。',
  },
  {
    label: 'ターゲッティング',
    value: '○ターゲッティング\n乱戦に「形状: 射撃」の魔法を射ちこんでも誤射しません。',
  },
  {
    label: '魔法適正',
    value:
      '○魔法適正\n戦闘特技(ターゲッティング) (魔法収束)》(魔法制御)(魔法拡大すべて)を習得しています。',
  },
  {
    label: '魔法レベル',
    value: '▶魔法レベル/魔力 ()',
  },
]

const onText = (setter: (v: string) => void) => (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  setter(target.value)
}

const onTemplateClick = (t: { label: string; value: string }) => {
  const current = special.value ?? ''
  const next = current.trim() === '' ? t.value : `${current}\n${t.value}`
  special.value = next
  emit('mark-special-touched')
}
</script>

<template>
  <section class="extra-form">
    <div class="field">
      <div class="field__row">
        <span class="field__label">特殊能力</span>
      </div>
      <textarea
        rows="5"
        :value="special"
        placeholder="複数行入力可"
        @input="onText((v) => (special = v))"
      ></textarea>

      <details class="templates" open>
        <summary class="templates__summary">テンプレート（クリックで自動追加）</summary>
        <ul class="templates__list">
          <li v-for="t in SPECIAL_TEMPLATES" :key="t.label">
            <button type="button" class="template-btn" @click="onTemplateClick(t)">
              {{ t.label }}
            </button>
          </li>
        </ul>
      </details>
    </div>

    <div class="field">
      <span class="field__label">戦利品</span>
      <textarea
        rows="5"
        :value="loot"
        placeholder="複数行入力可"
        @input="onText((v) => (loot = v))"
      ></textarea>
    </div>
  </section>
</template>

<style scoped>
.extra-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.field__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field__label {
  font-weight: 600;
}

textarea {
  width: 100%;
  padding: 0.4rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  background: #fff;
}

.templates {
  margin-top: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
}

.templates__summary {
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-weight: 600;
  user-select: none;
}

.templates__list {
  list-style: none;
  margin: 0;
  padding: 0.4rem 0.6rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
}

.template-btn {
  width: 100%;
  text-align: left;
  padding: 0.4rem 0.6rem;
  border: 1px solid #aaa;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.template-btn:hover {
  background: #f0f6ff;
  border-color: #6699cc;
}
</style>
