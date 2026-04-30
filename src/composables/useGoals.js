import { ref, computed } from 'vue'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../api/pocketbase.js'

const STATUS = { ON_TRACK: 'on_track', AT_RISK: 'at_risk', COMPLETED: 'completed' }

function deriveStatus(progress) {
  if (progress >= 100) return STATUS.COMPLETED
  if (progress >= 60)  return STATUS.ON_TRACK
  return STATUS.AT_RISK
}

export function useGoals() {
  const goals = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const activeGoals = computed(() => goals.value.filter(g => g.status !== STATUS.COMPLETED))
  const avgProgress = computed(() => {
    if (!goals.value.length) return 0
    const total = goals.value.reduce((sum, g) => sum + (g._progress ?? 0), 0)
    return Math.round(total / goals.value.length)
  })

  async function load() {
    isLoading.value = true
    error.value = null
    try {
      goals.value = await getGoals()
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  async function save(data) {
    const record = await createGoal(data)
    goals.value.unshift(record)
    return record
  }

  async function edit(id, data) {
    const record = await updateGoal(id, data)
    const idx = goals.value.findIndex(g => g.id === id)
    if (idx !== -1) goals.value[idx] = record
    return record
  }

  async function remove(id) {
    await deleteGoal(id)
    goals.value = goals.value.filter(g => g.id !== id)
  }

  return { goals, isLoading, error, activeGoals, avgProgress, load, save, edit, remove }
}
