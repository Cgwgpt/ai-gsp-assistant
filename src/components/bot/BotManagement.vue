<template>
  <div>
    <!-- 添加导航栏 -->
    <TheNavbar />
    
    <div class="pt-16 min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-blue-500 p-4">
        <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-white text-xl font-medium">数智人管理</h1>
            <div class="flex items-center gap-4">
              <span class="text-white">管理您的数智人配置</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-700">数智人列表</h2>
              <div class="flex gap-2">
                <button 
                  @click="loadBotList" 
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  title="刷新列表"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  刷新
                </button>
                <button 
                  @click="openAddModal" 
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  添加数智人
                </button>
              </div>
            </div>
            
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {{ errorMessage }}
            </div>
            
            <div v-if="isLoading" class="flex justify-center my-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="py-3 px-4 text-left text-gray-600 font-medium">名称</th>
                    <th class="py-3 px-4 text-left text-gray-600 font-medium">ID</th>
                    <th class="py-3 px-4 text-left text-gray-600 font-medium">API Key</th>
                    <th class="py-3 px-4 text-left text-gray-600 font-medium">类型</th>
                    <th class="py-3 px-4 text-center text-gray-600 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="bot in botList" :key="bot.id" class="border-t border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4 text-gray-800">{{ bot.name }}</td>
                    <td class="py-3 px-4 text-gray-600 font-mono text-sm">{{ bot.coze_bot_id }}</td>
                    <td class="py-3 px-4 text-gray-600 font-mono text-sm">
                      <template v-if="bot.api_key">
                        {{ bot.api_key.substring(0, 8) }}...{{ bot.api_key.substring(bot.api_key.length - 8) }}
                      </template>
                      <template v-else>
                        <span class="text-gray-400">未设置</span>
                      </template>
                    </td>
                    <td class="py-3 px-4 text-gray-600">{{ bot.type || '通用' }}</td>
                    <td class="py-3 px-4 text-center">
                      <div class="flex justify-center gap-2">
                        <button 
                          @click="editBot(bot)" 
                          class="text-blue-500 hover:text-blue-700 transition-colors"
                          title="编辑"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          @click="confirmDelete(bot)" 
                          class="text-red-500 hover:text-red-700 transition-colors"
                          title="删除"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="botList.length === 0 && !isLoading">
                    <td colspan="5" class="py-4 text-center text-gray-500">暂无数智人配置</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 添加/编辑数智人模态框 -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-[500px] shadow-xl" @click.stop>
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="text-lg font-medium">{{ isEditing ? '编辑数智人' : '添加数智人' }}</h3>
            <button class="text-gray-500 hover:text-gray-700" @click="closeModal">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-6">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">数智人名称</label>
              <input 
                type="text" 
                v-model="currentBot.name" 
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入数智人名称"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">数智人ID</label>
              <input 
                type="text" 
                v-model="currentBot.coze_bot_id" 
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="输入COZE数智人ID"
              />
              <p class="mt-1 text-sm text-gray-500">例如：7427724467013091364</p>
              <p v-if="validationErrors.id" class="mt-1 text-sm text-red-500">{{ validationErrors.id }}</p>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">API Key</label>
              <input 
                type="text" 
                v-model="currentBot.api_key" 
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入API Key"
              />
              <p class="mt-1 text-sm text-gray-500">必须以pat_开头</p>
              <p v-if="validationErrors.key" class="mt-1 text-sm text-red-500">{{ validationErrors.key }}</p>
            </div>
            
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-medium mb-2">数智人类型</label>
              <select 
                v-model="currentBot.type" 
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">通用数智人</option>
                <option value="gsp">GSP专用数智人</option>
                <option value="specialized">专业领域数智人</option>
              </select>
            </div>
            
            <div class="flex justify-end gap-3">
              <button 
                class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                @click="closeModal"
              >
                取消
              </button>
              <button 
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                @click="saveBot"
                :disabled="!isFormValid || isLoading"
              >
                <span v-if="isLoading" class="inline-block animate-spin mr-2">⟳</span>
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 删除确认模态框 -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-[400px] shadow-xl" @click.stop>
          <div class="p-6">
            <h3 class="text-lg font-medium mb-4">确认删除</h3>
            <p class="text-gray-600 mb-6">确定要删除数智人 "{{ botToDelete?.name }}" 吗？此操作无法撤销。</p>
            
            <div class="flex justify-end gap-3">
              <button 
                class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                @click="showDeleteConfirm = false"
              >
                取消
              </button>
              <button 
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                @click="deleteBot"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="inline-block animate-spin mr-2">⟳</span>
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import TheNavbar from '../TheNavbar.vue'
import { useSupabase } from '../../../composables/useSupabase'
import { botService, type Bot } from '../../../services/botService'

