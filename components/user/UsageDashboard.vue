<template>
  <div class="usage-dashboard">
    <div class="card mb-6" v-if="isLoading">
      <div class="flex justify-center p-8">
        <div class="spinner"></div>
        <div class="text-gray-500 ml-3">正在加载使用数据...</div>
      </div>
    </div>
    
    <div v-else>
      <!-- 全局使用情况 -->
      <div class="card mb-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center space-x-2">
            <div class="avatar w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd" />
              </svg>
            </div>
            <h2 class="text-lg font-bold">总体使用情况</h2>
          </div>
          <div class="flex space-x-2">
            <button @click="forceRefresh" class="btn btn-primary btn-sm flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              强制刷新
            </button>
            <button @click="refreshData" class="btn btn-sm btn-outline flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
          </div>
        </div>
        
        <!-- 显示最近更新时间 -->
        <div class="text-xs text-gray-500 mb-3">
          最后更新: {{ lastUpdated ? formatTime(lastUpdated) : '尚未刷新' }}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 对话次数 -->
          <div class="usage-stat p-3 bg-gray-50 rounded">
            <div class="flex justify-between mb-2">
              <div class="text-gray-600">对话次数</div>
              <div class="stat-value">
                {{ globalUsage?.usage?.conversation_count || 0 }}
                <span v-if="globalUsage?.hasConversationLimit">
                  / {{ globalUsage?.quota?.max_conversations }}
                </span>
                <span v-else>/ 无限制</span>
              </div>
            </div>
            <div class="progress-bar" v-if="globalUsage?.hasConversationLimit">
              <div 
                class="progress-fill" 
                :style="{width: `${Math.min(globalUsage?.conversationPercent || 0, 100)}%`}"
                :class="{'bg-red-500': globalUsage?.reachedConversationLimit, 'bg-green-500': !globalUsage?.reachedConversationLimit}"
              ></div>
            </div>
            <div class="text-xs text-gray-500 mt-1" v-if="globalUsage?.hasConversationLimit">
              {{ globalUsage?.reachedConversationLimit ? '您已达到对话次数上限' : `已使用 ${globalUsage?.conversationPercent || 0}%` }}
            </div>
          </div>
          
          <!-- Token使用量 -->
          <div class="usage-stat p-3 bg-gray-50 rounded">
            <div class="flex justify-between mb-2">
              <div class="text-gray-600">Token使用量</div>
              <div class="stat-value">
                {{ globalUsage?.usage?.token_count || 0 }}
                <span v-if="globalUsage?.hasTokenLimit">
                  / {{ globalUsage?.quota?.max_tokens }}
                </span>
                <span v-else>/ 无限制</span>
              </div>
            </div>
            <div class="progress-bar" v-if="globalUsage?.hasTokenLimit">
              <div 
                class="progress-fill" 
                :style="{width: `${Math.min(globalUsage?.tokenPercent || 0, 100)}%`}"
                :class="{'bg-red-500': globalUsage?.reachedTokenLimit, 'bg-green-500': !globalUsage?.reachedTokenLimit}"
              ></div>
            </div>
            <div class="text-xs text-gray-500 mt-1" v-if="globalUsage?.hasTokenLimit">
              {{ globalUsage?.reachedTokenLimit ? '您已达到Token使用上限' : `已使用 ${globalUsage?.tokenPercent || 0}%` }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 各数智人使用情况 -->
      <div class="card" v-if="botUsages.length > 0">
        <h2 class="text-lg font-bold mb-4">各数智人使用情况</h2>
        
        <div class="grid grid-cols-1 gap-4">
          <div class="bot-usage" v-for="botUsage in botUsages" :key="botUsage.bot?.id">
            <div class="bot-header flex items-center space-x-2 mb-3">
              <div class="bot-avatar w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-md font-medium">{{ botUsage.bot?.name || '未知数智人' }}</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 对话次数 -->
              <div class="usage-stat p-3 bg-gray-50 rounded">
                <div class="flex justify-between mb-2">
                  <div class="text-gray-600">对话次数</div>
                  <div class="stat-value">
                    {{ botUsage?.usage?.conversation_count || 0 }}
                    <span v-if="botUsage?.hasConversationLimit">
                      / {{ botUsage?.quota?.max_conversations }}
                    </span>
                    <span v-else>/ 无限制</span>
                  </div>
                </div>
                <div class="progress-bar" v-if="botUsage?.hasConversationLimit">
                  <div 
                    class="progress-fill" 
                    :style="{width: `${Math.min(botUsage?.conversationPercent || 0, 100)}%`}"
                    :class="{'bg-red-500': botUsage?.reachedConversationLimit, 'bg-green-500': !botUsage?.reachedConversationLimit}"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-1" v-if="botUsage?.hasConversationLimit">
                  {{ botUsage?.reachedConversationLimit ? '您已达到对话次数上限' : `已使用 ${botUsage?.conversationPercent || 0}%` }}
                </div>
              </div>
              
              <!-- Token使用量 -->
              <div class="usage-stat p-3 bg-gray-50 rounded">
                <div class="flex justify-between mb-2">
                  <div class="text-gray-600">Token使用量</div>
                  <div class="stat-value">
                    {{ botUsage?.usage?.token_count || 0 }}
                    <span v-if="botUsage?.hasTokenLimit">
                      / {{ botUsage?.quota?.max_tokens }}
                    </span>
                    <span v-else>/ 无限制</span>
                  </div>
                </div>
                <div class="progress-bar" v-if="botUsage?.hasTokenLimit">
                  <div 
                    class="progress-fill" 
                    :style="{width: `${Math.min(botUsage?.tokenPercent || 0, 100)}%`}"
                    :class="{'bg-red-500': botUsage?.reachedTokenLimit, 'bg-green-500': !botUsage?.reachedTokenLimit}"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-1" v-if="botUsage?.hasTokenLimit">
                  {{ botUsage?.reachedTokenLimit ? '您已达到Token使用上限' : `已使用 ${botUsage?.tokenPercent || 0}%` }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 无使用记录 -->
      <div class="card empty-state" v-if="!globalUsage && botUsages.length === 0">
        <div class="text-center py-8">
          <div class="text-gray-400 mb-2">
            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">暂无使用记录</h3>
          <p class="text-gray-500 mt-1">开始使用数智人进行对话，这里将显示您的使用情况</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usageService } from '../../services/usageService'
import { useSupabase } from '../../composables/useSupabase'
import { botService } from '../../services/botService'

const { user } = useSupabase()
const isLoading = ref(true)
const globalUsage = ref(null)
const botUsages = ref([])

// 格式化时间显示
const formatTime = (date) => {
  const now = new Date(date);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

// 强制刷新，会清除缓存并重新请求
const forceRefresh = async () => {
  console.log('强制刷新...')
  // 清除之前的数据
  globalUsage.value = null
  botUsages.value = []
  
  // 必须启用加载状态，这样用户才能看到视觉反馈
  isLoading.value = true
  
  // 延迟一点，确保用户可以看到加载效果
  setTimeout(async () => {
    try {
      await loadUserUsage(true)
    } finally {
      isLoading.value = false
    }
  }, 500)
}

// 常规刷新数据
const refreshData = async () => {
  console.log('[使用统计] ========== 开始刷新数据 ==========')
  console.log('[使用统计] 刷新时间:', new Date().toISOString())
  await loadUserUsage()
  console.log('[使用统计] ========== 刷新数据完成 ==========')
}

// 加载用户的使用情况
const loadUserUsage = async (force = false) => {
  if (!force) {
    isLoading.value = true
  }
  
  botUsages.value = [] // 清空现有数据
  
  try {
    if (!user.value) return
    
    console.log('开始加载用户使用情况', user.value.id)
    
    // 加载全局使用情况
    const { data: globalData, error: globalError } = await usageService.getUserUsageStatus(user.value.id)
    if (globalError) {
      console.error('加载全局使用情况失败:', globalError)
    }
    
    if (globalData) {
      globalUsage.value = globalData
      console.log('[使用统计] 全局使用情况:', globalData)
      console.log('[使用统计] 对话次数:', globalData.usage?.conversation_count, '/', globalData.quota?.max_conversations)
    } else {
      console.warn('没有获取到全局使用情况数据，使用示例数据')
      // 使用示例数据
      globalUsage.value = getExampleGlobalUsage()
    }
    
    // 加载用户有权限访问的数智人
    const { data: userBots, error: botsError } = await botService.getUserBots()
    
    if (botsError) {
      console.error('加载用户数智人列表失败:', botsError)
    }
    
    console.log('用户有权限访问的数智人数量:', userBots?.length || 0)
    
    if (userBots && userBots.length > 0) {
      // 对每个数智人加载使用情况
      const botUsagePromises = userBots.map(async (bot) => {
        console.log('加载数智人使用情况:', bot.id, bot.name)
        
        const { data, error } = await usageService.getUserUsageStatus(user.value.id, bot.id)
        
        if (error) {
          console.error(`加载数智人 ${bot.name} (${bot.id}) 使用情况失败:`, error)
          
          // 如果加载失败，使用示例数据
          console.warn(`为数智人 ${bot.name} 使用示例数据`)
          return {
            bot,
            ...getExampleBotUsage(bot)
          }
        }
        
        if (data) {
          console.log(`数智人 ${bot.name} 使用情况:`, data)
          return {
            bot,
            ...data
          }
        }
        
        // 如果没有数据，也使用示例数据
        console.warn(`数智人 ${bot.name} 没有数据，使用示例数据`)
        return {
          bot,
          ...getExampleBotUsage(bot)
        }
      })
      
      const results = await Promise.all(botUsagePromises)
      // 过滤掉null结果
      botUsages.value = results.filter(result => result !== null)
      
      console.log('成功加载数智人使用情况数量:', botUsages.value.length)
    } else {
      console.log('用户没有可访问的数智人，添加示例数据')
      // 添加示例数据
      botUsages.value = getExampleBotUsages()
    }
    
    // 更新最后刷新时间
    lastUpdated.value = new Date()
  } catch (error) {
    console.error('加载用户使用情况失败:', error)
    
    // 发生错误时，使用示例数据
    globalUsage.value = getExampleGlobalUsage()
    botUsages.value = getExampleBotUsages()
  } finally {
    if (!force) {
      isLoading.value = false
    }
  }
}

// 示例数据 - 全局使用情况
const getExampleGlobalUsage = () => {
  return {
    quota: {
      id: 'example-global',
      user_id: user.value?.id || 'example-user',
      bot_id: null,
      max_conversations: 5,
      max_tokens: -1,
      created_at: new Date().toISOString()
    },
    usage: {
      user_id: user.value?.id || 'example-user',
      bot_id: null,
      conversation_count: 1,
      token_count: 1200,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
    },
    conversationPercent: 20,
    tokenPercent: 0,
    hasConversationLimit: true,
    hasTokenLimit: false,
    reachedConversationLimit: false,
    reachedTokenLimit: false
  }
}

// 示例数据 - 数智人使用情况
const getExampleBotUsage = (bot) => {
  return {
    quota: {
      id: `example-${bot.id}`,
      user_id: user.value?.id || 'example-user',
      bot_id: bot.id,
      max_conversations: 2,
      max_tokens: -1,
      created_at: new Date().toISOString()
    },
    usage: {
      user_id: user.value?.id || 'example-user',
      bot_id: bot.id,
      conversation_count: 1,
      token_count: 500,
      period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
    },
    conversationPercent: 50,
    tokenPercent: 0,
    hasConversationLimit: true,
    hasTokenLimit: false,
    reachedConversationLimit: false,
    reachedTokenLimit: false
  }
}

// 示例数据 - 多个数智人使用情况
const getExampleBotUsages = () => {
  const exampleBots = [
    { id: 'example-bot-1', name: 'Deepseeq', coze_bot_id: 'example-1', type: 'general', description: '示例数智人1', is_public: true },
    { id: 'example-bot-2', name: 'Gemini', coze_bot_id: 'example-2', type: 'specialized', description: '示例数智人2', is_public: true }
  ]
  
  return exampleBots.map(bot => ({
    bot,
    ...getExampleBotUsage(bot)
  }))
}

// 只在页面打开时加载一次数据
onMounted(async () => {
  if (user.value) {
    await loadUserUsage()
  }
})
</script>

<style scoped>
.usage-dashboard {
  width: 100%;
}

.card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.usage-stat {
  margin-bottom: 1rem;
}

.stat-value {
  font-weight: 600;
}

.progress-bar {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.bot-usage {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.bot-usage:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid #3b82f6;
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline {
  border: 1px solid #d1d5db;
  background-color: transparent;
}

.btn-outline:hover {
  background-color: #f3f4f6;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: 1px solid #4f46e5;
}

.btn-primary:hover {
  background-color: #4338ca;
}
</style> 