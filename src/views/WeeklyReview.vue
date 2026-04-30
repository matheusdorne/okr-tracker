<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeeklyReview } from '../composables/useWeeklyReview.js'
import ProgressBar from '../components/ProgressBar.vue'
import AppIcon from '../components/AppIcon.vue'

const route = useRoute()
const router = useRouter()

const { goals, krs, isLoading, isSaving, load, loadKRsForGoal, save } = useWeeklyReview()

const selectedGoalId = ref(route.params.goalId !== 'all' ? route.params.goalId : '')

const form = reactive({ wins: '', blockers: '', next_steps: '' })

const today = computed(() => new Date().toISOString().split('T')[0])

const weekNumber = computed(() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
})

const weekRange = computed(() => {
  const now = new Date()
  const day = now.getDay()
  const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(mon)} – ${fmt(sun)}, ${now.getFullYear()}`
})

const numericKRs = computed(() => krs.value.filter(kr => kr.type === 'numeric'))

watch(selectedGoalId, async (id) => {
  if (id) await loadKRsForGoal(id)
})

function krProgress(kr) {
  if (!kr.target) return 0
  return Math.min(100, Math.round((kr.current_value / kr.target) * 100))
}

async function submit() {
  await save({
    goal:        selectedGoalId.value,
    week_number: weekNumber.value,
    year:        new Date().getFullYear(),
    wins:        form.wins,
    blockers:    form.blockers,
    next_steps:  form.next_steps,
    date:        today.value,
  })
  router.push(`/goal/${selectedGoalId.value}`)
}

onMounted(async () => {
  await load()
  if (!selectedGoalId.value && goals.value.length) {
    selectedGoalId.value = goals.value[0].id
  }
  if (selectedGoalId.value) await loadKRsForGoal(selectedGoalId.value)
})
</script>

<template>
  <div class="page-content">
    <div class="page-inner" style="max-width: 680px;">

      <!-- Header -->
      <div style="display: flex; align-items: baseline; gap: 14px; margin-bottom: 6px;">
        <h1 style="font-size: 32px; font-weight: 500; letter-spacing: -0.025em;">
          Week {{ weekNumber }} review
        </h1>
        <span style="font-size: 13px; color: var(--ink-3);">· {{ weekRange }}</span>
      </div>
      <p class="muted" style="font-size: 14px; margin-bottom: 32px; max-width: 480px;">
        Three short prompts. Honest beats polished — these are notes for future-you.
      </p>

      <!-- Goal selector -->
      <div class="field" style="margin-bottom: 30px;">
        <label class="label" for="review-goal">Reviewing</label>
        <select id="review-goal" v-model="selectedGoalId" class="select">
          <option v-for="g in goals" :key="g.id" :value="g.id">
            {{ g.title }} · {{ g.quarter }}
          </option>
        </select>
      </div>

      <!-- Prompts -->
      <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 36px;">
        <div class="field">
          <label class="label" style="display: flex; justify-content: space-between;">
            <span>Wins this week</span>
            <span class="help" style="font-weight: 400;">Anything — small counts.</span>
          </label>
          <textarea v-model="form.wins" class="textarea" rows="3" placeholder="What went well?" />
        </div>

        <div class="field">
          <label class="label" style="display: flex; justify-content: space-between;">
            <span>Blockers or challenges</span>
            <span class="help" style="font-weight: 400;">What got in the way?</span>
          </label>
          <textarea v-model="form.blockers" class="textarea" rows="3" placeholder="What slowed you down?" />
        </div>

        <div class="field">
          <label class="label" style="display: flex; justify-content: space-between;">
            <span>Focus for next week</span>
            <span class="help" style="font-weight: 400;">Pick 1–3 things, not 10.</span>
          </label>
          <textarea v-model="form.next_steps" class="textarea" rows="4" placeholder="1. …&#10;2. …&#10;3. …" />
        </div>
      </div>

      <!-- Progress snapshot -->
      <div v-if="numericKRs.length" style="margin-bottom: 28px;">
        <div style="font-size: 12px; font-weight: 500; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
          Progress snapshot
        </div>
        <div class="card" style="padding: 18px 22px; display: flex; flex-direction: column; gap: 14px;">
          <div
            v-for="kr in numericKRs"
            :key="kr.id"
            style="display: flex; align-items: center; gap: 14px;"
          >
            <div style="width: 200px; font-size: 13px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              {{ kr.title }}
            </div>
            <div style="flex: 1;">
              <ProgressBar :value="krProgress(kr)" thin />
            </div>
            <div class="num" style="font-size: 12px; color: var(--ink-3); min-width: 60px; text-align: right;">
              {{ kr.current_value }} / {{ kr.target }}
            </div>
            <div class="num" style="font-size: 12px; font-weight: 500; min-width: 36px; text-align: right;">
              {{ krProgress(kr) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button class="btn btn-quiet" @click="router.back()">Cancel</button>
        <button class="btn btn-primary btn-lg" :disabled="isSaving" @click="submit">
          {{ isSaving ? 'Saving…' : 'Save review' }}
        </button>
      </div>
    </div>
  </div>
</template>