// 初始化Supabase
const { user } = useSupabase()

// 数智人列表
const botList = ref<Bot[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

// 模态框状态
const showModal = ref(false)
const isEditing = ref(false)
const currentBot = ref<Bot>({ coze_bot_id: '', name: '', api_key: '', type: 'general' })
const showDeleteConfirm = ref(false)
const botToDelete = ref<Bot | null>(null)

// 表单验证
const isFormValid = computed(() => {
  const validation = botService.validateBotCredentials(
    currentBot.value.coze_bot_id,
    currentBot.value.api_key
  )
  
  return currentBot.value.name.trim() !== '' && 
         validation.isValid
})

// 验证错误信息
const validationErrors = computed(() => {
  if (!currentBot.value.coze_bot_id || !currentBot.value.api_key) {
    return { id: null, key: null }
  }
  
  const validation = botService.validateBotCredentials(
    currentBot.value.coze_bot_id,
    currentBot.value.api_key
  )
  
  return validation.errors
})

// 加载数智人列表
const loadBotList = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    console.log('正在从Supabase加载数智人列表...')
    // 从Supabase加载
    const { data, error } = await botService.getBots()
    
    if (error) {
      console.error('从Supabase加载数智人列表失败:', error)
      const errorMsg: string = typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : '未知错误'
        
      if (errorMsg.includes('foreign key constraint')) {
        errorMessage.value = '加载数据失败: 用户认证问题，将显示公开数智人'
      } else {
        errorMessage.value = '加载数据失败: ' + errorMsg
      }
      // 如果从Supabase加载失败，回退到本地存储
      loadFromLocalStorage()
    } else if (data && data.length > 0) {
      console.log('成功从Supabase加载数智人列表:', data.length, '条记录')
      botList.value = data
      // 同步到本地存储
      botService.saveLocalBots(data)
    } else {
      console.log('Supabase没有返回数据或数据为空，尝试从本地加载')
      // 如果Supabase没有数据，尝试从本地加载
      loadFromLocalStorage()
    }
  } catch (err: any) {
    console.error('加载数智人列表出错:', err)
    errorMessage.value = '加载数据出错: ' + (err.message || '未知错误')
    // 出错时回退到本地存储
    loadFromLocalStorage()
  } finally {
    isLoading.value = false
  }
}

// 从本地存储加载数智人列表
const loadFromLocalStorage = () => {
  try {
    const localBots = botService.getLocalBots()
    if (localBots && localBots.length > 0) {
      botList.value = localBots
    } else {
      // 默认数智人列表
      botList.value = [
        { coze_bot_id: '7346818792187838518', name: '通用助手', api_key: import.meta.env.VITE_COZE_API_KEY || '', type: 'general' },
        { coze_bot_id: '7451854500203610112', name: '专业顾问', api_key: import.meta.env.VITE_COZE_API_KEY || '', type: 'specialized' },
        { coze_bot_id: '7449012055165845545', name: '技术支持', api_key: import.meta.env.VITE_COZE_API_KEY || '', type: 'specialized' },
        { coze_bot_id: '7427724467013091364', name: '默认数智人', api_key: import.meta.env.VITE_COZE_API_KEY || '', type: 'general' }
      ]
      botService.saveLocalBots(botList.value)
    }
  } catch (error) {
    console.error('从本地存储加载数智人列表失败:', error)
    errorMessage.value = '从本地加载数据失败'
  }
}

// 打开添加模态框
const openAddModal = () => {
  isEditing.value = false
  currentBot.value = { 
    coze_bot_id: '', 
    name: '', 
    api_key: import.meta.env.VITE_COZE_API_KEY || '',
    type: 'general'
  }
  showModal.value = true
}

