<script setup lang="ts">
import type { EnemyData } from '@/types/enemy'

defineProps<{
  history: EnemyData[]
}>()

const emit = defineEmits<{
  (e: 'restore', data: EnemyData): void
  (e: 'remove', name: string): void
  (e: 'clear'): void
}>()

const onRestore = (data: EnemyData) => {
  const ok = confirm('現在入力中のデータが破棄されます')
  if (!ok) return
  emit('restore', data)
}

const onRemove = (name: string) => {
  const ok = confirm(`履歴「${name}」を削除しますか？`)
  if (!ok) return
  emit('remove', name)
}

const onClear = () => {
  if (history.length === 0) return
  const ok = confirm('履歴を全て削除しますか？')
  if (!ok) return
  emit('clear')
}
</script>

<template>
  <section class="history-panel">
    <div class="history-panel__header">
      <h2>履歴</h2>
      <button
        type="button"
        class="btn btn--clear"
        :disabled="history.length === 0"
        @click="onClear"
      >
        全クリア
      </button>
    </div>

    <p v-if="history.length === 0" class="empty">履歴はまだありません。</p>

    <ul v-else class="history-list">
      <li v-for="d in [...history].reverse()" :key="d.name" class="history-item">
        <button type="button" class="history-item__restore" @click="onRestore(d)">
          <div class="history-item__name">{{ d.name || '(無名)' }}</div>
          <div class="history-item__meta">
            {{ d.category }} / LV{{ d.level }} / 部位{{ d.parts.length }}
          </div>
        </button>
        <button type="button" class="btn btn--remove" aria-label="削除" @click="onRemove(d.name)">
          ×
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.history-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.25rem;
  flex: 1;
}

.empty {
  margin: 0;
  color: #888;
  font-size: 0.9rem;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-height: 320px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: stretch;
  gap: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

.history-item__restore {
  flex: 1;
  text-align: left;
  background: transparent;
  border: 0;
  padding: 0.5rem 0.6rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.history-item__restore:hover {
  background: #f0f6ff;
}

.history-item__name {
  font-weight: 600;
}

.history-item__meta {
  font-size: 0.8rem;
  color: #666;
}

.btn {
  padding: 0.3rem 0.6rem;
  border: 1px solid #888;
  border-radius: 4px;
  background: #f6f6f6;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--clear {
  background: #fdecec;
  border-color: #c47373;
  color: #8a2a2a;
}

.btn--remove {
  background: #fdecec;
  border-color: #c47373;
  color: #8a2a2a;
  font-size: 1rem;
  padding: 0 0.6rem;
  border-radius: 0;
  border-top: 0;
  border-bottom: 0;
  border-right: 0;
}
</style>
