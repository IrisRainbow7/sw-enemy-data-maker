<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import BasicInfoForm from '@/components/BasicInfoForm.vue'
import ExtraForm from '@/components/ExtraForm.vue'
import HistoryPanel from '@/components/HistoryPanel.vue'
import PartsForm from '@/components/PartsForm.vue'
import { createEmptyEnemy, type EnemyData } from '@/types/enemy'
import { buildCharacterData } from '@/utils/buildCharacter'
import { clearHistory, loadHistory, removeFromHistory, saveToHistory } from '@/utils/storage'

interface AutoField {
  value: string | number
  touched: boolean
}

const enemy = ref<EnemyData>(createEmptyEnemy())
const {
  category,
  name,
  level,
  intelligence,
  perception,
  reaction,
  impurity,
  language,
  habitat,
  fame,
  weaknessValue,
  weakness,
  initiative,
  speed,
  lifeResist,
  mindResist,
  parts,
  special,
  loot,
} = toRefs(enemy.value)

const autoFields = ref<{
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

const totalSwordFragment = computed(() => parts.value.reduce((sum, p) => sum + p.swordFragment, 0))

watch(
  () => category.value,
  (next, prev) => {
    if (next === prev) return
    if (next === 'アンデッド') {
      if (!autoFields.value.weakness.touched) {
        weakness.value = '回復効果ダメージ+3点'
        autoFields.value.weakness.value = weakness.value
      }
      if (!autoFields.value.impurity.touched) {
        impurity.value = 5
        autoFields.value.impurity.value = impurity.value
      }
      if (!autoFields.value.special.touched) {
        special.value = '○毒無効、○病気無効、○精神効果属性(弱)無効'
        autoFields.value.special.value = special.value
      }
    } else if (next === '人族') {
      if (!autoFields.value.weakness.touched) {
        weakness.value = 'なし'
        autoFields.value.weakness.value = weakness.value
      }
    } else if (next === '魔法生物' || next === '魔動機' || next === '魔神') {
      if (!autoFields.value.impurity.touched) {
        impurity.value = 0
        autoFields.value.impurity.value = impurity.value
      }
    }
    if (next === '魔法生物' || next === '魔動機') {
      if (!autoFields.value.special.touched) {
        special.value = '○毒無効、○病気無効、○精神効果属性無効'
        autoFields.value.special.value = special.value
      }
    }
  },
)

const markWeaknessTouched = () => {
  autoFields.value.weakness.touched = true
  autoFields.value.weakness.value = weakness.value
}

const markImpurityTouched = () => {
  autoFields.value.impurity.touched = true
  autoFields.value.impurity.value = impurity.value
}

const markSpecialTouched = () => {
  autoFields.value.special.touched = true
  autoFields.value.special.value = special.value
}

watch(
  () => weakness.value,
  () => {
    if (weakness.value !== autoFields.value.weakness.value) {
      markWeaknessTouched()
    }
  },
)

watch(
  () => impurity.value,
  () => {
    if (impurity.value !== autoFields.value.impurity.value) {
      markImpurityTouched()
    }
  },
)

watch(
  () => special.value,
  () => {
    if (special.value !== autoFields.value.special.value) {
      markSpecialTouched()
    }
  },
)

const resetAutoFields = () => {
  autoFields.value = {
    weakness: { value: '', touched: false },
    impurity: { value: 0, touched: false },
    special: { value: '', touched: false },
  }
}

const fillEnemy = (data: EnemyData) => {
  Object.assign(enemy.value, createEmptyEnemy(), data, {
    parts: data.parts.map((p) => ({
      ...p,
      id: p.id || crypto.randomUUID(),
    })),
  })
  resetAutoFields()
}

const onCopy = async () => {
  const payload = buildCharacterData(enemy.value)
  const text = JSON.stringify(payload)
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = 'クリップボードにコピーしました'
  } catch {
    copyStatus.value = 'コピーに失敗しました'
    console.warn('Clipboard write failed')
    return
  }
  history.value = saveToHistory(enemy.value)
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
        v-model:category="category"
        v-model:name="name"
        v-model:level="level"
        v-model:intelligence="intelligence"
        v-model:perception="perception"
        v-model:reaction="reaction"
        v-model:impurity="impurity"
        v-model:language="language"
        v-model:habitat="habitat"
        v-model:fame="fame"
        v-model:weakness-value="weaknessValue"
        v-model:weakness="weakness"
        v-model:initiative="initiative"
        v-model:speed="speed"
        v-model:life-resist="lifeResist"
        v-model:mind-resist="mindResist"
        :total-sword-fragment="totalSwordFragment"
        :min-level="1"
      />

      <PartsForm v-model="parts" />

      <ExtraForm
        v-model:special="special"
        v-model:loot="loot"
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
  color: #1f3e6e;
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
