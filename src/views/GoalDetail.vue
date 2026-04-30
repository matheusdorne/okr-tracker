<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGoalDetail } from '../composables/useGoalDetail.js'
import { useHistory } from '../composables/useHistory.js'
import ProgressBar from '../components/ProgressBar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import KRItem from '../components/KRItem.vue'
import KDItem from '../components/KDItem.vue'
import KRModal from '../components/KRModal.vue'
import HistoryTimeline from '../components/HistoryTimeline.vue'
import AppIcon from '../components/AppIcon.vue'

const route = useRoute()
const router = useRouter()

const { goal, isLoading, progress, numericKRs, booleanKRs, load, addKR, editKR } = useGoalDetail()
const { filtered: historyEntries, filter: histFilter, load: loadHistory } = useHistory()

const activeTab = ref('overview')
const showModal = ref(false)

async function handleToggleKD(kd) {
  await editKR(kd.id, { done: !kd.done })
}

async function handleSaveKR(data) {
  await addKR(data)
  showModal.value = false
}

async function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'history') await loadHistory(route.params.id)
}

onMounted(() => load(route.params.id))
</script>

<template>
  <div class="page-content">
    <div class="page-inner" style="max-width: 820px; position: relative;">

      <!-- Back -->
      <button class="btn btn-quiet btn-sm" style="margin-bottom: 22px; margin-left: -8px;" @click="router.push('/')">
        <AppIcon name="arrow-left" :size="14" /> All goals
      </button>

      <div v-if="isLoading" style="color: var(--ink-4); padding: 40px 0;">Loading…</div>

      <template v-else-if="goal">
        <!-- Title block -->
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span class="badge badge-purple">{{ goal.quarter }} · {{ goal.year }}</span>
          <StatusBadge :status="goal.status" />
          <div style="flex: 1;" />
          <RouterLink :to="`/goal/${goal.id}/edit`" class="btn btn-quiet btn-sm">
            <AppIcon name="edit" :size="13" />
          </RouterLink>
        </div>
        <h1 style="font-size: 26px; font-weight: 500; letter-spacing: -0.02em; margin-bottom: 22px; max-width: 640px;">
          {{ goal.title }}
        </h1>

        <!-- Overall progress card -->
        <div class="card" style="padding: 22px 26px; margin-bottom: 28px;">
          <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px;">
            <div>
              <div style="font-size: 12px; color: var(--ink-3); margin-bottom: 4px;">Overall progress</div>
              <div class="num" style="font-size: 32px; font-weight: 500; letter-spacing: -0.02em; line-height: 1;">
                {{ progress }}<span style="color: var(--ink-4); font-size: 20px;">%</span>
              </div>
            </div>
            <RouterLink :to="`/checkin/${goal.id}`" class="btn btn-primary btn-sm">
              <AppIcon name="plus" :size="13" :stroke="2" /> Check-in
            </RouterLink>
          </div>
          <ProgressBar :value="progress" thick />
        </div>

        <!-- Tabs -->
        <div style="display: flex; gap: 24px; border-bottom: 1px solid var(--line); margin-bottom: 24px;">
          <button
            v-for="[key, label] in [['overview', 'Overview'], ['history', 'History']]"
            :key="key"
            style="padding: 10px 0; font-size: 13px; font-weight: 500; margin-bottom: -1px; border-bottom: 2px solid transparent; transition: color .12s, border-color .12s;"
            :style="{
              color: activeTab === key ? 'var(--ink-1)' : 'var(--ink-3)',
              borderBottomColor: activeTab === key ? 'var(--purple-500)' : 'transparent',
            }"
            @click="switchTab(key)"
          >
            {{ label }}
          </button>
        </div>

        <!-- Overview tab -->
        <template v-if="activeTab === 'overview'">
          <!-- Key Results -->
          <div style="margin-bottom: 28px;">
            <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
              <h2 style="font-size: 13px; font-weight: 500; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.05em;">
                Key Results
              </h2>
              <span style="font-size: 12px; color: var(--ink-4);">{{ numericKRs.length }} numeric</span>
            </div>
            <div class="card" style="overflow: hidden;">
              <KRItem v-for="kr in numericKRs" :key="kr.id" :kr="kr" />
              <div style="padding: 14px; border-top: 1px solid var(--line);">
                <button class="btn btn-quiet btn-sm" style="color: var(--purple-600);" @click="showModal = true">
                  <AppIcon name="plus" :size="13" :stroke="2" /> Add KR
                </button>
              </div>
            </div>
          </div>

          <!-- Key Deliverables -->
          <div>
            <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
              <h2 style="font-size: 13px; font-weight: 500; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.05em;">
                Key Deliverables
              </h2>
              <span style="font-size: 12px; color: var(--ink-4);">
                {{ booleanKRs.filter(k => k.done).length }} of {{ booleanKRs.length }} done
              </span>
            </div>
            <div class="card" style="overflow: hidden;">
              <KDItem
                v-for="kd in booleanKRs"
                :key="kd.id"
                :kd="kd"
                @toggle="handleToggleKD"
              />
              <div style="padding: 14px; border-top: 1px solid var(--line);">
                <button class="btn btn-quiet btn-sm" style="color: var(--purple-600);" @click="showModal = true">
                  <AppIcon name="plus" :size="13" :stroke="2" /> Add KD
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- History tab -->
        <template v-if="activeTab === 'history'">
          <HistoryTimeline :entries="historyEntries" />
        </template>
      </template>
    </div>
  </div>

  <!-- KR/KD modal -->
  <KRModal
    v-if="showModal"
    :goal-id="route.params.id"
    @save="handleSaveKR"
    @close="showModal = false"
  />
</template>
