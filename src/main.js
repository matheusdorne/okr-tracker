import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'
import { pb } from './api/pocketbase.js'

import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import GoalDetail from './views/GoalDetail.vue'
import GoalForm from './views/GoalForm.vue'
import CheckIn from './views/CheckIn.vue'
import WeeklyReview from './views/WeeklyReview.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login, meta: { public: true } },
    { path: '/',                component: Dashboard },
    { path: '/goal/new',        component: GoalForm },
    { path: '/goal/:id',        component: GoalDetail },
    { path: '/goal/:id/edit',   component: GoalForm },
    { path: '/checkin/:goalId', component: CheckIn },
    { path: '/review/:goalId',  component: WeeklyReview },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = pb.authStore.isValid
  if (!isAuthenticated && !to.meta.public) return '/login'
  if (isAuthenticated && to.path === '/login') return '/'
})

createApp(App).use(router).mount('#app')
