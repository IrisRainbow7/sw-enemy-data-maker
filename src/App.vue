<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import BasicInfoForm from '@/components/BasicInfoForm.vue'
import ExtraForm from '@/components/ExtraForm.vue'
import HistoryPanel from '@/components/HistoryPanel.vue'
import PartsForm from '@/components/PartsForm.vue'
import { createEmptyEnemy, type Category, type EnemyData } from '@/types/enemy'
import { buildCharacterData } from '@/utils/buildCharacter'
import { clearHistory, loadHistory, removeFromHistory, saveToHistory } from '@/utils/storage'

interface AutoField {
  value: string | number
  touched: boolean
}

const enemy = reactive<EnemyData>(createEmptyEnemy())
const autoFields = reactive<{
  weakness: AutoField
  impurity: AutoField
  special: AutoField
}>({
  weakness: { value: '', touched: false },
  impurity: { value: 0, touched: false },
  special: { value: '', touched: false },
})

const history = ref<EnemyData[]>([])
const copyStatus = ref<string>('')

onMounted(() => {
  history.value = loadHistory()
})

const totalSwordFragment = computed(() => enemy.parts.reduce((sum, p) => sum + p.swordFragment, 0))

watch(
  () => enemy.category,
  (next, prev) => {
    if (next === prev) return
    if (next === 'アンデッド') {
      if (!autoFields.weakness.touched) {
        enemy.weakness = '回復効果ダメージ+3点'
        autoFields.weakness.value = enemy.weakness
      }
      if (!autoFields.impurity.touched) {
        enemy.impurity = 5
        autoFields.impurity.value = enemy.impurity
      }
      if (!autoFields.special.touched) {
        enemy.special = '○毒無効、○病気無効、○精神効果属性(弱)無効'
        autoFields.special.value = enemy.special
      }
    } else if (next === '人族') {
      if (!autoFields.weakness.touched) {
        enemy.weakness = 'なし'
        autoFields.weakness.value = enemy.weakness
      }
    } else if (next === '魔法生物' || next === '魔動機' || next === '魔神') {
      if (!autoFields.impurity.touched) {
        enemy.impurity = 0
        autoFields.impurity.value = enemy.impurity
      }
    }
    if (next === '魔法生物' || next === '魔動機') {
      if (!autoFields.special.touched) {
        enemy.special = '○毒無効、○病気無効、○精神効果属性無効'
        autoFields.special.value = enemy.special
      }
    }
  },
)

const markWeaknessTouched = () => {
  autoFields.weakness.touched = true
  autoFields.weakness.value = enemy.weakness
}

const markImpurityTouched = () => {
  autoFields.impurity.touched = true
  autoFields.impurity.value = enemy.impurity
}

const markSpecialTouched = () => {
  autoFields.special.touched = true
  autoFields.special.value = enemy.special
}

watch(
  () => enemy.weakness,
  () => {
    if (enemy.weakness !== autoFields.weakness.value) {
      markWeaknessTouched()
    }
  },
)

watch(
  () => enemy.impurity,
  () => {
    if (enemy.impurity !== autoFields.impurity.value) {
      markImpurityTouched()
    }
  },
)

watch(
  () => enemy.special,
  () => {
    if (enemy.special !== autoFields.special.value) {
      markSpecialTouched()
    }
  },
)

const resetAutoFields = () => {
  autoFields.weakness = { value: '', touched: false }
  autoFields.impurity = { value: 0, touched: false }
  autoFields.special = { value: '', touched: false }
}

const fillEnemy = (data: EnemyData) => {
  Object.assign(enemy, createEmptyEnemy(), {
    ...data,
    parts: data.parts.map((p) => ({ ...p, id: p.id || crypto.randomUUID() })),
  })
  resetAutoFields()
}

const onCopy = async () => {
  const payload = buildCharacterData(enemy)
  const text = JSON.stringify(payload)
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = 'クリップボードにコピーしました'
  } catch {
    copyStatus.value = 'コピーに失敗しました'
    console.warn('Clipboard write failed')
    return
  }
  history.value = saveToHistory(enemy)
  setTimeout(() => {
    copyStatus.value = ''
  }, 2000)
}

const onRestore = (data: EnemyData) => {
  fillEnemy(data)
}

const onRemoveHistory = (name: string) => {
  history.value = removeFromHistory(name)
}

const onClearHistory = () => {
  clearHistory()
  history.value = []
}

void markWeaknessTouched
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1>SW2.5 敵データメーカー</h1>
      <div class="app__actions">
        <button type="button" class="btn btn--primary" @click="onCopy">JSON をコピー</button>
        <span v-if="copyStatus" class="copy-status">{{ copyStatus }}</span>
      </div>
    </header>

    <main class="app__main">
      <BasicInfoForm
        v-model:category="enemy.category as Category"
        v-model:name="enemy.name"
        v-model:level="enemy.level"
        v-model:intelligence="enemy.intelligence"
        v-model:perception="enemy.perception"
        v-model:reaction="enemy.reaction"
        v-model:impurity="enemy.impurity"
        v-model:language="enemy.language"
        v-model:habitat="enemy.habitat"
        v-model:fame="enemy.fame"
        v-model:weakness-value="enemy.weaknessValue"
        v-model:weakness="enemy.weakness"
        v-model:initiative="enemy.initiative"
        v-model:speed="enemy.speed"
        v-model:life-resist="enemy.lifeResist"
        v-model:mind-resist="enemy.mindResist"
        :total-sword-fragment="totalSwordFragment"
        :min-level="1"
      />

      <PartsForm v-model="enemy.parts" />

      <ExtraForm
        v-model:special="enemy.special"
        v-model:loot="enemy.loot"
        @mark-special-touched="markSpecialTouched"
      />

      <HistoryPanel
        :history="history"
        @restore="onRestore"
        @remove="onRemoveHistory"
        @clear="onClearHistory"
      />
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem 1.25rem 4rem;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    sans-serif;
  color: #222;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.app__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.75rem;
}

h1 {
  margin: 0;
  font-size: 1.4rem;
}

.app__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #888;
  border-radius: 4px;
  background: #f6f6f6;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn--primary {
  background: #d9eaff;
  border-color: #6699cc;
  color: #1f3f6e;
  font-weight: 600;
}

.btn--primary:hover {
  background: #c4ddf7;
}

.copy-status {
  font-size: 0.9rem;
  color: #2c5e30;
}

.app__main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
