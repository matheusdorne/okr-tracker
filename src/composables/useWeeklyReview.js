import { ref } from 'vue'
import { getGoals, getKRs, createReview } from '../api/pocketbase.js'

export function useWeeklyReview() {
  const goals = ref([])
  const krs = ref([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref(null)

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

  async function loadKRsForGoal(goalId) {
    krs.value = await getKRs(goalId)
  }

  async function save(data) {
    isSaving.value = true
    try {
      await createReview(data)
    } finally {
      isSaving.value = false
    }
  }

  return { goals, krs, isLoading, isSaving, error, load, loadKRsForGoal, save }
}
