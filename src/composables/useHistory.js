import { ref, computed } from 'vue'
import { getCheckins, getReviews } from '../api/pocketbase.js'

function toTimeline(checkins, reviews) {
  const checkinItems = checkins.map(c => ({ ...c, _type: 'check' }))
  const reviewItems  = reviews.map(r => ({ ...r, _type: 'review' }))
  return [...checkinItems, ...reviewItems].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  )
}

export function useHistory() {
  const checkins = ref([])
  const reviews = ref([])
  const isLoading = ref(false)
  const filter = ref('all')

  const timeline = computed(() => toTimeline(checkins.value, reviews.value))

  const filtered = computed(() => {
    if (filter.value === 'check')  return timeline.value.filter(e => e._type === 'check')
    if (filter.value === 'review') return timeline.value.filter(e => e._type === 'review')
    return timeline.value
  })

  async function load(goalId) {
    isLoading.value = true
    try {
      ;[checkins.value, reviews.value] = await Promise.all([
        getCheckins(goalId),
        getReviews(goalId),
      ])
    } finally {
      isLoading.value = false
    }
  }

  return { filtered, isLoading, filter, load }
}
