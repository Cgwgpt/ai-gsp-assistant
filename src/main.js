import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import App from './App.vue'
import './assets/main.css'

import okLandingPage from './okLandingPage.vue'
import AiDemo from './views/AiDemo.vue'
import GspTerms from './views/GspTerms.vue'
import GspCheckItemsApp from './gspCheckItemsApp.vue'
import Features from './views/Features.vue'
import Blog from './views/Blog.vue'
import Support from './views/Support.vue'
import Register from './components/auth/Register.vue'
import Login from './components/auth/Login.vue'
import ResetPassword from './components/auth/ResetPassword.vue'
import UserManagement from './components/admin/UserManagement.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import BotSelector from './views/BotSelector.vue'
import BotManagement from './views/BotManagement.vue'
import BotAuthorizationManagement from './views/BotAuthorizationManagement.vue'
import UserBotList from './views/UserBotList.vue'
import Chat from './views/Chat.vue'
import AdminUsage from './views/admin/usage.vue'
import UserUsage from './views/usage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 公开页面 - 首页
    { path: '/', component: okLandingPage },
    
    // 需要登录的页面
    { 
      path: '/ai-demo', 
      component: AiDemo,
      meta: { requiresAuth: true, botType: 'gsp' } // 标记为GSP报告数智人
    },
    { 
      path: '/gsp', 
      component: GspTerms,
      meta: { requiresAuth: true } // 需要登录
    },
    { 
      path: '/gsp-check', 
      component: GspCheckItemsApp,
      meta: { requiresAuth: true } // 需要登录
    },
    { 
      path: '/features', 
      component: Features,
      meta: { requiresAuth: true } // 需要登录
    },
    { 
      path: '/blog', 
      component: Blog,
      meta: { requiresAuth: true } // 需要登录
    },
    { 
      path: '/support', 
      component: Support,
      meta: { requiresAuth: true } // 需要登录
    },
    { 
      path: '/chat', 
      component: Chat,
      meta: { requiresAuth: true } // 标记为需要用户登录
    },
    { 
      path: '/bot-selector', 
      component: BotSelector,
      meta: { requiresAuth: true, botType: 'general' } // 标记为普通多数智人对话
    },
    { 
      path: '/bot-management', 
      component: BotManagement,
      meta: { requiresAdmin: true, botType: 'general' } // 标记为普通数智人管理
    },
    { 
      path: '/bot-authorization', 
      component: BotAuthorizationManagement,
      meta: { requiresAdmin: true } // 标记为需要管理员权限
    },
    { 
      path: '/my-bots', 
      component: UserBotList,
      meta: { requiresAuth: true } // 标记为需要用户登录
    },
    { 
      path: '/usage', 
      component: UserUsage,
      meta: { requiresAuth: true } // 标记为需要用户登录
    },
    { 
      path: '/admin/usage', 
      component: AdminUsage,
      meta: { requiresAdmin: true } // 标记为需要管理员权限
    },
    
    // 认证相关页面 - 公开
    { 
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'register', component: Register },
        { path: 'login', component: Login },
        { path: 'reset-password', component: ResetPassword, meta: { requiresAuth: true } }
      ]
    },
    
    // 管理员页面
    { 
      path: '/admin/users', 
      component: UserManagement,
      meta: { requiresAdmin: true } // 需要管理员权限
    }
  ]
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin) {
    // 如果用户未登录，重定向到登录页
    if (!userStore.user) {
      alert('请先登录')
      next('/auth/login')
      return
    }
    
    // 如果用户不是管理员，重定向到首页
    if (!userStore.isAdmin()) {
      alert('只有管理员才能访问此页面')
      next('/')
      return
    }
  }
  
  // 检查是否需要用户登录（包含requiresAdmin的页面会被上面的逻辑处理）
  if (to.meta.requiresAuth && !userStore.user) {
    alert('请先登录后使用此功能')
    next('/auth/login')
    return
  }
  
  // 根据路由的meta.botType设置正确的botType
  if (to.meta.botType) {
    const { useChatStore, useGspChatStore } = await import('./stores/chat')
    if (to.meta.botType === 'gsp') {
      const gspChatStore = useGspChatStore()
      gspChatStore.botType = 'gsp'
    } else if (to.meta.botType === 'general') {
      const chatStore = useChatStore()
      chatStore.setBotType('general')
    }
  }
  
  next()
})

app.use(router)
app.mount('#app') 