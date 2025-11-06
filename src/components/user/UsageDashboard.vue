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
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">总体使用情况</h2>
          <button 
            @click="loadUserUsage" 
            :disabled="isLoading"
            class="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4"
              :class="{ 'animate-spin': isLoading }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isLoading ? '刷新中...' : '刷新' }}
          </button>
        </div>
        
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
        
        <div class="usage-table">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-700">数智人名称</th>
                <th class="text-right py-3 px-4 font-semibold text-gray-700">对话次数</th>
                <th class="text-right py-3 px-4 font-semibold text-gray-700">Token使用量</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="botUsage in botUsages" 
                :key="botUsage.bot?.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="py-3 px-4 font-medium text-gray-900">
                  {{ botUsage.bot?.name || '未知数智人' }}
                </td>
                <td class="py-3 px-4 text-right text-gray-700">
                  {{ botUsage?.usage?.conversation_count || 0 }}
                </td>
                <td class="py-3 px-4 text-right text-gray-700">
                  {{ botUsage?.usage?.token_count || 0 }}
                </td>
              </tr>
            </tbody>
          </table>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { usageService } from '../../../services/usageService'
import { useSupabase } from '../../../composables/useSupabase'
import { botService } from '../../../services/botService'

const { user, supabase } = useSupabase()
const isLoading = ref(true)
const globalUsage = ref(null)
const botUsages = ref([])
let wasHidden = false

