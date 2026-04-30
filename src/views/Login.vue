<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login, authError, isLoading } = useAuth()

const form = reactive({ email: '', password: '' })

async function submit() {
  try {
    await login(form.email, form.password)
    router.push('/')
  } catch {
    // authError is set by useAuth
  }
}
</script>

<template>
  <div style="min-height: 100vh; background: var(--bg-soft); display: grid; place-items: center;">
    <div style="width: 100%; max-width: 380px; padding: 0 24px;">

      <!-- Logo -->
      <div style="display: flex; align-items: center; gap: 9px; justify-content: center; margin-bottom: 40px;">
        <div class="logo-mark" style="width: 28px; height: 28px; font-size: 13px;">O</div>
        <span style="font-size: 17px; font-weight: 600; letter-spacing: -0.01em;">OKRTracker</span>
      </div>

      <!-- Card -->
      <div class="card" style="padding: 32px;">
        <h1 style="font-size: 20px; font-weight: 500; letter-spacing: -0.015em; margin-bottom: 4px;">
          Sign in
        </h1>
        <p class="muted" style="font-size: 13px; margin-bottom: 28px;">
          Welcome back. Enter your credentials to continue.
        </p>

        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div class="field">
            <label class="label" for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              class="input"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              @keyup.enter="submit"
            />
          </div>

          <div class="field">
            <label class="label" for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              class="input"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              @keyup.enter="submit"
            />
          </div>

          <!-- Error -->
          <div
            v-if="authError"
            style="padding: 10px 14px; background: color-mix(in srgb, var(--red) 10%, transparent); border: 1px solid color-mix(in srgb, var(--red) 25%, transparent); border-radius: var(--r-md); font-size: 13px; color: var(--red);"
          >
            {{ authError }}
          </div>

          <button
            class="btn btn-primary"
            style="width: 100%; justify-content: center; height: 40px; font-size: 14px;"
            :disabled="isLoading || !form.email || !form.password"
            @click="submit"
          >
            {{ isLoading ? 'Signing in…' : 'Sign in' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
