<script setup lang="ts">
import type { Category, Intelligence, Perception, Reaction } from '@/types/enemy'
import { CATEGORIES, INTELLIGENCES, PERCEPTIONS, REACTIONS } from '@/types/enemy'
import NumberField from './NumberField.vue'
import { resistBonus } from '@/utils/resist'

const category = defineModel<Category>('category', { required: true })
const name = defineModel<string>('name', { required: true })
const level = defineModel<number>('level', { required: true })
const intelligence = defineModel<Intelligence>('intelligence', {
  required: true,
})
const perception = defineModel<Perception>('perception', { required: true })
const reaction = defineModel<Reaction>('reaction', { required: true })
const impurity = defineModel<number>('impurity', { required: true })
const language = defineModel<string>('language', { required: true })
const habitat = defineModel<string>('habitat', { required: true })
const fame = defineModel<number>('fame', { required: true })
const weaknessValue = defineModel<number>('weaknessValue', { required: true })
const weakness = defineModel<string>('weakness', { required: true })
const initiative = defineModel<number>('initiative', { required: true })
const speed = defineModel<number>('speed', { required: true })
const lifeResist = defineModel<number>('lifeResist', { required: true })
const mindResist = defineModel<number>('mindResist', { required: true })

defineProps<{
  totalSwordFragment: number
  minLevel: number
}>()

const onNumberInput = (e: Event, min: number, fallback: number): number => {
  const target = e.target as HTMLInputElement
  const raw = target.value
  if (raw === '') return fallback
  const parsed = Number(raw)
  if (Number.isNaN(parsed)) return fallback
  if (parsed < min) return min
  return parsed
}

const onNameInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  name.value = target.value
}

const onTextInput = (setter: (v: string) => void) => (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  setter(target.value)
}

const onSelectInput =
  <T extends string>(setter: (v: T) => void) =>
  (e: Event) => {
    const target = e.target as HTMLSelectElement
    setter(target.value as T)
  }

const resistSuffix = (n: number, totalSword: number) => {
  const bonus = resistBonus(totalSword)
  return `+${bonus}（${n + bonus + 7}）`
}
</script>

<template>
  <section class="basic-info">
    <h2>基本情報</h2>
    <div class="grid">
      <label class="field">
        <span class="field__label">分類</span>
        <select :value="category" @change="onSelectInput<Category>((v) => (category = v))($event)">
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">名称</span>
        <input type="text" :value="name" placeholder="例: ゴブリン" @input="onNameInput" />
      </label>

      <label class="field">
        <span class="field__label">レベル</span>
        <input
          type="number"
          :min="minLevel"
          step="1"
          :value="level"
          @input="(e) => (level = onNumberInput(e, minLevel, 1))"
        />
      </label>

      <label class="field">
        <span class="field__label">知能</span>
        <select
          :value="intelligence"
          @change="onSelectInput<Intelligence>((v) => (intelligence = v))($event)"
        >
          <option v-for="i in INTELLIGENCES" :key="i" :value="i">
            {{ i }}
          </option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">知覚</span>
        <select
          :value="perception"
          @change="onSelectInput<Perception>((v) => (perception = v))($event)"
        >
          <option v-for="p in PERCEPTIONS" :key="p" :value="p">{{ p }}</option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">反応</span>
        <select :value="reaction" @change="onSelectInput<Reaction>((v) => (reaction = v))($event)">
          <option v-for="r in REACTIONS" :key="r" :value="r">{{ r }}</option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">穢れ</span>
        <input
          type="number"
          min="0"
          step="1"
          :value="impurity"
          @input="(e) => (impurity = onNumberInput(e, 0, 0))"
        />
      </label>

      <label class="field">
        <span class="field__label">言語</span>
        <input
          type="text"
          :value="language"
          placeholder="例: ゴブリン語"
          @input="onTextInput((v) => (language = v))"
        />
      </label>

      <label class="field">
        <span class="field__label">生息地</span>
        <input
          type="text"
          :value="habitat"
          placeholder="例: 森林"
          @input="onTextInput((v) => (habitat = v))"
        />
      </label>

      <NumberField v-model="fame" label="知名度" :suffix="''" />
      <NumberField v-model="weaknessValue" label="弱点値" :suffix="''" />

      <label class="field field--wide">
        <span class="field__label">弱点</span>
        <input type="text" :value="weakness" @input="onTextInput((v) => (weakness = v))" />
      </label>

      <NumberField v-model="initiative" label="先制値" :suffix="''" />
      <NumberField v-model="speed" label="移動速度" :suffix="''" />

      <NumberField
        v-model="lifeResist"
        label="生命抵抗力"
        :suffix="resistSuffix(lifeResist, totalSwordFragment)"
      />
      <NumberField
        v-model="mindResist"
        label="精神抵抗力"
        :suffix="resistSuffix(mindResist, totalSwordFragment)"
      />
    </div>
  </section>
</template>

<style scoped>
.basic-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.25rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.field--wide {
  grid-column: 1 / -1;
}

.field__label {
  font-weight: 600;
}

input,
select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  background: #fff;
}
</style>