// 调试函数：直接查询数据库并对比
const debugUsageData = async () => {
  if (!user.value) {
    console.error('❌ 用户未登录')
    return
  }
  
  console.log('\n🔍 ========== 开始调试使用次数数据 ==========')
  const userId = user.value.id
  
  // 获取数智人列表
  const { data: bots } = await botService.getUserBots()
  const targetBot = bots?.find(bot => bot.name === '识病用药助手' || bot.name.includes('识病用药'))
  
  if (!targetBot) {
    console.error('❌ 未找到"识病用药助手"')
    return
  }
  
  console.log('✅ 目标数智人:', {
    name: targetBot.name,
    id: targetBot.id,
    coze_bot_id: targetBot.coze_bot_id
  })
  
  // 计算周期
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const periodStart = monthStart.toISOString().split('T')[0]
  const periodEnd = monthEnd.toISOString().split('T')[0]
  
  console.log('📅 查询周期:', periodStart, '至', periodEnd)
  
  // 直接查询数据库
  const { data: dbData, error: dbError } = await supabase
    .from('usage_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('bot_id', targetBot.id)
    .eq('period_start', periodStart)
    .eq('period_end', periodEnd)
    .maybeSingle()
  
  console.log('\n📊 数据库直接查询结果:')
  if (dbError) {
    console.error('❌ 查询失败:', dbError)
  } else if (dbData) {
    console.log('✅ 找到记录:', {
      conversation_count: dbData.conversation_count,
      token_count: dbData.token_count,
      updated_at: dbData.updated_at,
      period_start: dbData.period_start,
      period_end: dbData.period_end
    })
  } else {
    console.log('⚠️ 未找到记录（可能为0次）')
  }
  
  // 使用服务层查询
  console.log('\n🔄 服务层查询结果:')
  const { data: serviceData, error: serviceError } = await usageService.getUserUsageStatus(userId, targetBot.id)
  if (serviceError) {
    console.error('❌ 服务层查询失败:', serviceError)
  } else if (serviceData) {
    console.log('✅ 服务层返回:', {
      conversation_count: serviceData.usage?.conversation_count,
      max_conversations: serviceData.quota?.max_conversations,
      conversationPercent: serviceData.conversationPercent + '%',
      fullData: serviceData
    })
  }
  
  // 对比
  console.log('\n📈 数据对比:')
  const dbCount = dbData?.conversation_count || 0
  const serviceCount = serviceData?.usage?.conversation_count || 0
  console.log(`数据库: ${dbCount} 次`)
  console.log(`服务层: ${serviceCount} 次`)
  
  if (dbCount !== serviceCount) {
    console.error('❌ 数据不一致！')
    console.log('可能的原因:')
    console.log('  1. bot_id 不匹配')
    console.log('  2. period_start/period_end 格式不一致')
    console.log('  3. 查询时机问题')
  } else {
    console.log('✅ 数据一致')
  }
  
  // 查询所有数智人的使用记录（当前周期）
  const { data: allUsage } = await supabase
    .from('usage_metrics')
    .select('*, bots(name)')
    .eq('user_id', userId)
    .not('bot_id', 'is', null)
    .eq('period_start', periodStart)
    .eq('period_end', periodEnd)
  
  if (allUsage && allUsage.length > 0) {
    console.log('\n📋 当前周期所有数智人使用记录:')
    allUsage.forEach(usage => {
      console.log(`  - ${usage.bots?.name || usage.bot_id}: ${usage.conversation_count} 次`)
    })
    const total = allUsage.reduce((sum, u) => sum + (u.conversation_count || 0), 0)
    console.log(`  - 总计: ${total} 次`)
  }
  
  // 查询所有历史记录（不限制周期）
  const { data: allHistory } = await supabase
    .from('usage_metrics')
    .select('*, bots(name)')
    .eq('user_id', userId)
    .eq('bot_id', targetBot.id)
    .order('updated_at', { ascending: false })
    .limit(10)
  
  if (allHistory && allHistory.length > 0) {
    console.log('\n📜 识病用药助手的所有历史记录（最近10条）:')
    allHistory.forEach(usage => {
      console.log(`  - 周期: ${usage.period_start} 至 ${usage.period_end}`)
      console.log(`    对话次数: ${usage.conversation_count}`)
      console.log(`    Token使用量: ${usage.token_count}`)
      console.log(`    更新时间: ${usage.updated_at}`)
    })
    
    // 检查是否有Token使用量
    const hasTokens = allHistory.some(r => r.token_count > 0)
    if (!hasTokens) {
      console.warn('⚠️ 所有记录中都没有Token使用量，可能Token使用量没有被正确记录')
    }
  }
  
  // 检查是否有遗漏的记录（查询所有周期）
  const { data: allPeriods } = await supabase
    .from('usage_metrics')
    .select('*, bots(name)')
    .eq('user_id', userId)
    .eq('bot_id', targetBot.id)
  
  if (allPeriods && allPeriods.length > 0) {
    console.log('\n🔍 识病用药助手所有周期的记录:')
    allPeriods.forEach(usage => {
      const isCurrent = usage.period_start === periodStart && usage.period_end === periodEnd
      console.log(`  ${isCurrent ? '✅' : '  '} 周期: ${usage.period_start} 至 ${usage.period_end}, 次数: ${usage.conversation_count}`)
    })
  }
  
  console.log('\n🔍 ========== 调试完成 ==========\n')
  console.log('💡 提示：如果发现数据不一致，可能是：')
  console.log('  1. 记录在不同周期（检查 period_start/period_end）')
  console.log('  2. 历史记录未同步（需要手动修正）')
  console.log('  3. 配额检查在记录之前（已修复，不影响新记录）')
}

// 加载用户的使用情况
const loadUserUsage = async () => {
  isLoading.value = true
  
  try {
    if (!user.value) return
    
    const refreshTime = new Date().toISOString()
    console.log('[使用统计] ========== 开始刷新数据 ==========')
    console.log('[使用统计] 刷新时间:', refreshTime)
    console.log('[使用统计] 用户ID:', user.value.id)
    
    // 加载全局使用情况
    const { data: globalData, error: globalError } = await usageService.getUserUsageStatus(user.value.id)
    if (globalError) {
      console.error('[使用统计] ❌ 获取全局使用情况失败:', globalError)
    }
    if (globalData) {
      globalUsage.value = globalData
      console.log('[使用统计] ✅ 全局使用情况已更新')
      console.log('[使用统计] 全局对话次数:', globalData.usage?.conversation_count, '/', globalData.quota?.max_conversations)
    } else {
      console.warn('[使用统计] ⚠️ 未获取到全局使用情况数据')
    }
    
    // 加载用户有权限访问的数智人
    const { data: userBots, error: botsError } = await botService.getUserBots()
    if (botsError) {
      console.error('[使用统计] ❌ 获取数智人列表失败:', botsError)
    }
    
    console.log('[使用统计] 用户有权限访问的数智人数量:', userBots?.length || 0)
    
    if (userBots && userBots.length > 0) {
      // 对每个数智人加载使用情况
      const botUsagePromises = userBots.map(async (bot) => {
        console.log(`[使用统计] 正在获取数智人使用情况:`)
        console.log(`[使用统计]   - 数智人名称: ${bot.name}`)
        console.log(`[使用统计]   - 数智人ID (UUID): ${bot.id}`)
        console.log(`[使用统计]   - Coze Bot ID: ${bot.coze_bot_id}`)
        
        const { data, error } = await usageService.getUserUsageStatus(user.value.id, bot.id)
        if (error) {
          console.error(`[使用统计] ❌ 获取数智人 ${bot.name} 使用情况失败:`, error)
        }
        if (data) {
          console.log(`[使用统计] ✅ 数智人 ${bot.name} 使用情况:`)
          console.log(`[使用统计]   - 对话次数: ${data.usage?.conversation_count} / ${data.quota?.max_conversations}`)
          console.log(`[使用统计]   - Token使用量: ${data.usage?.token_count} / ${data.quota?.max_tokens || '无限制'}`)
          console.log(`[使用统计]   - 使用百分比: ${data.conversationPercent}%`)
          console.log(`[使用统计]   - 完整数据:`, data)
        } else {
          console.warn(`[使用统计] ⚠️ 数智人 ${bot.name} 没有返回数据`)
        }
        return {
          bot,
          ...data
        }
      })
      
      botUsages.value = await Promise.all(botUsagePromises)
      console.log('[使用统计] ✅ 各数智人使用情况已更新，共', botUsages.value.length, '个数智人')
      console.log('[使用统计] ========== 刷新数据完成 ==========')
    } else {
      console.warn('[使用统计] ⚠️ 用户没有可访问的数智人')
    }
  } catch (error) {
    console.error('[使用统计] ❌ 加载用户使用情况失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 页面可见性变化处理：当页面从隐藏变为可见时刷新一次
const handleVisibilityChange = () => {
  if (document.hidden) {
    wasHidden = true
  } else if (wasHidden && user.value) {
    // 页面从隐藏变为可见，且之前确实隐藏过，则刷新一次
    console.log('[使用统计] 页面重新可见，刷新数据')
    loadUserUsage()
    wasHidden = false
  }
}

// 页面打开时加载一次数据
onMounted(async () => {
  if (user.value) {
    await loadUserUsage()
  }
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
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

.usage-table {
  overflow-x: auto;
}

.usage-table table {
  border-collapse: collapse;
}

.usage-table tbody tr:last-child {
  border-bottom: none;
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