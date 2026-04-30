<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  entries: { type: Array, required: true },
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function accentFor(entry) {
  return entry._type === 'review' ? 'var(--purple-500)' : 'var(--amber)'
}
</script>

<template>
  <div>
    <div
      v-for="entry in entries"
      :key="entry.id"
      style="display: flex; gap: 0; position: relative;"
    >
      <!-- Timeline gutter -->
      <div style="width: 28px; position: relative; flex: none;">
        <div style="position: absolute; left: 13px; top: 0; bottom: 0; width: 1px; background: var(--line);" />
        <div
          style="position: absolute; left: 7px; top: 22px; width: 13px; height: 13px; border-radius: 50%; background: var(--bg);"
          :style="{ border: `2px solid ${accentFor(entry)}` }"
        />
      </div>

      <!-- Card -->
      <div
        style="flex: 1; margin: 8px 0 18px; padding: 14px 18px; background: var(--bg); border: 1px solid var(--line); border-radius: var(--r-md);"
        :style="{ borderLeft: `3px solid ${accentFor(entry)}` }"
      >
        <!-- Header -->
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <span
            style="font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em;"
            :style="{ color: accentFor(entry) }"
          >
            {{ entry._type === 'review' ? `Weekly review · Week ${entry.week_number}` : 'Check-in' }}
          </span>
          <span style="font-size: 11px; color: var(--ink-4);">· {{ formatDate(entry.date) }}</span>
        </div>

        <!-- Review body -->
        <div v-if="entry._type === 'review'" style="display: grid; grid-template-columns: 90px 1fr; row-gap: 10px; column-gap: 16px; font-size: 13px;">
          <div class="muted" style="font-size: 12px;">Wins</div>
          <div>{{ entry.wins }}</div>
          <div class="muted" style="font-size: 12px;">Blockers</div>
          <div>{{ entry.blockers }}</div>
          <div class="muted" style="font-size: 12px;">Next focus</div>
          <div>{{ entry.next_steps }}</div>
        </div>

        <!-- Check-in body -->
        <div v-else>
          <div style="font-size: 13px; margin-bottom: 6px;">
            <span style="color: var(--ink-3);">Updated value to</span>
            <span class="num" style="font-weight: 500; margin-left: 4px;">{{ entry.new_value ?? (entry.done ? 'Done' : 'Open') }}</span>
          </div>
          <div
            v-if="entry.note"
            style="margin-top: 10px; padding: 8px 12px; background: var(--bg-soft); border-radius: 6px; font-size: 12px; color: var(--ink-2); font-style: italic;"
          >
            "{{ entry.note }}"
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