// 编辑数智人
const editBot = (bot: Bot) => {
  isEditing.value = true
  currentBot.value = { ...bot }
  showModal.value = true
}

// 保存数智人
const saveBot = async () => {
  if (!isFormValid.value) return
  
  // 验证数智人ID和API密钥
  const validation = botService.validateBotCredentials(
    currentBot.value.coze_bot_id,
    currentBot.value.api_key
  )
  
  if (!validation.isValid) {
    if (validation.errors.id) {
      errorMessage.value = validation.errors.id
    } else if (validation.errors.key) {
      errorMessage.value = validation.errors.key
    }
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    if (isEditing.value && currentBot.value.id) {
      // 更新现有数智人
      const { data, error } = await botService.updateBot(currentBot.value.id, {
        name: currentBot.value.name,
        coze_bot_id: currentBot.value.coze_bot_id,
        api_key: currentBot.value.api_key,
        type: currentBot.value.type,
        description: currentBot.value.description
      })
      
      if (error) {
        console.error('更新数智人失败:', error)
        const errorMsg: string = typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : '未知错误'
          
        if (errorMsg.includes('foreign key constraint')) {
          throw new Error('更新失败：用户认证问题，请确保您已登录或使用公开模式')
        } else {
          throw new Error(errorMsg || '更新失败，请稍后重试')
        }
      }
      
      // 如果成功更新，更新本地列表
      if (data && data.length > 0) {
        const index = botList.value.findIndex(bot => bot.id === currentBot.value.id)
        if (index !== -1) {
          botList.value[index] = data[0]
        }
      }
    } else {
      // 添加新数智人
      console.log('正在添加新数智人:', {
        name: currentBot.value.name,
        coze_bot_id: currentBot.value.coze_bot_id,
        type: currentBot.value.type
      })
      
      const { data, error } = await botService.createBot({
        name: currentBot.value.name,
        coze_bot_id: currentBot.value.coze_bot_id,
        api_key: currentBot.value.api_key,
        type: currentBot.value.type || 'general',
        description: currentBot.value.description,
        is_public: true // 设置为公开，避免需要用户ID
      })
      
      if (error) {
        console.error('添加数智人失败:', error)
        const errorMsg: string = typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : '未知错误'
          
        if (errorMsg.includes('foreign key constraint')) {
          throw new Error('添加失败：用户认证问题，请确保您已登录或使用公开模式')
        } else {
          throw new Error(errorMsg || '添加失败，请稍后重试')
        }
      }
      
      // 如果成功添加，将新数智人添加到列表
      if (data && data.length > 0) {
        console.log('成功添加数智人:', data[0])
        botList.value.unshift(data[0])
      } else {
        console.warn('添加成功但未返回数据')
      }
    }
    
    // 保存到本地存储
    botService.saveLocalBots(botList.value)
    closeModal()
  } catch (error: any) {
    console.error('保存数智人失败:', error)
    errorMessage.value = '保存失败: ' + (error.message || '未知错误，请检查网络连接或联系管理员')
  } finally {
    isLoading.value = false
  }
}

// 关闭模态框
const closeModal = () => {
  showModal.value = false
  currentBot.value = { coze_bot_id: '', name: '', api_key: '', type: 'general' }
}

// 确认删除
const confirmDelete = (bot: Bot) => {
  botToDelete.value = bot
  showDeleteConfirm.value = true
}

// 删除数智人
const deleteBot = async () => {
  if (!botToDelete.value || !botToDelete.value.id) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const { error } = await botService.deleteBot(botToDelete.value.id)
    
    if (error) {
      const errorMsg: string = typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : '未知错误'
        
      throw new Error(errorMsg)
    }
    
    // 重新加载数智人列表
    await loadBotList()
    
    showDeleteConfirm.value = false
    botToDelete.value = null
  } catch (error: any) {
    console.error('删除数智人失败:', error)
    errorMessage.value = '删除失败: ' + (error.message || '未知错误')
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时加载数智人列表
onMounted(() => {
  loadBotList()
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
.min-h-screen {
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f6fe 100%);
}
</style> 