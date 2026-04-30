import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

import Dashboard from './views/Dashboard.vue'
import GoalDetail from './views/GoalDetail.vue'
import GoalForm from './views/GoalForm.vue'
import CheckIn from './views/CheckIn.vue'
import WeeklyReview from './views/WeeklyReview.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',                  component: Dashboard },
    { path: '/goal/new',          component: GoalForm },
    { path: '/goal/:id',          component: GoalDetail },
    { path: '/goal/:id/edit',     component: GoalForm },
    { path: '/checkin/:goalId',   component: CheckIn },
    { path: '/review/:goalId',    component: WeeklyReview },
  ],
})

createApp(App).use(router).mount('#app')
