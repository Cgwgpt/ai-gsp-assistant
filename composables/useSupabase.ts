import { ref } from 'vue'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase.js'

// 模拟Supabase客户端
// 在实际项目中，这里应该使用真实的Supabase客户端
// 例如：import { createClient } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
}

// 用户状态
let initialized = false
const user = ref<User | null>(null)

// 初始化函数
async function initialize() {
  if (initialized) return
  
  try {
    // 获取当前用户
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      user.value = {
        id: data.user.id,
        email: data.user.email || ''
      }
    }
    
    // 设置认证状态监听
    supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        user.value = {
          id: session.user.id,
          email: session.user.email || ''
        }
      } else {
        user.value = null
      }
    })
  } catch (error) {
    console.error('初始化Supabase认证失败:', error)
    // 即使初始化失败，也不影响后续使用
  }
  
  initialized = true
}

// 确保只初始化一次
initialize()

export function useSupabase() {
  // 登录函数
  const login = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  }
  
  // 注册函数
  const register = async (email: string, password: string, userData = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
  }

  // 登出函数
  const logout = async () => {
    return await supabase.auth.signOut()
  }
  
  // 获取用户
  const getUser = async () => {
    return await supabase.auth.getUser()
  }

  return {
    supabase,
    user,
    login,
    register,
    logout,
    getUser
  }
} 