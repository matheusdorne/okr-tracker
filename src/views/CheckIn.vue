<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCheckin } from '../composables/useCheckin.js'
import AppIcon from '../components/AppIcon.vue'

const route = useRoute()
const router = useRouter()

const { goals, krs, isLoading, isSaving, load, loadKRsForGoal, save } = useCheckin()

const selectedGoalId = ref(route.params.goalId !== 'all' ? route.params.goalId : '')
const values = reactive({})
const note = ref('')

const today = computed(() => new Date().toISOString().split('T')[0])

const todayLabel = computed(() => new Date().toLocaleDateString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric',
}))

const numericKRs = computed(() => krs.value.filter(kr => kr.type === 'numeric'))
const booleanKRs = computed(() => krs.value.filter(kr => kr.type === 'boolean'))

watch(selectedGoalId, async (id) => {
  if (!id) return
  await loadKRsForGoal(id)
  krs.value.forEach(kr => {
    values[kr.id] = kr.type === 'boolean' ? kr.done : kr.current_value
  })
})

async function submit() {
  await save({ goalId: selectedGoalId.value, values, note: note.value, date: today.value })
  router.push(`/goal/${selectedGoalId.value}`)
}

onMounted(async () => {
  await load()
  if (selectedGoalId.value) {
    await loadKRsForGoal(selectedGoalId.value)
    krs.value.forEach(kr => {
      values[kr.id] = kr.type === 'boolean' ? kr.done : kr.current_value
    })
  } else if (goals.value.length) {
    selectedGoalId.value = goals.value[0].id
  }
})
</script>

<template>
  <div class="page-content">
    <div class="page-inner" style="max-width: 640px;">

      <div style="margin-bottom: 8px; font-size: 12px; color: var(--purple-600); font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;">
        Daily check-in
      </div>
      <h1 style="font-size: 26px; font-weight: 500; letter-spacing: -0.02em; margin-bottom: 6px;">
        How did today go?
      </h1>
      <p class="muted" style="font-size: 14px; margin-bottom: 28px;">
        Quick numbers — should take about a minute.
      </p>

      <!-- Goal selector -->
      <div class="field" style="margin-bottom: 24px;">
        <label class="label" for="checkin-goal">Goal</label>
        <select id="checkin-goal" v-model="selectedGoalId" class="select">
          <option v-for="g in goals" :key="g.id" :value="g.id">
            {{ g.title }} · {{ g.quarter }}
          </option>
        </select>
      </div>

      <div v-if="isLoading" style="color: var(--ink-4); padding: 20px 0;">Loading…</div>

      <template v-else-if="selectedGoalId">

        <!-- Numeric KRs -->
        <div v-if="numericKRs.length" style="margin-bottom: 22px;">
          <div style="font-size: 12px; font-weight: 500; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
            Key Results
          </div>
          <div class="card">
            <div
              v-for="(kr, i) in numericKRs"
              :key="kr.id"
              style="padding: 16px 20px; display: flex; align-items: center; gap: 16px;"
              :style="{ borderTop: i ? '1px solid var(--line)' : 'none' }"
            >
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 13px; font-weight: 500; margin-bottom: 3px;">{{ kr.title }}</div>
                <div style="font-size: 12px; color: var(--ink-4);">
                  Target {{ kr.target }} {{ kr.unit }} · was {{ kr.current_value }}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input
                  v-model.number="values[kr.id]"
                  class="input num"
                  type="number"
                  style="width: 72px; text-align: right; padding: 8px 10px;"
                />
                <span class="dim num" style="font-size: 12px; min-width: 30px;">{{ kr.unit }}</span>
                <span
                  v-if="values[kr.id] !== kr.current_value"
                  class="num"
                  style="font-size: 11px; font-weight: 500; min-width: 32px;"
                  :style="{ color: values[kr.id] > kr.current_value ? 'var(--green)' : 'var(--ink-4)' }"
                >
                  {{ values[kr.id] > kr.current_value ? '+' : '' }}{{ values[kr.id] - kr.current_value }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Boolean KDs -->
        <div v-if="booleanKRs.length" style="margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 500; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
            Deliverables
          </div>
          <div class="card">
            <div
              v-for="(kd, i) in booleanKRs"
              :key="kd.id"
              style="padding: 14px 20px; display: flex; align-items: center; gap: 14px; cursor: pointer;"
              :style="{ borderTop: i ? '1px solid var(--line)' : 'none' }"
              @click="values[kd.id] = !values[kd.id]"
            >
              <div class="cbox" :class="{ checked: values[kd.id] }">
                <AppIcon v-if="values[kd.id]" name="check" :size="11" :stroke="2.5" />
              </div>
              <div
                style="flex: 1; font-size: 13px;"
                :style="{
                  textDecoration: values[kd.id] ? 'line-through' : 'none',
                  color: values[kd.id] ? 'var(--ink-4)' : 'var(--ink-1)',
                }"
              >
                {{ kd.title }}
              </div>
            </div>
          </div>
        </div>

        <!-- Note -->
        <div class="field" style="margin-bottom: 28px;">
          <label class="label">
            <AppIcon name="note" :size="12" style="vertical-align: -2px; margin-right: 4px;" />
            Note
            <span class="dim" style="font-weight: 400;"> · anything worth logging?</span>
          </label>
          <textarea
            v-model="note"
            class="textarea"
            rows="3"
            placeholder="What happened today? Any blockers or breakthroughs?"
          />
        </div>

        <!-- Actions -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="help">
            Logging for <span style="color: var(--ink-2);">{{ todayLabel }}</span>
          </span>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-quiet" @click="router.back()">Cancel</button>
            <button
              class="btn btn-primary btn-lg"
              :disabled="isSaving"
              @click="submit"
            >
              <AppIcon name="check" :size="14" :stroke="2.5" />
              {{ isSaving ? 'Saving…' : 'Save check-in' }}
            </button>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>
