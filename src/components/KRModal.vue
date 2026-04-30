<script setup>
import { ref, reactive } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  goalId: { type: String, required: true },
})

const emit = defineEmits(['save', 'close'])

const type = ref('numeric')
const form = reactive({ title: '', unit: '', current_value: 0, target: 0, done: false })

function submit() {
  const data = {
    goal: props.goalId,
    title: form.title,
    type: type.value,
  }
  if (type.value === 'numeric') {
    data.unit = form.unit
    data.current_value = Number(form.current_value)
    data.target = Number(form.target)
  } else {
    data.done = form.done
  }
  emit('save', data)
}
</script>

<template>
  <!-- Scrim -->
  <div
    style="position: fixed; inset: 0; background: rgba(14,14,18,0.32); z-index: 40; display: grid; place-items: center;"
    @click.self="emit('close')"
  >
    <!-- Modal -->
    <div style="width: 460px; background: var(--bg); border: 1px solid var(--line); border-radius: var(--r-xl); box-shadow: 0 30px 60px -20px rgba(0,0,0,.25); padding: 26px;">

      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <h2 style="font-size: 16px; font-weight: 500;">Add to goal</h2>
        <button class="btn btn-quiet btn-sm" style="padding: 6px;" @click="emit('close')">
          <AppIcon name="x" :size="14" />
        </button>
      </div>

      <!-- Type selector -->
      <div class="seg" style="width: 100%; margin-bottom: 22px;">
        <button
          :class="{ on: type === 'numeric' }"
          style="flex: 1; justify-content: center;"
          @click="type = 'numeric'"
        >
          <AppIcon name="trend-up" :size="13" />
          Key Result
          <span class="dim" style="font-size: 11px;">· numeric</span>
        </button>
        <button
          :class="{ on: type === 'boolean' }"
          style="flex: 1; justify-content: center;"
          @click="type = 'boolean'"
        >
          <AppIcon name="check-circle" :size="13" />
          Deliverable
          <span class="dim" style="font-size: 11px;">· boolean</span>
        </button>
      </div>

      <!-- Numeric fields -->
      <div v-if="type === 'numeric'" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="field">
          <label class="label">Title</label>
          <input v-model="form.title" class="input" placeholder="e.g. Outbound applications sent" />
        </div>
        <div class="field">
          <label class="label">Unit</label>
          <input v-model="form.unit" class="input" placeholder="%, screens, bugs, rounds…" />
        </div>
        <div style="display: flex; gap: 12px;">
          <div class="field" style="flex: 1;">
            <label class="label">Current value</label>
            <input v-model="form.current_value" class="input num" type="number" />
          </div>
          <div class="field" style="flex: 1;">
            <label class="label">Target value</label>
            <input v-model="form.target" class="input num" type="number" />
          </div>
        </div>
      </div>

      <!-- Boolean fields -->
      <div v-else style="display: flex; flex-direction: column; gap: 18px;">
        <div class="field">
          <label class="label">Title</label>
          <input v-model="form.title" class="input" placeholder="What needs to ship?" />
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--bg-soft); border: 1px solid var(--line); border-radius: var(--r-md);">
          <div>
            <div style="font-size: 13px; font-weight: 500;">Done?</div>
            <div class="help">Mark as complete now if it's already shipped.</div>
          </div>
          <div :class="['switch', form.done && 'on']" @click="form.done = !form.done" />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
        <button class="btn btn-quiet" @click="emit('close')">Cancel</button>
        <button class="btn btn-primary" @click="submit">Save</button>
      </div>
    </div>
  </div>
</template>
