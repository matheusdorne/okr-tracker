<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import AppIcon from './AppIcon.vue'

const router = useRouter()
const { isAuthenticated, currentUser, logout } = useAuth()

const initials = computed(() => {
  const email = currentUser.value?.email ?? ''
  return email.slice(0, 2).toUpperCase()
})

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <nav class="nav" v-if="isAuthenticated">
    <div class="nav-left">
      <RouterLink to="/" class="logo">
        <div class="logo-mark">O</div>
        <span>OKRTracker</span>
      </RouterLink>
      <div class="nav-links">
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/checkin/all">Check-in</RouterLink>
        <RouterLink to="/review/all">Review</RouterLink>
      </div>
    </div>
    <div class="nav-right">
      <RouterLink to="/goal/new" class="btn btn-primary btn-sm">
        <AppIcon name="plus" :size="14" :stroke="2" />
        New goal
      </RouterLink>
      <button class="btn btn-quiet btn-sm" title="Sign out" @click="handleLogout">
        <AppIcon name="x" :size="14" />
      </button>
      <div class="avatar">{{ initials }}</div>
    </div>
  </nav>
</template>
