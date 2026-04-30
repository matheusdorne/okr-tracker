<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  kd: { type: Object, required: true },
})

defineEmits(['toggle'])
</script>

<template>
  <div
    style="padding: 14px 22px; border-top: 1px solid var(--line); display: flex; align-items: center; gap: 14px; cursor: pointer;"
    @click="$emit('toggle', kd)"
  >
    <div class="cbox" :class="{ checked: kd.done }">
      <AppIcon v-if="kd.done" name="check" :size="11" :stroke="2.5" />
    </div>
    <div
      style="flex: 1; font-size: 14px;"
      :style="{
        textDecoration: kd.done ? 'line-through' : 'none',
        color: kd.done ? 'var(--ink-4)' : 'var(--ink-1)',
      }"
    >
      {{ kd.title }}
    </div>
    <div style="font-size: 12px; color: var(--ink-4);">{{ kd.done ? 'Done' : 'Open' }}</div>
  </div>
</template>
