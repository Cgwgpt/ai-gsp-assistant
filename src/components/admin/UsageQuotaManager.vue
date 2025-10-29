<template>
  <div class="usage-quota-manager">
    <div class="card">
      <h2 class="text-xl font-bold mb-4">用户用量管理</h2>
      
      <div class="mb-6">
        <div class="tabs">
          <button 
            :class="['tab', { active: activeTab === 'quotas' }]" 
            @click="activeTab = 'quotas'"
          >
            配额管理
          </button>
          <button 
            :class="['tab', { active: activeTab === 'usage' }]" 
            @click="activeTab = 'usage'"
          >
            用量统计
          </button>
        </div>
      </div>
      
      <!-- 配额管理 -->
      <div v-if="activeTab === 'quotas'" class="quotas-tab">
        <div class="flex justify-between mb-4">
          <h3 class="text-lg font-bold">用户配额设置</h3>
          <button 
            class="btn btn-primary btn-sm" 
            @click="showAddQuotaModal = true"
          >
            添加配额
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>用户</th>
                <th>数智人</th>
                <th>对话次数限制</th>
                <th>Tokens限制</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="6" class="text-center py-4">
                  加载中...
                </td>
              </tr>
              <tr v-else-if="userQuotas.length === 0">
                <td colspan="6" class="text-center py-4">
                  暂无配额记录
                </td>
              </tr>
              <tr v-for="quota in userQuotas" :key="quota.id">
                <td>{{ quota.profiles?.email || '未知用户' }}</td>
                <td>{{ quota.bot_id ? (quota.bots?.name || '未知数智人') : '全局配额' }}</td>
                <td>{{ quota.max_conversations === -1 ? '无限制' : quota.max_conversations }}</td>
                <td>{{ quota.max_tokens === -1 ? '无限制' : quota.max_tokens }}</td>
                <td>{{ formatDate(quota.created_at) }}</td>
                <td>
                  <div class="flex space-x-2">
                    <button 
                      class="btn btn-sm btn-outline" 
                      @click="editQuota(quota)"
                    >
                      编辑
                    </button>
                    <button 
                      class="btn btn-sm btn-error" 
                      @click="deleteQuota(quota.id)"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 用量统计 -->
      <div v-if="activeTab === 'usage'" class="usage-tab">
        <div class="flex justify-between mb-4">
          <h3 class="text-lg font-bold">用户使用统计</h3>
          <div class="flex space-x-2">
            <select v-model="selectedUser" class="select select-sm select-bordered">
              <option value="">全部用户</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.email }}
              </option>
            </select>
            <select v-model="selectedMonth" class="select select-sm select-bordered">
              <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
            <select v-model="displayMode" class="select select-sm select-bordered">
              <option value="grouped">分组汇总视图</option>
              <option value="flat">扁平列表视图</option>
              <option value="chart">图表分析视图</option>
            </select>
            <button 
              class="btn btn-sm btn-outline" 
              @click="refreshCurrentTab"
              :disabled="isLoadingUsage"
            >
              <span v-if="isLoadingUsage">刷新中...</span>
              <span v-else>刷新</span>
            </button>
            <button 
              class="btn btn-sm btn-primary" 
              @click="exportCSV"
              :disabled="isLoadingUsage || filteredUserUsages.length === 0"
            >
              导出CSV
            </button>
          </div>
        </div>
        
        <!-- 统计分析卡片 -->
        <div v-if="filteredUserUsages.length > 0" class="stats-cards grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="stat-card bg-white p-4 rounded-lg shadow">
            <div class="text-sm text-gray-500">总用户数</div>
            <div class="text-2xl font-bold">{{ uniqueUserCount }}</div>
            <div class="text-xs text-gray-400 mt-1">活跃用户比例: {{ activeUserPercentage }}%</div>
          </div>
          <div class="stat-card bg-white p-4 rounded-lg shadow">
            <div class="text-sm text-gray-500">总对话次数</div>
            <div class="text-2xl font-bold">{{ totalConversations }}</div>
            <div class="text-xs text-gray-400 mt-1">平均每用户: {{ averageConversationsPerUser }}</div>
          </div>
          <div class="stat-card bg-white p-4 rounded-lg shadow">
            <div class="text-sm text-gray-500">总Token使用量</div>
            <div class="text-2xl font-bold">{{ totalTokens }}</div>
            <div class="text-xs text-gray-400 mt-1">平均每对话: {{ averageTokensPerConversation }}</div>
          </div>
          <div class="stat-card bg-white p-4 rounded-lg shadow">
            <div class="text-sm text-gray-500">热门数智人</div>
            <div class="text-2xl font-bold truncate">{{ mostPopularBot }}</div>
            <div class="text-xs text-gray-400 mt-1" v-if="mostPopularBot !== '暂无数据'">使用率: {{ topBotPercentage }}%</div>
            <div class="text-xs text-gray-400 mt-1" v-else>尚未有数智人使用记录</div>
          </div>
        </div>
        
        <!-- 图表分析视图 -->
        <div v-if="displayMode === 'chart' && filteredUserUsages.length > 0" class="chart-view grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- 用户分布饼图 -->
          <div class="chart-container bg-white p-4 rounded-lg shadow">
            <h4 class="text-md font-semibold mb-4">用户使用分布</h4>
            <div class="h-64">
              <canvas ref="userDistributionChartRef"></canvas>
            </div>
          </div>
          
          <!-- 数智人使用柱状图 -->
          <div class="chart-container bg-white p-4 rounded-lg shadow">
            <h4 class="text-md font-semibold mb-4">数智人使用情况</h4>
            <div class="h-64">
              <canvas ref="botUsageChartRef"></canvas>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-500" v-if="filteredUserUsages.length > 0">
            共找到 {{ filteredUserUsages.length }} 条用量记录
            <span v-if="isShowingAllPeriods" class="text-xs text-blue-500 ml-2">
              (显示所有周期数据)
            </span>
          </span>
          <span></span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>用户</th>
                <th>数智人</th>
                <th>对话次数</th>
                <th>Tokens使用量</th>
                <th>统计周期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoadingUsage">
                <td colspan="5" class="text-center py-4">
                  加载中...
                </td>
              </tr>
              <tr v-else-if="userUsages.length === 0">
                <td colspan="5" class="text-center py-4">
                  暂无用量记录
                </td>
              </tr>
              <tr v-for="usage in userUsages" :key="usage.id">
                <td>{{ usage.profiles?.email || '未知用户' }}</td>
                <td>{{ usage.bot_id ? (usage.bots?.name || '未知数智人') : '全局统计' }}</td>
                <td>{{ usage.conversation_count }}</td>
                <td>{{ usage.token_count }}</td>
                <td>{{ formatPeriod(usage.period_start, usage.period_end) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑配额弹窗 -->
    <div class="modal" :class="{ 'modal-open': showAddQuotaModal }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          {{ editingQuota ? '编辑配额' : '添加配额' }}
        </h3>
        
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">用户</span>
          </label>
          <select v-model="quotaForm.user_id" class="select select-bordered" :disabled="editingQuota">
            <option value="">-- 选择用户 --</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.email }}
            </option>
          </select>
        </div>
        
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">适用范围</span>
          </label>
          <div class="flex space-x-4">
            <label class="cursor-pointer label">
              <input 
                type="radio" 
                class="radio" 
                :value="null" 
                v-model="quotaForm.bot_id"
                :disabled="editingQuota"
              />
              <span class="label-text ml-2">全局配额</span>
            </label>
            <label class="cursor-pointer label">
              <input 
                type="radio" 
                class="radio" 
                :value="'specific'" 
                v-model="specificBot"
                :disabled="editingQuota"
              />
              <span class="label-text ml-2">特定数智人</span>
            </label>
          </div>
        </div>
        
        <div v-if="specificBot === 'specific'" class="form-control mb-4">
          <label class="label">
            <span class="label-text">选择数智人</span>
          </label>
          <select v-model="quotaForm.bot_id" class="select select-bordered" :disabled="editingQuota">
            <option value="">-- 选择数智人 --</option>
            <option v-for="bot in bots" :key="bot.id" :value="bot.id">
              {{ bot.name }}
            </option>
          </select>
        </div>
        
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">对话次数限制 (-1表示无限制)</span>
          </label>
          <input 
            type="number" 
            class="input input-bordered" 
            v-model.number="quotaForm.max_conversations"
            min="-1"
          />
        </div>
        
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Tokens使用限制 (-1表示无限制)</span>
          </label>
          <input 
            type="number" 
            class="input input-bordered" 
            v-model.number="quotaForm.max_tokens"
            min="-1"
          />
        </div>
        
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closeAddQuotaModal">
            取消
          </button>
          <button class="btn btn-primary" @click="saveQuota" :disabled="!isFormValid">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { usageService } from '../../../services/usageService'
