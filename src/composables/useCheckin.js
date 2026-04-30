import { ref } from 'vue'
import { getGoals, getKRs, createCheckin, updateKR } from '../api/pocketbase.js'

export function useCheckin() {
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

  async function save({ goalId, values, note, date }) {
    isSaving.value = true
    try {
      const updates = Object.entries(values).map(([krId, val]) => {
        const kr = krs.value.find(k => k.id === krId)
        const checkinData = { goal: goalId, key_result: krId, date }
        if (kr?.type === 'boolean') {
          checkinData.done = val
          return Promise.all([
            createCheckin(checkinData),
            updateKR(krId, { done: val }),
          ])
        }
        checkinData.new_value = val
        if (note) checkinData.note = note
        return Promise.all([
          createCheckin(checkinData),
          updateKR(krId, { current_value: val }),
        ])
      })
      await Promise.all(updates)
    } finally {
      isSaving.value = false
    }
  }

  return { goals, krs, isLoading, isSaving, error, load, loadKRsForGoal, save }
}
