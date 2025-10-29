import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(true)
  let authListener = null  // 添加认证监听器引用

  // 设置用户信息
  const setUser = async (userData) => {
    try {
      if (!userData) {
        user.value = null
        return
      }

      // 确保获取最新的用户信息
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.id)
        .single()

      if (error) throw error

      user.value = {
        ...userData,
        ...profile
      }
    } catch (error) {
      console.error('设置用户信息错误:', error.message)
      throw error
    }
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
  }

  // 检查是否是超级管理员
  const isAdmin = () => {
    return user.value?.role === 'admin'
  }

  // 初始化用户会话
  const initializeUser = async () => {
    try {
      loading.value = true
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      if (session) {
        await setUser(session.user)
      } else {
        clearUser()
      }

      // 清除之前的监听器
      if (authListener) {
        authListener.subscription.unsubscribe()
      }

      // 设置新的监听器
      authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          loading.value = true
          try {
            await setUser(session.user)
          } finally {
            loading.value = false
          }
        } else if (event === 'SIGNED_OUT') {
          clearUser()
        }
      })

    } catch (error) {
      console.error('初始化用户错误:', error.message)
      clearUser()
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      clearUser()
    } catch (error) {
      console.error('登出错误:', error.message)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    setUser,
    clearUser,
    isAdmin,
    initializeUser,
    logout
  }
}) 