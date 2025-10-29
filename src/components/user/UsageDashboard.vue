<template>
  <div class="usage-dashboard">
    <div class="card mb-6" v-if="isLoading">
      <div class="flex justify-center p-8">
        <div class="spinner"></div>
      </div>
    </div>
    
    <div v-else>
      <!-- 全局使用情况 -->
      <div class="card mb-6">
        <h2 class="text-lg font-bold mb-4">总体使用情况</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 对话次数 -->
          <div class="usage-stat">
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
                :class="{'bg-red-500': globalUsage?.reachedConversationLimit}"
              ></div>
            </div>
            <div class="text-xs text-gray-500 mt-1" v-if="globalUsage?.hasConversationLimit">
              {{ globalUsage?.reachedConversationLimit ? '您已达到对话次数上限' : `已使用 ${globalUsage?.conversationPercent || 0}%` }}
            </div>
          </div>
          
          <!-- Token使用量 -->
          <div class="usage-stat">
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
                :class="{'bg-red-500': globalUsage?.reachedTokenLimit}"
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
            <h3 class="text-md font-medium mb-2">{{ botUsage.bot?.name || '未知数智人' }}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 对话次数 -->
              <div class="usage-stat">
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
                    :class="{'bg-red-500': botUsage?.reachedConversationLimit}"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-1" v-if="botUsage?.hasConversationLimit">
                  {{ botUsage?.reachedConversationLimit ? '您已达到对话次数上限' : `已使用 ${botUsage?.conversationPercent || 0}%` }}
                </div>
              </div>
              
              <!-- Token使用量 -->
              <div class="usage-stat">
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
                    :class="{'bg-red-500': botUsage?.reachedTokenLimit}"
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
import { usageService } from '../../../services/usageService'
import { useSupabase } from '../../../composables/useSupabase'
import { botService } from '../../../services/botService'

const { user } = useSupabase()
const isLoading = ref(true)
const globalUsage = ref(null)
const botUsages = ref([])

// 加载用户的使用情况
const loadUserUsage = async () => {
  isLoading.value = true
  
  try {
    if (!user.value) return
    
    // 加载全局使用情况
    const { data: globalData } = await usageService.getUserUsageStatus(user.value.id)
    if (globalData) {
      globalUsage.value = globalData
    }
    
    // 加载用户有权限访问的数智人
    const { data: userBots } = await botService.getUserBots()
    
    if (userBots && userBots.length > 0) {
      // 对每个数智人加载使用情况
      const botUsagePromises = userBots.map(async (bot) => {
        const { data } = await usageService.getUserUsageStatus(user.value.id, bot.id)
        return {
          bot,
          ...data
        }
      })
      
      botUsages.value = await Promise.all(botUsagePromises)
    }
  } catch (error) {
    console.error('加载用户使用情况失败:', error)
  } finally {
    isLoading.value = false
  }
}

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
</style> 