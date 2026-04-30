import { ref, computed } from 'vue'
import { pb } from '../api/pocketbase.js'

const isAuthenticated = computed(() => pb.authStore.isValid)
const currentUser = computed(() => pb.authStore.model)
const authError = ref(null)
const isLoading = ref(false)

async function login(email, password) {
  isLoading.value = true
  authError.value = null
  try {
    await pb.collection('users').authWithPassword(email, password)
  } catch (e) {
    authError.value = 'Invalid email or password.'
    throw e
  } finally {
    isLoading.value = false
  }
}

function logout() {
  pb.authStore.clear()
}

export function useAuth() {
  return { isAuthenticated, currentUser, authError, isLoading, login, logout }
}
