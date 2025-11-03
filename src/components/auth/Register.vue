<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">用户注册</h2>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">用户名</label>
        <input
          v-model="form.username"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">手机号</label>
        <input
          v-model="form.phone"
          type="tel"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">邮箱</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">单位名称</label>
        <input
          v-model="form.organization"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">密码</label>
        <input
          v-model="form.password"
          type="password"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          注册
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'
import { usageService } from '~/services/usageService'
import { authorizationService } from '~/services/authorizationService'

const router = useRouter()
const form = ref({
  username: '',
  phone: '',
  email: '',
  organization: '',
  password: ''
})

const handleRegister = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          username: form.value.username,
          phone: form.value.phone,
          organization: form.value.organization,
          role: 'user' // 默认用户角色
        }
      }
    })

    if (error) throw error

    // 如果注册成功且有用户ID，初始化用户配额和授权
    if (data?.user?.id) {
      const userId = data.user.id
      
      try {
        // 1. 创建默认配额记录（对话次数限制5次，Token无限制）
        const quotaResult = await usageService.setUserQuota({
          user_id: userId,
          bot_id: null, // 全局配额
          max_conversations: 5, // 对话次数限制5次
          max_tokens: -1 // Token无限制
        })
        
        if (quotaResult.error) {
          console.error('创建用户配额失败:', quotaResult.error)
        } else {
          console.log('成功创建用户默认配额，对话次数限制5次')
        }
        
        // 2. 获取所有数智人并授权给新用户
        const { data: allBots, error: botsError } = await supabase
          .from('bots')
          .select('id')
        
        if (botsError) {
          console.error('获取数智人列表失败:', botsError)
        } else if (allBots && allBots.length > 0) {
          // 批量授权所有数智人给新用户
          const authPromises = allBots.map(bot => 
            authorizationService.authorizeUserBot(userId, bot.id)
          )
          
          const authResults = await Promise.allSettled(authPromises)
          
          // 统计授权结果
          const successCount = authResults.filter(r => r.status === 'fulfilled').length
          const failCount = authResults.filter(r => r.status === 'rejected').length
          
          console.log(`数智人授权完成: 成功 ${successCount} 个，失败 ${failCount} 个`)
          
          if (failCount > 0) {
            console.warn('部分数智人授权失败，但注册已成功')
          }
        } else {
          console.log('当前没有数智人，跳过授权步骤')
        }
      } catch (initError) {
        // 初始化配额和授权失败不应该阻止注册流程
        console.error('初始化用户配额或授权时出错:', initError)
        console.log('用户注册成功，但配额和授权初始化可能未完成')
      }
    }

    // 注册成功后跳转到登录页
    router.push('/auth/login')
  } catch (error) {
    console.error('注册错误:', error.message)
    alert('注册失败: ' + error.message)
  }
}
</script> 