import { useSupabase } from '../../../composables/useSupabase'
import Chart from 'chart.js/auto'

// 接收初始标签页参数
const props = defineProps({
  initialActiveTab: {
    type: String,
    default: 'quotas' // 默认值
  }
})

// 标签页
const activeTab = ref(props.initialActiveTab)

// 加载状态
const isLoading = ref(false)
const isLoadingUsage = ref(false)

// 用户配额数据
const userQuotas = ref([])
const userUsages = ref([])
const users = ref([])
const bots = ref([])

// 用户筛选
const selectedUser = ref('')

// 显示模式：分组汇总或扁平列表
const displayMode = ref('grouped')

// 过滤并排序后的用户使用记录
const filteredUserUsages = computed(() => {
  let result = [...userUsages.value]
  
  // 按用户过滤
  if (selectedUser.value) {
    result = result.filter(usage => usage.user_id === selectedUser.value)
  }
  
  // 默认按用户邮箱排序
  result.sort((a, b) => {
    const emailA = a.profiles?.email || ''
    const emailB = b.profiles?.email || ''
    return emailA.localeCompare(emailB)
  })
  
  return result
})

// 弹窗
const showAddQuotaModal = ref(false)
const editingQuota = ref(null)
const specificBot = ref(null)

// 表单
const quotaForm = ref({
  user_id: '',
  bot_id: null,
  max_conversations: -1,
  max_tokens: -1
})

