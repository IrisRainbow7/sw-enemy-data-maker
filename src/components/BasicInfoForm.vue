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
        <select v-model="category">
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">名称</span>
        <input type="text" v-model="name" placeholder="例: ゴブリン" />
      </label>

      <NumberField v-model="level" label="レベル" suffix="" :min="minLevel" :step="1" />

      <label class="field">
        <span class="field__label">知能</span>
        <select v-model="intelligence">
          <option v-for="i in INTELLIGENCES" :key="i" :value="i">{{ i }}</option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">知覚</span>
        <select v-model="perception">
          <option v-for="p in PERCEPTIONS" :key="p" :value="p">{{ p }}</option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">反応</span>
        <select v-model="reaction">
          <option v-for="r in REACTIONS" :key="r" :value="r">{{ r }}</option>
        </select>
      </label>

      <NumberField v-model="impurity" label="穢れ" suffix="" :min="0" :step="1" />

      <label class="field">
        <span class="field__label">言語</span>
        <input type="text" v-model="language" placeholder="例: ゴブリン語" />
      </label>

      <label class="field">
        <span class="field__label">生息地</span>
        <input type="text" v-model="habitat" placeholder="例: 森林" />
      </label>

      <NumberField v-model="fame" label="知名度" suffix="" />
      <NumberField v-model="weaknessValue" label="弱点値" suffix="" />

      <label class="field field--wide">
        <span class="field__label">弱点</span>
        <input type="text" v-model="weakness" />
      </label>

      <NumberField v-model="initiative" label="先制値" suffix="" />
      <NumberField v-model="speed" label="移動速度" suffix="" />

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
