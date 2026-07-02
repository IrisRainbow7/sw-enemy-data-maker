<script setup lang="ts">
const modelValue = defineModel<number>({ required: true })

withDefaults(
  defineProps<{
    label: string
    suffix: string
    min?: number
    step?: number
  }>(),
  {
    min: 0,
    step: 1,
  },
)

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const raw = target.value
  if (raw === '') {
    modelValue.value = 0
    return
  }
  const parsed = Number(raw)
  if (Number.isNaN(parsed)) {
    modelValue.value = 0
    return
  }
  modelValue.value = parsed
}
</script>

<template>
  <label class="number-field">
    <span class="number-field__label">{{ label }}</span>
    <div class="number-field__row">
      <input type="number" :min="min" :step="step" :value="modelValue" @input="onInput" />
      <span class="number-field__suffix">{{ suffix }}</span>
    </div>
  </label>
</template>

<style scoped>
.number-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.number-field__label {
  font-weight: 600;
}

.number-field__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.number-field__row input {
  flex: 0 0 6rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
}

.number-field__suffix {
  color: #555;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}
</style>