// 记录是否显示所有周期
const isShowingAllPeriods = ref(false)

// 检查是否为当前选择的周期
const isCurrentPeriod = (start, end) => {
  if (!selectedMonth.value) return false
  return selectedMonth.value.start === start && selectedMonth.value.end === end
}

// 清空表单
const resetForm = () => {
  quotaForm.value = {
    user_id: '',
    bot_id: null,
    max_conversations: -1,
    max_tokens: -1
  }
  specificBot.value = null
  editingQuota.value = null
}

// 关闭弹窗
const closeAddQuotaModal = () => {
  showAddQuotaModal.value = false
  resetForm()
}

// 表单验证
const isFormValid = computed(() => {
  if (!quotaForm.value.user_id) return false
  if (specificBot.value === 'specific' && !quotaForm.value.bot_id) return false
  return true
})

// 加载用户配额数据
const loadUserQuotas = async () => {
  isLoading.value = true
  try {
    const { data, error } = await usageService.getAllUserQuotas()
    if (error) {
      console.error('获取用户配额失败:', error)
      alert('获取用户配额失败，请刷新重试')
      return
    }
    userQuotas.value = data || []
  } catch (err) {
    console.error('加载用户配额出错:', err)
  } finally {
    isLoading.value = false
  }
}

// 加载用户和数智人数据
const loadUsersAndBots = async () => {
  const { supabase } = useSupabase()
  
  try {
    // 加载用户
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, email')
      .order('email', { ascending: true })
    
    users.value = profilesData || []
    
    // 加载数智人
    const { data: botsData } = await supabase
      .from('bots')
      .select('id, name, coze_bot_id')
      .order('name', { ascending: true })
    
    bots.value = botsData || []
  } catch (err) {
    console.error('加载用户和数智人数据出错:', err)
  }
}

// 编辑配额
const editQuota = (quota) => {
  editingQuota.value = quota
  quotaForm.value = {
    user_id: quota.user_id,
    bot_id: quota.bot_id,
    max_conversations: quota.max_conversations,
    max_tokens: quota.max_tokens
  }
  specificBot.value = quota.bot_id ? 'specific' : null
  showAddQuotaModal.value = true
}

// 保存配额
const saveQuota = async () => {
  try {
    // 如果是编辑模式，保持原有的bot_id
    if (editingQuota.value) {
      quotaForm.value.bot_id = editingQuota.value.bot_id
    }
    
    // 如果不是特定数智人，设置bot_id为null
    if (specificBot.value !== 'specific') {
      quotaForm.value.bot_id = null
    }
    
    const { data, error } = await usageService.setUserQuota(quotaForm.value)
    
    if (error) {
      console.error('保存配额失败:', error)
      alert('保存配额失败，请重试')
      return
    }
    
    // 刷新数据
    await loadUserQuotas()
    
    // 关闭弹窗
    closeAddQuotaModal()
  } catch (err) {
    console.error('保存配额出错:', err)
    alert('操作失败，请重试')
  }
}

