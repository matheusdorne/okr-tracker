<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from './ProgressBar.vue'
import StatusBadge from './StatusBadge.vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  goal:     { type: Object, required: true },
  progress: { type: Number, default: 0 },
  krCount:  { type: Number, default: 0 },
  kdCount:  { type: Number, default: 0 },
})

const router = useRouter()

const barTone = computed(() => props.goal.status === 'at_risk' ? 'amber' : 'purple')

const summary = computed(() => {
  const parts = []
  if (props.krCount) parts.push(`${props.krCount} KR${props.krCount > 1 ? 's' : ''}`)
  if (props.kdCount) parts.push(`${props.kdCount} KD${props.kdCount > 1 ? 's' : ''}`)
  return parts.join(' · ')
})
</script>

<template>
  <div
    class="card"
    style="padding: 22px 26px; display: flex; flex-direction: column; gap: 16px; cursor: pointer;"
    @click="router.push(`/goal/${goal.id}`)"
  >
    <div style="display: flex; align-items: flex-start; gap: 16px;">
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
          <span class="badge badge-purple">{{ goal.quarter }} · {{ goal.year }}</span>
          <StatusBadge :status="goal.status" />
        </div>
        <div style="font-size: 16px; font-weight: 500; letter-spacing: -0.01em;">
          {{ goal.title }}
        </div>
        <div style="font-size: 12px; color: var(--ink-4); margin-top: 4px;">{{ summary }}</div>
      </div>
      <RouterLink
        :to="`/checkin/${goal.id}`"
        class="btn btn-ghost btn-sm"
        @click.stop
      >
        <AppIcon name="plus" :size="13" :stroke="2" />
        Check-in
      </RouterLink>
    </div>
    <div style="display: flex; align-items: center; gap: 14px;">
      <div style="flex: 1;">
        <ProgressBar :value="progress" :tone="barTone" />
      </div>
      <span class="num" style="font-size: 13px; font-weight: 500; min-width: 40px; text-align: right;">
        {{ progress }}%
      </span>
    </div>
  </div>
</template>
