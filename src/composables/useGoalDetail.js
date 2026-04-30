import { ref, computed } from 'vue'
import { getGoal, getKRs, createKR, updateKR, deleteKR } from '../api/pocketbase.js'

function krProgress(kr) {
  if (kr.type === 'boolean') return kr.done ? 100 : 0
  if (!kr.target) return 0
  return Math.min(100, Math.round((kr.current_value / kr.target) * 100))
}

function overallProgress(krs) {
  if (!krs.length) return 0
  const total = krs.reduce((sum, kr) => sum + krProgress(kr), 0)
  return Math.round(total / krs.length)
}

export function useGoalDetail() {
  const goal = ref(null)
  const krs = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const progress = computed(() => overallProgress(krs.value))
  const numericKRs = computed(() => krs.value.filter(kr => kr.type === 'numeric'))
  const booleanKRs = computed(() => krs.value.filter(kr => kr.type === 'boolean'))

  async function load(goalId) {
    isLoading.value = true
    error.value = null
    try {
      ;[goal.value, krs.value] = await Promise.all([getGoal(goalId), getKRs(goalId)])
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  async function addKR(data) {
    const record = await createKR(data)
    krs.value.push(record)
    return record
  }

  async function editKR(id, data) {
    const record = await updateKR(id, data)
    const idx = krs.value.findIndex(kr => kr.id === id)
    if (idx !== -1) krs.value[idx] = record
    return record
  }

  async function removeKR(id) {
    await deleteKR(id)
    krs.value = krs.value.filter(kr => kr.id !== id)
  }

  return { goal, krs, isLoading, error, progress, numericKRs, booleanKRs, load, addKR, editKR, removeKR }
}
