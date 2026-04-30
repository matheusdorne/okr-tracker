<script setup>
import { useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'

const route = useRoute()
</script>

<template>
  <nav class="nav">
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
      <div class="avatar">MK</div>
    </div>
  </nav>
</template>
