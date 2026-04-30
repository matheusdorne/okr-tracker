<script setup>
import { useRouter, useRoute } from 'vue-router'
import AppNav from './components/AppNav.vue'

const router = useRouter()
const route = useRoute()
</script>

<template>
  <AppNav />
  <RouterView />
</template>
