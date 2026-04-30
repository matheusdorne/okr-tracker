<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGoal, createGoal, updateGoal } from '../api/pocketbase.js'
import AppIcon from '../components/AppIcon.vue'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id && route.params.id !== 'new')

const form = reactive({
  title:       '',
  description: '',
  quarter:     'Q2',
  year:        new Date().getFullYear(),
  status:      'on_track',
})

const isSaving = reactive({ value: false })

async function loadGoal() {
  if (!isEdit.value) return
  const goal = await getGoal(route.params.id)
  Object.assign(form, {
    title:       goal.title,
    description: goal.description ?? '',
    quarter:     goal.quarter,
    year:        goal.year,
    status:      goal.status,
  })
}

async function submit() {
  if (!form.title.trim()) return
  isSaving.value = true
  try {
    if (isEdit.value) {
      await updateGoal(route.params.id, { ...form })
      router.push(`/goal/${route.params.id}`)
    } else {
      const record = await createGoal({ ...form })
      router.push(`/goal/${record.id}`)
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(loadGoal)
</script>

<template>
  <div class="page-content">
    <div class="page-inner" style="max-width: 600px;">

      <button class="btn btn-quiet btn-sm" style="margin-bottom: 22px; margin-left: -8px;" @click="router.back()">
        <AppIcon name="x" :size="14" /> Cancel
      </button>

      <div style="margin-bottom: 8px; font-size: 12px; color: var(--purple-600); font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;">
        {{ isEdit ? 'Edit goal' : 'New goal' }}
      </div>
      <h1 style="font-size: 26px; font-weight: 500; letter-spacing: -0.02em; margin-bottom: 8px;">
        {{ isEdit ? 'Update your objective' : 'What do you want to achieve?' }}
      </h1>
      <p class="muted" style="font-size: 14px; margin-bottom: 32px; max-width: 480px;">
        Start with a clear, ambitious outcome. You'll add Key Results and Deliverables on the goal page.
      </p>

      <div class="card" style="padding: 28px; display: flex; flex-direction: column; gap: 22px;">

        <div class="field">
          <label class="label" for="goal-title">Goal title</label>
          <input
            id="goal-title"
            v-model="form.title"
            class="input"
            placeholder="e.g. Run a sub-1:50 half marathon"
          />
        </div>

        <div style="display: flex; gap: 14px;">
          <div class="field" style="flex: 1;">
            <label class="label" for="goal-quarter">Quarter</label>
            <select id="goal-quarter" v-model="form.quarter" class="select">
              <option>Q1</option>
              <option>Q2</option>
              <option>Q3</option>
              <option>Q4</option>
            </select>
          </div>
          <div class="field" style="flex: 1;">
            <label class="label" for="goal-year">Year</label>
            <select id="goal-year" v-model.number="form.year" class="select">
              <option :value="2025">2025</option>
              <option :value="2026">2026</option>
              <option :value="2027">2027</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label class="label" for="goal-desc">
            Description
            <span class="dim" style="font-weight: 400;"> · optional</span>
          </label>
          <textarea
            id="goal-desc"
            v-model="form.description"
            class="textarea"
            rows="4"
            placeholder="Why does this matter? What does success look like?"
          />
          <div class="help">Markdown supported.</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: flex-end; gap: 14px; margin-top: 24px;">
        <button class="btn btn-quiet" @click="router.back()">Cancel</button>
        <button
          class="btn btn-primary btn-lg"
          :disabled="isSaving.value || !form.title.trim()"
          @click="submit"
        >
          {{ isSaving.value ? 'Saving…' : (isEdit ? 'Update goal' : 'Save goal') }}
        </button>
      </div>

      <p class="help" style="margin-top: 18px; text-align: center;">
        You'll add Key Results and Deliverables on the goal page.
      </p>
    </div>
  </div>
</template>
