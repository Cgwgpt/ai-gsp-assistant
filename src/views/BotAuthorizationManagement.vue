<template>
  <div>
    <!-- 添加导航栏 -->
    <TheNavbar />
    
    <div class="pt-16 min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-blue-600 p-4">
        <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-white text-xl font-medium">数智人授权管理</h1>
            <div class="flex items-center gap-4">
              <span class="text-white">管理用户数智人权限</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ errorMessage }}
          </div>
          
          <!-- 授权管理工具栏 -->
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-700">用户授权列表</h2>
            <button 
              @click="openAddModal" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              添加授权
            </button>
          </div>
          
          <!-- 加载指示器 -->
          <div v-if="isLoading" class="flex justify-center items-center py-8">
            <div class="loader"></div>
          </div>
          
          <!-- 授权列表 -->
          <div v-else>
            <!-- 筛选工具 -->
            <div class="mb-4 flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="搜索用户或数智人..." 
                class="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64"
              />
              
              <div class="flex-grow"></div>
              
              <select 
                v-model="sortBy" 
                class="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="created_at">按创建时间</option>
                <option value="user_name">按用户名</option>
                <option value="bot_name">按数智人名</option>
              </select>
            </div>
            
            <!-- 授权表格 -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数智人</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">授权时间</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="filteredAuthorizations.length === 0">
                    <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                      暂无授权记录
                    </td>
                  </tr>
                  <tr v-for="auth in filteredAuthorizations" :key="auth.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ auth.profiles.email }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ auth.bots.name }}</div>
                      <div class="text-sm text-gray-500">ID: {{ auth.bots.coze_bot_id.substring(0, 8) }}...</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(auth.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        @click="confirmRevoke(auth)"
                        class="text-red-600 hover:text-red-900"
                      >
                        撤销授权
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加授权模态框 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h3 class="text-lg font-medium">添加数智人授权</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeModal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">选择用户</label>
            <select 
              v-model="selectedUserId" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择用户...</option>
              <option v-for="user in userList" :key="user.id" :value="user.id">
                {{ user.email }}
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">选择数智人</label>
            <select 
              v-model="selectedBotId" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择数智人...</option>
              <option v-for="bot in botList" :key="bot.id" :value="bot.id">
                {{ bot.name }} (ID: {{ bot.coze_bot_id.substring(0, 8) }}...)
              </option>
            </select>
          </div>
          
          <div class="flex justify-end gap-3 mt-6">
            <button 
              @click="closeModal" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              @click="addAuthorization" 
              :disabled="!selectedUserId || !selectedBotId || isLoading" 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? '处理中...' : '添加授权' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 撤销授权确认模态框 -->
    <div v-if="showRevokeConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <h3 class="text-lg font-medium mb-4">确认撤销授权？</h3>
          <p class="text-gray-600 mb-4">
            您确定要撤销用户 <span class="font-medium">{{ authToRevoke?.profiles?.email }}</span> 
            对数智人 <span class="font-medium">{{ authToRevoke?.bots?.name }}</span> 的使用权限吗？
            该用户将无法再使用此数智人。
          </p>
          
          <div class="flex justify-end gap-3 mt-6">
            <button 
              @click="closeRevokeConfirm" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              @click="revokeAuthorization" 
              :disabled="isLoading" 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? '处理中...' : '确认撤销' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '../../composables/useSupabase'
import { authorizationService } from '../../services/authorizationService'
import { botService } from '../../services/botService'
import TheNavbar from '../components/TheNavbar.vue'

// 状态
const isLoading = ref(false)
const errorMessage = ref('')
const authorizationList = ref([])
const userList = ref([])
const botList = ref([])
const searchQuery = ref('')
const sortBy = ref('created_at')

// 模态框状态
const showAddModal = ref(false)
const showRevokeConfirm = ref(false)
const selectedUserId = ref('')
const selectedBotId = ref('')
const authToRevoke = ref(null)

// 获取 Supabase 实例
const { supabase } = useSupabase()

// 过滤和排序授权列表
const filteredAuthorizations = computed(() => {
  let filtered = [...authorizationList.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(auth => {
      const userEmail = (auth.profiles.email || '').toLowerCase()
      const botName = (auth.bots.name || '').toLowerCase()
      return userEmail.includes(query) || botName.includes(query)
    })
  }
  
  // 排序
  filtered.sort((a, b) => {
    if (sortBy.value === 'user_name') {
      return a.profiles.email.localeCompare(b.profiles.email)
    } else if (sortBy.value === 'bot_name') {
      return a.bots.name.localeCompare(b.bots.name)
    } else {
      // 默认按创建时间降序排序
      return new Date(b.created_at) - new Date(a.created_at)
    }
  })
  
  return filtered
})

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

// 加载授权列表
const loadAuthorizations = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const { data, error } = await authorizationService.getAllAuthorizations()
    
    if (error) {
      throw new Error('获取授权列表失败: ' + error.message)
    }
    
    authorizationList.value = data || []
  } catch (error) {
    console.error('加载授权列表失败:', error)
    errorMessage.value = error.message || '加载授权列表失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 加载用户列表
const loadUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .order('email')
    
    if (error) {
      throw new Error('获取用户列表失败: ' + error.message)
    }
    
    userList.value = data || []
  } catch (error) {
    console.error('加载用户列表失败:', error)
    errorMessage.value = error.message || '加载用户列表失败，请重试'
  }
}

// 加载数智人列表
const loadBots = async () => {
  try {
    const { data, error } = await botService.getBots()
    
    if (error) {
      throw new Error('获取数智人列表失败: ' + error.message)
    }
    
    botList.value = data || []
  } catch (error) {
    console.error('加载数智人列表失败:', error)
    errorMessage.value = error.message || '加载数智人列表失败，请重试'
  }
}

// 打开添加授权模态框
const openAddModal = () => {
  selectedUserId.value = ''
  selectedBotId.value = ''
  showAddModal.value = true
}

// 关闭模态框
const closeModal = () => {
  showAddModal.value = false
}

// 添加授权
const addAuthorization = async () => {
  if (!selectedUserId.value || !selectedBotId.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const { data, error } = await authorizationService.authorizeUserBot(
      selectedUserId.value,
      selectedBotId.value
    )
    
    if (error) {
      throw new Error('添加授权失败: ' + error.message)
    }
    
    // 更新列表
    await loadAuthorizations()
    closeModal()
  } catch (error) {
    console.error('添加授权失败:', error)
    errorMessage.value = error.message || '添加授权失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 确认撤销授权
const confirmRevoke = (auth) => {
  authToRevoke.value = auth
  showRevokeConfirm.value = true
}

// 关闭撤销确认框
const closeRevokeConfirm = () => {
  showRevokeConfirm.value = false
  authToRevoke.value = null
}

// 撤销授权
const revokeAuthorization = async () => {
  if (!authToRevoke.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const { error } = await authorizationService.revokeUserBot(authToRevoke.value.id)
    
    if (error) {
      throw new Error('撤销授权失败: ' + error.message)
    }
    
    // 更新列表
    await loadAuthorizations()
    closeRevokeConfirm()
  } catch (error) {
    console.error('撤销授权失败:', error)
    errorMessage.value = error.message || '撤销授权失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  await Promise.all([
    loadAuthorizations(),
    loadUsers(),
    loadBots()
  ])
})
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 