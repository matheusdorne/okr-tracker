<script setup>
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'

const props = defineProps({
  kr: { type: Object, required: true },
})

const progress = computed(() => {
  if (!props.kr.target) return 0
  return Math.min(100, Math.round((props.kr.current_value / props.kr.target) * 100))
})
</script>

<template>
  <div style="padding: 18px 22px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 12px;">
    <div style="display: flex; align-items: flex-start; gap: 16px;">
      <div style="flex: 1;">
        <div style="font-size: 14px; font-weight: 500; margin-bottom: 4px;">{{ kr.title }}</div>
        <div style="font-size: 12px; color: var(--ink-4);">{{ kr.unit }}</div>
      </div>
      <div class="num" style="font-size: 14px; color: var(--ink-2); white-space: nowrap;">
        <span style="color: var(--ink-1); font-weight: 500;">{{ kr.current_value }}</span>
        <span style="color: var(--ink-4);"> / {{ kr.target }}</span>
      </div>
      <div class="num" style="font-size: 13px; font-weight: 500; min-width: 38px; text-align: right;">
        {{ progress }}%
      </div>
    </div>
    <ProgressBar :value="progress" />
  </div>
</template>
