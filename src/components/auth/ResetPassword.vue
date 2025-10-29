<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">修改密码</h2>
    <form @submit.prevent="handlePasswordChange" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">当前密码</label>
        <input
          v-model="form.currentPassword"
          type="password"
          required
          :disabled="isLoading"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">新密码</label>
        <input
          v-model="form.newPassword"
          type="password"
          required
          :disabled="isLoading"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">确认新密码</label>
        <input
          v-model="form.confirmPassword"
          type="password"
          required
          :disabled="isLoading"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div v-if="errorMessage" class="text-red-500 text-sm">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="text-green-500 text-sm">
        {{ successMessage }}
      </div>

      <div>
        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          <span v-if="isLoading">提交中...</span>
          <span v-else>修改密码</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return form.value.newPassword.length >= 6 && 
         form.value.newPassword === form.value.confirmPassword
})

const handlePasswordChange = async () => {
  try {
    if (isLoading.value) return  // 防止重复提交
    
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // 检查密码是否匹配
    if (form.value.newPassword !== form.value.confirmPassword) {
      errorMessage.value = '新密码和确认密码不匹配'
      return
    }

    // 验证当前密码
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userStore.user.email,
      password: form.value.currentPassword
    })

    if (signInError) {
      errorMessage.value = '当前密码不正确'
      return
    }

    // 更新密码
    const { error: updateError } = await supabase.auth.updateUser({
      password: form.value.newPassword
    })

    if (updateError) throw updateError

    // 清空表单
    form.value.currentPassword = ''
    form.value.newPassword = ''
    form.value.confirmPassword = ''
    
    // 显示成功消息
    successMessage.value = '密码修改成功'
  } catch (error) {
    console.error('密码修改错误:', error.message)
    errorMessage.value = '密码修改失败：' + error.message
  } finally {
    isLoading.value = false
  }
}
</script> 