// 删除配额
const deleteQuota = async (id) => {
  if (!confirm('确定要删除此配额吗？删除后将使用默认配额（无限制）。')) {
    return
  }
  
  try {
    const { error } = await usageService.deleteUserQuota(id)
    
    if (error) {
      console.error('删除配额失败:', error)
      alert('删除配额失败，请重试')
      return
    }
    
    // 刷新数据
    await loadUserQuotas()
  } catch (err) {
    console.error('删除配额出错:', err)
    alert('操作失败，请重试')
  }
}

// 日期格式化
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 时间段格式化
const formatPeriod = (startDate, endDate) => {
  if (!startDate || !endDate) return ''
  return `${formatDate(startDate)} 至 ${formatDate(endDate)}`
}

// 可选月份
const availableMonths = computed(() => {
  const months = []
  const now = new Date()
  
  // 生成最近6个月的选项
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-01`
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0]
    
    months.push({
      label: `${d.getFullYear()}年${d.getMonth() + 1}月`,
      value: { start: monthStart, end: monthEnd }
    })
  }
  
  return months
})

// 当前选择的月份
const selectedMonth = ref(availableMonths.value[0]?.value || { start: '', end: '' })

// 重写加载用户使用统计函数
const loadUserUsage = async () => {
  if (!selectedMonth.value) return
  
  isLoadingUsage.value = true
  userUsages.value = []
  isShowingAllPeriods.value = false
  
  try {
    console.log('加载月份:', selectedMonth.value.start, selectedMonth.value.end)
    
    let data, error;
    
    // 如果选择了特定用户，使用新的方法获取该用户的使用统计
    if (selectedUser.value) {
      console.log('加载特定用户数据:', selectedUser.value)
      const result = await usageService.getUserUsageByUserId(
        selectedUser.value,
        selectedMonth.value.start,
        selectedMonth.value.end
      )
      data = result.data;
      error = result.error;
    } else {
      // 获取所有用户的使用统计
      const result = await usageService.getAllUserUsage(
        selectedMonth.value.start,
        selectedMonth.value.end
      )
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error('获取用户使用统计失败:', error)
      alert('获取用户使用统计失败，请刷新重试')
      return
    }
    
    userUsages.value = data || []
    
    // 检查是否包含不同于所选周期的记录
    if (userUsages.value.length > 0) {
      const hasDifferentPeriods = userUsages.value.some(usage => 
        usage.period_start !== selectedMonth.value.start ||
        usage.period_end !== selectedMonth.value.end
      )
      
      isShowingAllPeriods.value = hasDifferentPeriods
    }
    
    console.log('成功加载使用统计数据:', userUsages.value.length, '条记录', 
                isShowingAllPeriods.value ? '(包含所有周期)' : '')
    
  } catch (err) {
    console.error('加载用户使用统计出错:', err)
  } finally {
    isLoadingUsage.value = false
  }
}

// 监听选项卡切换
const watchActiveTab = async () => {
  if (activeTab.value === 'quotas') {
    await loadUserQuotas()
  } else if (activeTab.value === 'usage') {
    await loadUserUsage()
  }
}

// 监听月份变化
const watchSelectedMonth = async () => {
  if (activeTab.value === 'usage') {
    await loadUserUsage()
  }
}

// 初始化
onMounted(async () => {
  await loadUsersAndBots()
  await watchActiveTab()
  await watchDisplayModeMounted()
})

// 设置监听
watch(activeTab, watchActiveTab)
watch(selectedMonth, watchSelectedMonth)

// 计算总计值
const totalConversations = computed(() => {
  return filteredUserUsages.value.reduce((total, usage) => total + (usage.conversation_count || 0), 0);
});

const totalTokens = computed(() => {
  return filteredUserUsages.value.reduce((total, usage) => total + (usage.token_count || 0), 0);
});

// 统计指标计算
const uniqueUserCount = computed(() => {
  const uniqueUsers = new Set(filteredUserUsages.value.map(usage => usage.user_id))
  return uniqueUsers.size
})

const activeUserPercentage = computed(() => {
  if (users.value.length === 0) return 0
  return Math.round((uniqueUserCount.value / users.value.length) * 100)
})

const averageConversationsPerUser = computed(() => {
  if (uniqueUserCount.value === 0) return 0
  return Math.round(totalConversations.value / uniqueUserCount.value)
})

const averageTokensPerConversation = computed(() => {
  if (totalConversations.value === 0) return 0
  return Math.round(totalTokens.value / totalConversations.value)
})

const mostPopularBot = computed(() => {
  const botUsage = {}
  filteredUserUsages.value.forEach(usage => {
    // 只计算真实的数智人，排除全局统计
    if (usage.bot_id) {
      const botName = usage.bots?.name || '未知数智人'
      if (!botUsage[botName]) {
        botUsage[botName] = 0
      }
      botUsage[botName] += usage.conversation_count || 0
    }
  })
  
  let maxUsage = 0
  let popularBot = '暂无数据'
  
  Object.entries(botUsage).forEach(([bot, count]) => {
    if (count > maxUsage) {
      maxUsage = count
      popularBot = bot
    }
  })
  
  return popularBot
})

const topBotPercentage = computed(() => {
  const totalBotConversations = filteredUserUsages.value
    .filter(usage => usage.bot_id) // 只计算有数智人ID的记录
    .reduce((total, usage) => total + (usage.conversation_count || 0), 0)
  
  if (totalBotConversations === 0) return 0
  
  const botUsage = {}
  filteredUserUsages.value.forEach(usage => {
    // 只计算真实的数智人，排除全局统计
    if (usage.bot_id) {
      const botName = usage.bots?.name || '未知数智人'
      if (!botUsage[botName]) {
        botUsage[botName] = 0
      }
      botUsage[botName] += usage.conversation_count || 0
    }
  })
  
  let maxUsage = 0
  Object.values(botUsage).forEach(count => {
    if (count > maxUsage) {
      maxUsage = count
    }
  })
  
  return Math.round((maxUsage / totalBotConversations) * 100)
})

const refreshCurrentTab = async () => {
  await loadUserUsage()
}

const exportCSV = () => {
  // CSV表头
  const headers = ['用户', '数智人', '对话次数', 'Tokens使用量', '统计周期']
  
  // 准备数据行
  const rows = filteredUserUsages.value.map(usage => {
    return [
      usage.profiles?.email || '未知用户',
      usage.bot_id ? (usage.bots?.name || '未知数智人') : '全局统计',
      usage.conversation_count,
      usage.token_count,
      formatPeriod(usage.period_start, usage.period_end)
    ]
  })
  
  // 添加总计行
  rows.push(['总计', '', totalConversations.value, totalTokens.value, ''])
  
  // 合并表头和数据
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // 创建下载链接
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  // 设置下载属性
  const month = selectedMonth.value.start.substring(0, 7)
  link.setAttribute('href', url)
  link.setAttribute('download', `用户使用统计_${month}.csv`)
  
  // 触发点击下载
  document.body.appendChild(link)
  link.click()
  
  // 清理
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 图表实例
const userDistributionChart = ref(null)
const botUsageChart = ref(null)

// 图表DOM引用
const userDistributionChartRef = ref(null)
const botUsageChartRef = ref(null)

// 图表颜色
const chartColors = [
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(153, 102, 255, 0.8)'
]

// 监听图表视图切换
watch(displayMode, async (newMode) => {
  if (newMode === 'chart') {
    await nextTick()
    renderCharts()
  }
})

// 监听用户数据变化，更新图表
watch(filteredUserUsages, async () => {
  if (displayMode.value === 'chart') {
    await nextTick()
    renderCharts()
  }
}, { deep: true })

// 渲染所有图表
const renderCharts = () => {
  renderUserDistributionChart()
  renderBotUsageChart()
}

// 渲染用户分布饼图
const renderUserDistributionChart = () => {
  const canvas = userDistributionChartRef.value
  if (!canvas) return
  
  // 销毁现有图表
  if (userDistributionChart.value) {
    userDistributionChart.value.destroy()
  }
  
  // 准备数据 - 只统计与真实数智人的交互
  const userUsage = {}
  filteredUserUsages.value.forEach(usage => {
    if (usage.bot_id) { // 排除全局统计
      const userEmail = usage.profiles?.email || '未知用户'
      if (!userUsage[userEmail]) {
        userUsage[userEmail] = 0
      }
      userUsage[userEmail] += usage.token_count || 0
    }
  })
  
  // 检查是否有数据
  if (Object.keys(userUsage).length === 0) {
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = '14px Arial'
      ctx.fillStyle = '#666'
      ctx.textAlign = 'center'
      ctx.fillText('暂无用户使用数据', canvas.width / 2, canvas.height / 2)
    }
    return
  }
  
  // 排序并取前5名用户
  const sortedUsers = Object.entries(userUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  
  // 计算这些用户的总和
  const topUsersSum = sortedUsers.reduce((sum, [_, count]) => sum + count, 0)
  
  // 计算其他用户总和 (如果有的话)
  let othersSum = 0
  if (Object.keys(userUsage).length > 5) {
    Object.entries(userUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(5)
      .forEach(([_, count]) => {
        othersSum += count
      })
  }
  
  // 准备图表数据
  const labels = sortedUsers.map(([user]) => user)
  const data = sortedUsers.map(([_, count]) => count)
  
  // 如果有其他用户，添加到数据中
  if (othersSum > 0) {
    labels.push('其他用户')
    data.push(othersSum)
  }
  
  // 创建图表
  userDistributionChart.value = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: chartColors.slice(0, labels.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.raw
              const total = data.reduce((sum, val) => sum + val, 0)
              const percentage = Math.round((value / total) * 100)
              return `${label}: ${value} (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

// 渲染数智人使用柱状图
const renderBotUsageChart = () => {
  const canvas = botUsageChartRef.value
  if (!canvas) return
  
  // 销毁现有图表
  if (botUsageChart.value) {
    botUsageChart.value.destroy()
  }
  
  // 准备数据
  const botConversations = {}
  const botTokens = {}
  
  filteredUserUsages.value.forEach(usage => {
    // 只计算真实的数智人，排除全局统计
    if (usage.bot_id) {
      const botName = usage.bots?.name || '未知数智人'
      
      if (!botConversations[botName]) {
        botConversations[botName] = 0
        botTokens[botName] = 0
      }
      
      botConversations[botName] += usage.conversation_count || 0
      botTokens[botName] += usage.token_count || 0
    }
  })
  
  // 排序并取前6个数智人
  const sortedBots = Object.entries(botConversations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  
  // 如果没有数据，显示提示信息
  if (sortedBots.length === 0) {
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = '14px Arial'
      ctx.fillStyle = '#666'
      ctx.textAlign = 'center'
      ctx.fillText('暂无数智人使用数据', canvas.width / 2, canvas.height / 2)
    }
    return
  }
  
  // 准备图表数据
  const labels = sortedBots.map(([bot]) => bot)
  const conversationData = sortedBots.map(([bot]) => botConversations[bot])
  
  // 创建图表
  botUsageChart.value = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '对话次数',
          data: conversationData,
          backgroundColor: chartColors[0],
          borderWidth: 1,
          borderColor: chartColors[0]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            font: {
              size: 10
            },
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  })
}

// 更新初始化方法，添加图表初始化
const watchDisplayModeMounted = async () => {
  if (displayMode.value === 'chart') {
    await nextTick()
    renderCharts()
  }
}
</script>

<style scoped>
.usage-quota-manager {
  width: 100%;
}

.card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.tab {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.tab.active {
  border-bottom: 2px solid #3b82f6;
  color: #3b82f6;
  font-weight: 600;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-outline {
  border: 1px solid #e5e7eb;
}

.btn-outline:hover {
  background-color: #f3f4f6;
}

.btn-error {
  background-color: #ef4444;
  color: white;
}

.btn-error:hover {
  background-color: #dc2626;
}

.btn-ghost {
  background-color: transparent;
}

.btn-ghost:hover {
  background-color: #f3f4f6;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}

.modal-open {
  visibility: visible;
  opacity: 1;
}

.modal-box {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 32rem;
}

.modal-action {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.form-control {
  margin-bottom: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.25rem;
}

.input, .select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
}

.input:focus, .select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.stats-cards {
  transition: all 0.3s ease;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.chart-view {
  transition: all 0.3s ease;
}

.chart-container {
  transition: all 0.3s ease;
}

.chart-container:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style> 