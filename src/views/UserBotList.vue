<template>
  <div>
    <!-- 导航栏 -->
    <TheNavbar />
    
    <div class="pt-16 min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
        <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div class="flex justify-between items-center">
            <h1 class="text-white text-2xl font-medium">我的数智人</h1>
            <div class="flex items-center gap-4">
              <span class="text-white text-sm md:text-base">已授权数智人列表</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white rounded-lg shadow p-6">
          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-r">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <p>{{ errorMessage }}</p>
            </div>
          </div>
          
          <!-- 加载状态 -->
          <div v-if="isLoading" class="flex justify-center py-12">
            <div class="loader"></div>
            <span class="ml-3 text-gray-600">加载中...</span>
          </div>
          
          <!-- 无授权数据提示 -->
          <div v-else-if="botList.length === 0" class="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-600">暂无授权数智人</h3>
            <p class="mt-2 text-gray-500">您目前没有被授权使用的数智人，请联系管理员获取授权。</p>
          </div>
          
          <!-- 数智人列表 -->
          <div v-else>
            <!-- 筛选工具 -->
            <div class="mb-6 flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="搜索数智人..." 
                class="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              
              <div class="flex-grow"></div>
              
              <select 
                v-model="sortBy" 
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="name">按名称</option>
                <option value="type">按类型</option>
                <option value="created_at">按授权时间</option>
              </select>
            </div>
            
            <!-- 空状态 -->
            <div v-if="filteredBots.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
              <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-700 mb-1">没有找到数智人</h3>
              <p class="text-gray-500 max-w-md">
                {{ searchQuery ? '没有找到符合搜索条件的数智人，请尝试其他关键词' : '您尚未被授权使用任何数智人，请联系管理员' }}
              </p>
            </div>
            
            <!-- 数智人卡片网格 -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="bot in filteredBots" 
                :key="bot.id" 
                class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div class="bg-gradient-to-r from-blue-400 to-blue-500 px-4 py-3">
                  <h3 class="text-white font-medium truncate">{{ bot.name }}</h3>
                </div>
                
                <div class="p-5">
                  <div class="flex justify-between mb-3">
                    <span class="text-sm text-gray-600">类型:</span>
                    <span class="text-sm font-medium">{{ formatBotType(bot.type) }}</span>
                  </div>
                  
                  <div class="flex justify-between mb-3">
                    <span class="text-sm text-gray-600">授权时间:</span>
                    <span class="text-sm">{{ formatDate(bot.authorization_created_at) }}</span>
                  </div>
                  
                  <div class="mb-4">
                    <p class="text-sm text-gray-600 line-clamp-2">{{ bot.description || '无描述' }}</p>
                  </div>
                  
                  <div class="mt-5 flex justify-end">
                    <button 
                      @click="useBot(bot)" 
                      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                    >
                      开始对话
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabase } from '../../composables/useSupabase'
import { botService } from '../../services/botService'
import TheNavbar from '../components/TheNavbar.vue'

// 状态
const isLoading = ref(false)
const errorMessage = ref('')
const botList = ref([])
const searchQuery = ref('')
const sortBy = ref('name')

// 路由
const router = useRouter()

// 获取 Supabase 实例
const { supabase, user } = useSupabase()

// 过滤和排序数智人列表
const filteredBots = computed(() => {
  let filtered = [...botList.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(bot => {
      const botName = (bot.name || '').toLowerCase()
      const botDescription = (bot.description || '').toLowerCase()
      const botType = (bot.type || '').toLowerCase()
      return botName.includes(query) || botDescription.includes(query) || botType.includes(query)
    })
  }
  
  // 排序
  filtered.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy.value === 'type') {
      return (a.type || '').localeCompare(b.type || '')
    } else {
      // 按授权时间降序排序
      return new Date(b.authorization_created_at) - new Date(a.authorization_created_at)
    }
  })
  
  return filtered
})

// 格式化数智人类型
const formatBotType = (type) => {
  if (!type) return '通用'
  
  const typeMap = {
    'general': '通用',
    'specialized': '专业',
    'custom': '自定义'
  }
  
  return typeMap[type] || type
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 使用数智人
const useBot = (bot) => {
  // 添加调试输出，检查bot对象结构
  console.log('使用数智人:', bot)
  
  // 这里应跳转到聊天页面，传递数智人信息
  // 根据实际项目路由配置进行修改
  router.push({
    path: '/chat',
    query: { bot_id: bot.coze_bot_id }
  })
}

// 加载用户授权的数智人列表
const loadUserBots = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 确保用户已登录
    if (!user.value?.id) {
      errorMessage.value = '请先登录'
      return
    }
    
    const { data, error } = await botService.getBots(true) // 传入 true 表示只获取用户授权的数智人
    
    if (error) {
      throw new Error('获取数智人列表失败: ' + error.message)
    }
    
    botList.value = data || []
  } catch (error) {
    console.error('加载数智人列表失败:', error)
    errorMessage.value = error.message || '加载数智人列表失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserBots()
})
</script>

<style scoped>
.loader {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  background: linear-gradient(0deg, rgba(63, 120, 255, 0.2) 33%, rgba(63, 120, 255, 1) 100%);
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.loader::after {
  content: '';  
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
}

@keyframes rotation {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 增加额外样式优化视觉体验 */
:root {
  color-scheme: light;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #374151;
  background-color: #f9fafb;
}
</style> 