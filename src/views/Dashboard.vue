<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGoals } from '../composables/useGoals.js'
import GoalCard from '../components/GoalCard.vue'
import AppIcon from '../components/AppIcon.vue'

const router = useRouter()
const { goals, isLoading, avgProgress, load } = useGoals()

const activeFilter = ref('All')
const filters = ['All', 'Q1', 'Q2', 'Q3', 'Q4', 'On track', 'At risk']

const filteredGoals = computed(() => {
  return goals.value.filter(g => {
    if (activeFilter.value === 'All') return true
    if (['Q1', 'Q2', 'Q3', 'Q4'].includes(activeFilter.value)) return g.quarter === activeFilter.value
    if (activeFilter.value === 'On track') return g.status === 'on_track'
    if (activeFilter.value === 'At risk')  return g.status === 'at_risk'
    return true
  })
})

const lastCheckin = computed(() => {
  // placeholder — would come from checkins data
  return 'Today'
})

const today = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
const quarterInfo = computed(() => {
  const now = new Date()
  const q = Math.floor(now.getMonth() / 3) + 1
  return `Q${q} ${now.getFullYear()}`
})

function greet() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

onMounted(load)
</script>

<template>
  <div class="page-content" style="position: relative; min-height: calc(100vh - 60px);">
    <div class="page-inner" style="max-width: 920px;">

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px;">
        <div>
          <div style="font-size: 12px; color: var(--ink-4); margin-bottom: 6px;">{{ today }}</div>
          <h1 style="font-size: 28px; font-weight: 500; letter-spacing: -0.02em;">{{ greet() }}</h1>
        </div>
        <div style="font-size: 12px; color: var(--ink-3);">
          {{ quarterInfo }}
        </div>
      </div>

      <!-- Metric cards -->
      <div style="display: flex; gap: 16px; margin-bottom: 36px;">
        <div class="card" style="padding: 22px; flex: 1;">
          <div style="font-size: 12px; color: var(--ink-3); margin-bottom: 14px;">Active goals</div>
          <div class="num" style="font-size: 36px; font-weight: 500; letter-spacing: -0.02em; line-height: 1;">
            {{ goals.length }}
          </div>
          <div style="font-size: 12px; color: var(--ink-4); margin-top: 10px;">across all quarters</div>
        </div>
        <div class="card" style="padding: 22px; flex: 1;">
          <div style="font-size: 12px; color: var(--ink-3); margin-bottom: 14px;">Avg. progress</div>
          <div class="num" style="font-size: 36px; font-weight: 500; letter-spacing: -0.02em; line-height: 1;">
            {{ avgProgress }}%
          </div>
          <div style="font-size: 12px; color: var(--ink-4); margin-top: 10px;">across all goals</div>
        </div>
        <div class="card" style="padding: 22px; flex: 1;">
          <div style="font-size: 12px; color: var(--ink-3); margin-bottom: 14px;">Last check-in</div>
          <div style="font-size: 36px; font-weight: 500; letter-spacing: -0.02em; line-height: 1;">
            {{ lastCheckin }}
          </div>
          <div style="font-size: 12px; color: var(--ink-4); margin-top: 10px;">keep the streak going</div>
        </div>
      </div>

      <!-- Filter pills -->
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 18px; flex-wrap: wrap;">
        <button
          v-for="f in filters"
          :key="f"
          class="pill"
          :class="{ active: activeFilter === f }"
          @click="activeFilter = f"
        >
          {{ f }}
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" style="text-align: center; padding: 60px; color: var(--ink-4);">
        Loading goals…
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!filteredGoals.length"
        class="card"
        style="padding: 60px; text-align: center; color: var(--ink-3);"
      >
        <div style="font-size: 32px; margin-bottom: 12px;">🎯</div>
        <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">No goals yet</div>
        <div style="font-size: 14px; margin-bottom: 24px;">Set your first objective to get started.</div>
        <RouterLink to="/goal/new" class="btn btn-primary">
          <AppIcon name="plus" :size="14" :stroke="2" /> New goal
        </RouterLink>
      </div>

      <!-- Goal list -->
      <div v-else style="display: flex; flex-direction: column; gap: 12px; padding-bottom: 80px;">
        <GoalCard
          v-for="goal in filteredGoals"
          :key="goal.id"
          :goal="goal"
          :progress="goal._progress ?? 0"
        />
      </div>
    </div>

    <!-- Weekly review prompt -->
    <div style="position: fixed; left: 0; right: 0; bottom: 0; padding: 14px 40px; background: var(--bg); border-top: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 16px; z-index: 10;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--purple-100); color: var(--purple-700); display: grid; place-items: center;">
          <AppIcon name="sparkle" :size="15" />
        </div>
        <div>
          <div style="font-size: 13px; font-weight: 500;">Weekly review</div>
          <div style="font-size: 12px; color: var(--ink-3);">Reflect on the week — takes ~3 minutes</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <RouterLink
          v-if="goals.length"
          :to="`/review/${goals[0]?.id}`"
          class="btn btn-primary btn-sm"
        >
          Start review <AppIcon name="arrow-right" :size="13" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
