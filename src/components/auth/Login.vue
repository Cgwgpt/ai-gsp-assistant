<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <div class="flex justify-center mb-6">
      <img src="/images/logo-final.svg" alt="药品质量管理AI赋能系统" class="h-16" />
    </div>
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">用户登录</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">邮箱</label>
        <input
          v-model="form.email"
          type="email"
          required
          :disabled="isLoading"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">密码</label>
        <input
          v-model="form.password"
          type="password"
          required
          :disabled="isLoading"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div v-if="errorMessage" class="text-red-500 text-sm">
        {{ errorMessage }}
      </div>

      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-800 hover:from-purple-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70"
        >
          <span v-if="isLoading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const isLoading = ref(false)
const errorMessage = ref('')

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    if (isLoading.value) return  // 防止重复提交
    
    isLoading.value = true
    errorMessage.value = ''

    // 登录验证
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
    })

    if (error) throw error

    // 等待用户状态更新完成
    await userStore.setUser(data.user)
    
    // 登录成功后跳转到首页
    router.push('/')
  } catch (error) {
    console.error('登录错误:', error.message)
    if (error.message.includes('Invalid login credentials')) {
      errorMessage.value = '邮箱或密码错误'
    } else {
      errorMessage.value = '登录失败，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}
</script> 