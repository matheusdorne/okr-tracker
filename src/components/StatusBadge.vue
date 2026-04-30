<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }, // 'on_track' | 'at_risk' | 'completed'
})

const dotClass = computed(() => ({
  on_track:  'dot-green',
  at_risk:   'dot-amber',
  completed: 'dot dot-green',
}[props.status] ?? 'dot-green'))

const label = computed(() => ({
  on_track:  'On track',
  at_risk:   'At risk',
  completed: 'Completed',
}[props.status] ?? props.status))

const labelStyle = computed(() => ({
  at_risk:   { color: 'var(--amber)', fontWeight: 500 },
  completed: { color: 'var(--purple-600)', fontWeight: 500 },
}[props.status] ?? { color: 'var(--ink-2)' }))
</script>

<template>
  <span style="display: inline-flex; align-items: center; gap: 7px;">
    <span class="dot" :class="dotClass" />
    <span style="font-size: 12px;" :style="labelStyle">{{ label }}</span>
  </span>
</template>
