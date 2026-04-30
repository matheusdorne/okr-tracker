<script setup>
defineProps({
  value: { type: Number, required: true },
  tone:  { type: String, default: 'purple' }, // 'purple' | 'amber' | 'green'
  thick: { type: Boolean, default: false },
  thin:  { type: Boolean, default: false },
})
</script>

<template>
  <div :class="['bar', tone !== 'purple' && tone, thick && 'thick', thin && 'thin']">
    <span :style="{ width: `${Math.min(100, Math.max(0, value))}%` }" />
  </div>
</template>
