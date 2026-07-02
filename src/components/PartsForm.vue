<script setup lang="ts">
import type { Part } from '@/types/enemy'
import NumberField from './NumberField.vue'

const parts = defineModel<Part[]>('modelValue', { required: true })

const addPart = () => {
  parts.value = [
    ...parts.value,
    {
      id: crypto.randomUUID(),
      rawName: '',
      accuracy: 0,
      damage: '2d+',
      evasion: 0,
      defense: 0,
      hp: 0,
      mp: 0,
      swordFragment: 0,
    },
  ]
}

const removePart = (i: number) => {
  if (parts.value.length <= 1) return
  parts.value = parts.value.filter((_, idx) => idx !== i)
}

const accuracySuffix = (n: number) => `（${n + 7}）`
const evasionSuffix = (n: number) => `（${n + 7}）`
const hpSuffix = (sword: number) => `+${sword * 5}`
const mpSuffix = (sword: number) => `+${sword}`
</script>

<template>
  <section class="parts-form">
    <div class="parts-form__header">
      <h2>部位</h2>
      <button type="button" class="btn btn--add" @click="addPart">＋ 部位を追加</button>
    </div>

    <div v-for="(part, i) in parts" :key="part.id" class="part-card">
      <div class="part-card__header">
        <span class="part-card__index">部位 #{{ i + 1 }}</span>
        <button
          v-if="parts.length > 1"
          type="button"
          class="btn btn--remove"
          @click="removePart(i)"
        >
          削除
        </button>
      </div>

      <div class="grid">
        <label class="field field--wide">
          <span class="field__label">攻撃方法(部位)</span>
          <input v-model="part.rawName" type="text" placeholder="例: 爪(右手)" />
        </label>

        <NumberField
          v-model="part.accuracy"
          label="命中力"
          :suffix="accuracySuffix(part.accuracy)"
        />

        <label class="field">
          <span class="field__label">打撃点</span>
          <input v-model="part.damage" type="text" />
        </label>

        <NumberField v-model="part.evasion" label="回避力" :suffix="evasionSuffix(part.evasion)" />

        <NumberField v-model="part.defense" label="防護点" suffix="" />

        <NumberField v-model="part.hp" label="HP" :suffix="hpSuffix(part.swordFragment)" />

        <NumberField v-model="part.mp" label="MP" :suffix="mpSuffix(part.swordFragment)" />

        <NumberField v-model="part.swordFragment" label="剣のかけら" suffix="" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.parts-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.parts-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.25rem;
  flex: 1;
}

.btn {
  padding: 0.3rem 0.75rem;
  border: 1px solid #888;
  border-radius: 4px;
  background: #f6f6f6;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn--add {
  background: #e8f4ea;
  border-color: #6aa86e;
  color: #2c5e30;
}

.btn--remove {
  background: #fdecec;
  border-color: #c47373;
  color: #8a2a2a;
}

.part-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.75rem;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.part-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.part-card__index {
  font-weight: 600;
  color: #555;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

input {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  background: #fff;
}
</style>
