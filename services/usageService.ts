import { useSupabase } from '../composables/useSupabase'

export interface UserQuota {
  id?: string
  user_id: string
  bot_id?: string | null
  max_conversations: number
  max_tokens: number
  created_at?: string
  updated_at?: string
}

export interface UsageMetric {
  id?: string
  user_id: string
  bot_id?: string | null
  conversation_count: number
  token_count: number
  period_start: string
  period_end: string
  created_at?: string
  updated_at?: string
}

export const usageService = {
  // 获取用户的配额设置
  async getUserQuota(userId: string, botId?: string) {
    const { supabase } = useSupabase()
    
    try {
      // 先尝试获取用户对特定数智人的配额
      if (botId) {
        const { data, error } = await supabase
          .from('user_quotas')
          .select('*')
          .eq('user_id', userId)
          .eq('bot_id', botId)
          .maybeSingle() // 使用maybeSingle()避免406错误
        
        if (error && error.code !== 'PGRST116') { // PGRST116 是没有找到记录的错误
          console.error('获取用户配额失败:', error)
          return { 
            data: { 
              user_id: userId, 
              bot_id: botId,
              max_conversations: -1, 
              max_tokens: -1 
            } as UserQuota, 
            error 
          }
        }
        
        if (data) {
          return { data, error: null }
        }
      }
      
      // 如果没有特定数智人的配额或未指定数智人，获取全局配额
      const { data, error } = await supabase
        .from('user_quotas')
        .select('*')
        .eq('user_id', userId)
        .is('bot_id', null)
        .maybeSingle() // 使用maybeSingle()避免406错误
      
      if (error && error.code !== 'PGRST116') { // PGRST116 是没有找到记录的错误
        console.error('获取用户配额失败:', error)
        return { 
          data: { 
            user_id: userId, 
            bot_id: botId,
            max_conversations: -1, 
            max_tokens: -1 
          } as UserQuota, 
          error 
        }
      }
      
      // 如果没有找到配额记录，返回默认配额（无限制）
      if (!data) {
        return { 
          data: { 
            user_id: userId, 
            bot_id: botId,
            max_conversations: -1, 
            max_tokens: -1 
          } as UserQuota, 
          error: null 
        }
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('获取用户配额出错:', err)
      return { 
        data: { 
          user_id: userId, 
          bot_id: botId,
          max_conversations: -1, 
          max_tokens: -1 
        } as UserQuota, 
        error: err 
      }
    }
  },
  
  // 设置用户配额
  async setUserQuota(quota: UserQuota) {
    const { supabase } = useSupabase()
    
    try {
      // 检查是否已存在配额记录
      const { data: existingQuota } = await supabase
        .from('user_quotas')
        .select('id')
        .eq('user_id', quota.user_id)
        .eq('bot_id', quota.bot_id || null)
        .single()
      
      let result;
      
      if (existingQuota) {
        // 更新现有配额
        result = await supabase
          .from('user_quotas')
          .update({
            max_conversations: quota.max_conversations,
            max_tokens: quota.max_tokens,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingQuota.id)
          .select()
      } else {
        // 创建新的配额记录
        result = await supabase
          .from('user_quotas')
          .insert([{
            user_id: quota.user_id,
            bot_id: quota.bot_id,
            max_conversations: quota.max_conversations,
            max_tokens: quota.max_tokens
          }])
          .select()
      }
      
      return { data: result.data?.[0], error: result.error }
    } catch (err) {
      console.error('设置用户配额出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 获取所有用户的配额
  async getAllUserQuotas() {
    const { supabase } = useSupabase()
    
    try {
      console.log('正在获取所有用户配额...')
      
      // 先检查表是否存在及其结构
      const { data: userQuotasInfo, error: descError } = await supabase
        .from('user_quotas')
        .select('*')
        .limit(1)
      
      if (descError) {
        console.error('获取user_quotas表信息失败:', descError)
        return { data: [], error: descError }
      }
      
      console.log('user_quotas表信息:', userQuotasInfo)
      
      // 获取所有用户配额，使用简化的查询
      const { data, error } = await supabase
        .from('user_quotas')
        .select('id, user_id, bot_id, max_conversations, max_tokens, created_at, updated_at')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('获取所有用户配额失败:', error)
        return { data: [], error }
      }
      
      // 如果成功获取配额数据，接下来获取用户和数智人信息
      if (data && data.length > 0) {
        // 获取所有涉及的用户ID
        const userIds = [...new Set(data.map(quota => quota.user_id))]
        
        // 获取所有涉及的数智人ID
        const botIds = [...new Set(data.filter(quota => quota.bot_id).map(quota => quota.bot_id))]
        
        // 获取用户信息
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds)
        
        if (usersError) {
          console.error('获取用户信息失败:', usersError)
        }
        
        // 获取数智人信息
        const { data: botsData, error: botsError } = await supabase
          .from('bots')
          .select('id, name, coze_bot_id')
          .in('id', botIds)
        
        if (botsError) {
          console.error('获取数智人信息失败:', botsError)
        }
        
        // 将用户和数智人信息关联到配额数据
        const enrichedData = data.map(quota => {
          // 关联用户信息
          const user = usersData?.find(user => user.id === quota.user_id)
          // 关联数智人信息
          const bot = quota.bot_id ? botsData?.find(bot => bot.id === quota.bot_id) : null
          
          return {
            ...quota,
            profiles: user ? { email: user.email } : null,
            bots: bot ? { name: bot.name, coze_bot_id: bot.coze_bot_id } : null
          }
        })
        
        console.log('成功获取并关联用户配额数据')
        return { data: enrichedData, error: null }
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('获取所有用户配额出错:', err)
      return { data: [], error: err }
    }
  },
  
  // 删除用户配额
  async deleteUserQuota(quotaId: string) {
    const { supabase } = useSupabase()
    
    try {
      const { error } = await supabase
        .from('user_quotas')
        .delete()
        .eq('id', quotaId)
      
      return { error }
    } catch (err) {
      console.error('删除用户配额出错:', err)
      return { error: err }
    }
  },
  
  // 获取用户当前周期（默认为当月）的使用统计
  async getUserUsage(userId: string, botId?: string) {
    const { supabase } = useSupabase()
    
    try {
      // 获取当前月份的起止日期（确保与数据库函数一致）
      // 使用 date_trunc('month', CURRENT_DATE) 的逻辑：当月1日到当月最后一天
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() // 0-11
      
      // 当月第一天：YYYY-MM-01
      const monthStart = new Date(year, month, 1)
      // 当月最后一天：下个月第一天减1天
      const monthEnd = new Date(year, month + 1, 0)
      
      const periodStart = monthStart.toISOString().split('T')[0]
      const periodEnd = monthEnd.toISOString().split('T')[0]
      
      console.log(`计算的周期: ${periodStart} 至 ${periodEnd}`)
      
      // 注意：如果查询不到记录，尝试查询其他可能的周期（兼容性处理）
      // 因为可能存在 period_start 为当月1日，period_end 为下月最后一天的情况
      
      // 注意：Supabase客户端会自动处理headers，不需要手动添加
      // 如果遇到406错误，请确保API版本兼容
      
      // 如果是请求特定数智人的使用量
      if (botId) {
        console.log(`[getUserUsage] 查询特定数智人使用量: userId=${userId}, botId=${botId}, period=${periodStart} 至 ${periodEnd}`)
        
        // 策略：优先查找最新的本月记录（兼容不同周期格式）
        // 1. 先查询该数智人的所有本月记录，找出最新的
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()
        
        const { data: allRecords, error: allError } = await supabase
          .from('usage_metrics')
          .select('*')
          .eq('user_id', userId)
          .eq('bot_id', botId)
          .order('updated_at', { ascending: false })
        
        if (allError) {
          console.error(`[getUserUsage] ❌ 查询所有记录失败:`, allError)
        }
        
        // 2. 找出最新的本月记录
        let latestRecord = null
        if (allRecords && allRecords.length > 0) {
          // 筛选出本月的记录（通过 updated_at 判断）
          const currentMonthRecords = allRecords.filter(record => {
            const recordDate = new Date(record.updated_at)
            return recordDate.getFullYear() === currentYear && 
                   recordDate.getMonth() === currentMonth
          })
          
          if (currentMonthRecords.length > 0) {
            // 使用最新的记录
            latestRecord = currentMonthRecords[0]
            console.log(`[getUserUsage] ✅ 找到最新的本月记录:`, {
              period_start: latestRecord.period_start,
              period_end: latestRecord.period_end,
              conversation_count: latestRecord.conversation_count,
              updated_at: latestRecord.updated_at
            })
          } else {
            // 如果没有本月记录，尝试查找当前周期的记录
            const currentPeriodRecord = allRecords.find(record => 
              record.period_start === periodStart && record.period_end === periodEnd
            )
            if (currentPeriodRecord) {
              latestRecord = currentPeriodRecord
              console.log(`[getUserUsage] ⚠️ 使用当前周期的记录（非本月更新）:`, {
                period_start: latestRecord.period_start,
                period_end: latestRecord.period_end,
                conversation_count: latestRecord.conversation_count,
                updated_at: latestRecord.updated_at
              })
            }
          }
        }
        
        if (latestRecord) {
          console.log(`[getUserUsage] ✅ 返回使用量记录:`, {
            bot_id: latestRecord.bot_id,
            conversation_count: latestRecord.conversation_count,
            token_count: latestRecord.token_count,
            period_start: latestRecord.period_start,
            period_end: latestRecord.period_end,
            updated_at: latestRecord.updated_at
          })
          
          // 如果token_count为0但有对话次数，可能是记录在不同周期，尝试查找其他周期的记录
          if (latestRecord.token_count === 0 && latestRecord.conversation_count > 0) {
            console.log(`[getUserUsage] ⚠️ 发现token_count为0但有对话次数，尝试查找其他周期的Token记录`)
            
            // 查找所有周期的记录，找出token_count不为0的记录
            const recordsWithTokens = allRecords.filter(r => r.token_count > 0)
            if (recordsWithTokens.length > 0) {
              // 找出最新的有Token的记录
              const latestWithTokens = recordsWithTokens[0]
              console.log(`[getUserUsage] ✅ 找到有Token的记录，使用该记录的token_count:`, {
                period_start: latestWithTokens.period_start,
                period_end: latestWithTokens.period_end,
                token_count: latestWithTokens.token_count
              })
              
              // 合并数据：使用最新记录的conversation_count，但使用有Token记录的token_count
              return { 
                data: {
                  ...latestRecord,
                  token_count: latestWithTokens.token_count
                }, 
                error: null 
              }
            }
          }
          
          return { data: latestRecord, error: null }
        }
        
        console.log(`[getUserUsage] ⚠️ 未找到使用量记录，返回默认值0`)
        // 如果没有找到使用量记录，返回默认值
        return { 
          data: { 
            user_id: userId, 
            bot_id: botId,
            conversation_count: 0, 
            token_count: 0,
            period_start: periodStart,
            period_end: periodEnd
          } as UsageMetric, 
          error: null 
        }
      }
      
      // 获取用户的全局总体使用量 - 直接计算所有数智人使用量总和（最准确）
      // 策略：查询所有数智人的本月记录，汇总使用量（兼容不同周期格式）
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()
      
      // 查询所有数智人的所有记录
      const { data: allBotRecords, error: botError } = await supabase
        .from('usage_metrics')
        .select('*')
        .eq('user_id', userId)
        .not('bot_id', 'is', null)
        .order('updated_at', { ascending: false })
      
      if (botError) {
        console.error(`[getUserUsage] ❌ 查询所有数智人记录失败:`, botError)
      }
      
      let totalConversations = 0
      let totalTokens = 0
      
      // 筛选出本月的记录并汇总
      if (allBotRecords && allBotRecords.length > 0) {
        // 按 bot_id 分组，每个数智人只取最新的本月记录
        const botMap = new Map<string, UsageMetric>()
        
        allBotRecords.forEach(record => {
          const recordDate = new Date(record.updated_at)
          const isCurrentMonth = recordDate.getFullYear() === currentYear && 
                                 recordDate.getMonth() === currentMonth
          
          if (isCurrentMonth) {
            const botId = record.bot_id!
            // 如果该数智人还没有记录，或者当前记录更新，则使用当前记录
            if (!botMap.has(botId) || 
                new Date(record.updated_at) > new Date(botMap.get(botId)!.updated_at!)) {
              botMap.set(botId, record)
            }
          }
        })
        
        // 汇总所有数智人的使用量
        botMap.forEach(record => {
          totalConversations += record.conversation_count || 0
          totalTokens += record.token_count || 0
        })
        
        console.log(`[getUserUsage] ✅ 全局使用量计算:`, {
          bot_count: botMap.size,
          total_conversations: totalConversations,
          total_tokens: totalTokens
        })
      }
      
      // 尝试更新全局记录（如果存在）
      const { data: globalData } = await supabase
        .from('usage_metrics')
        .select('*')
        .eq('user_id', userId)
        .is('bot_id', null)
        .eq('period_start', periodStart)
        .eq('period_end', periodEnd)
        .maybeSingle()
      
      if (globalData) {
        // 如果全局记录与计算的总和不一致，更新它
        if (globalData.conversation_count !== totalConversations || 
            globalData.token_count !== totalTokens) {
          console.log(`[getUserUsage] ⚠️ 全局记录不一致，更新中...`)
          await supabase
            .from('usage_metrics')
            .update({
              conversation_count: totalConversations,
              token_count: totalTokens,
              updated_at: new Date().toISOString()
            })
            .eq('id', globalData.id)
        }
      } else {
        // 如果全局记录不存在，创建它
        console.log(`[getUserUsage] ⚠️ 全局记录不存在，创建中...`)
        await supabase
          .from('usage_metrics')
          .insert([{
            user_id: userId,
            bot_id: null,
            conversation_count: totalConversations,
            token_count: totalTokens,
            period_start: periodStart,
            period_end: periodEnd
          }])
      }
      
      // 返回计算的总和（确保数据准确）
      return { 
        data: { 
          user_id: userId, 
          bot_id: null,
          conversation_count: totalConversations, 
          token_count: totalTokens,
          period_start: periodStart,
          period_end: periodEnd
        } as UsageMetric, 
        error: null 
      }
    } catch (err) {
      console.error('获取用户使用量出错:', err)
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      return { 
        data: { 
          user_id: userId, 
          bot_id: botId,
          conversation_count: 0, 
          token_count: 0,
          period_start: monthStart.toISOString().split('T')[0],
          period_end: monthEnd.toISOString().split('T')[0]
        } as UsageMetric, 
        error: err 
      }
    }
  },
  
  // 获取所有用户的使用量统计
  async getAllUserUsage(periodStart?: string, periodEnd?: string) {
    const { supabase } = useSupabase()
    
    try {
      // 获取当前月份的起止日期
      if (!periodStart || !periodEnd) {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        
        periodStart = monthStart.toISOString().split('T')[0]
        periodEnd = monthEnd.toISOString().split('T')[0]
      }
      
      console.log('获取用户使用量，周期:', periodStart, '至', periodEnd)
      
      // 先获取使用数据，不进行外键关联
      const { data: usageData, error } = await supabase
        .from('usage_metrics')
        .select('*')
        .eq('period_start', periodStart)
        .eq('period_end', periodEnd)
        .order('token_count', { ascending: false })
      
      if (error) {
        console.error('获取所有用户使用量失败:', error)
        return { data: [], error }
      }
      
      if (!usageData || usageData.length === 0) {
        console.log('没有找到此周期的使用数据，查询所有周期')
        
        // 如果没有找到当前周期的数据，查询所有周期的数据
        const { data: allPeriodsData, error: allPeriodsError } = await supabase
          .from('usage_metrics')
          .select('*')
          .order('period_start', { ascending: false })
          .order('token_count', { ascending: false })
        
        if (allPeriodsError) {
          console.error('获取所有周期用户使用量失败:', allPeriodsError)
          return { data: [], error: allPeriodsError }
        }
        
        if (!allPeriodsData || allPeriodsData.length === 0) {
          console.log('没有找到任何周期的使用数据')
          return { data: [], error: null }
        }
        
        console.log('找到其他周期的使用数据:', allPeriodsData.length, '条记录')
        
        // 收集所有用户ID和数智人ID进行批量查询
        const userIds = [...new Set(allPeriodsData.map(item => item.user_id))]
        const botIds = [...new Set(allPeriodsData.filter(item => item.bot_id).map(item => item.bot_id))]
        
        console.log('需要关联的用户数:', userIds.length, '数智人数:', botIds.length)
        
        // 定义类型
        interface User {
          id: string;
          email: string;
        }
        
        interface Bot {
          id: string;
          name: string;
          coze_bot_id: string;
        }
        
        // 获取用户信息
        let usersData: User[] = []
        if (userIds.length > 0) {
          const usersResponse = await supabase
            .from('profiles')
            .select('id, email')
            .in('id', userIds)
          
          if (usersResponse.error) {
            console.error('获取用户信息失败:', usersResponse.error)
          } else {
            usersData = usersResponse.data || []
            console.log('成功获取用户信息:', usersData.length, '条记录')
          }
        }
        
        // 获取数智人信息
        let botsData: Bot[] = []
        if (botIds.length > 0) {
          const botsResponse = await supabase
            .from('bots')
            .select('id, name, coze_bot_id')
            .in('id', botIds)
          
          if (botsResponse.error) {
            console.error('获取数智人信息失败:', botsResponse.error)
          } else {
            botsData = botsResponse.data || []
            console.log('成功获取数智人信息:', botsData.length, '条记录')
          }
        }
        
        // 手动关联数据
        const enrichedData = allPeriodsData.map(usage => {
          const user = usersData.find(u => u.id === usage.user_id)
          const bot = usage.bot_id ? botsData.find(b => b.id === usage.bot_id) : null
          
          return {
            ...usage,
            profiles: user ? { email: user.email } : null,
            bots: bot ? { name: bot.name, coze_bot_id: bot.coze_bot_id } : null
          }
        })
        
        console.log(`成功关联数据，最终返回${enrichedData.length}条记录`)
        return { data: enrichedData, error: null }
      }
      
      console.log('找到使用数据:', usageData.length, '条记录')
      
      // 收集所有用户ID和数智人ID进行批量查询
      const userIds = [...new Set(usageData.map(item => item.user_id))]
      const botIds = [...new Set(usageData.filter(item => item.bot_id).map(item => item.bot_id))]
      
      console.log('需要关联的用户数:', userIds.length, '数智人数:', botIds.length)
      
      // 定义类型
      interface User {
        id: string;
        email: string;
      }
      
      interface Bot {
        id: string;
        name: string;
        coze_bot_id: string;
      }
      
      // 获取用户信息
      let usersData: User[] = []
      if (userIds.length > 0) {
        const usersResponse = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds)
        
        if (usersResponse.error) {
          console.error('获取用户信息失败:', usersResponse.error)
        } else {
          usersData = usersResponse.data || []
          console.log('成功获取用户信息:', usersData.length, '条记录')
        }
      }
      
      // 获取数智人信息
      let botsData: Bot[] = []
      if (botIds.length > 0) {
        const botsResponse = await supabase
          .from('bots')
          .select('id, name, coze_bot_id')
          .in('id', botIds)
        
        if (botsResponse.error) {
          console.error('获取数智人信息失败:', botsResponse.error)
        } else {
          botsData = botsResponse.data || []
          console.log('成功获取数智人信息:', botsData.length, '条记录')
        }
      }
      
      // 手动关联数据
      const enrichedData = usageData.map(usage => {
        const user = usersData.find(u => u.id === usage.user_id)
        const bot = usage.bot_id ? botsData.find(b => b.id === usage.bot_id) : null
        
        return {
          ...usage,
          profiles: user ? { email: user.email } : null,
          bots: bot ? { name: bot.name, coze_bot_id: bot.coze_bot_id } : null
        }
      })
      
      console.log(`成功关联数据，最终返回${enrichedData.length}条记录`)
      return { data: enrichedData, error: null }
    } catch (err) {
      console.error('获取所有用户使用量出错:', err)
      return { data: [], error: err }
    }
  },
  
  // 按用户ID获取使用量统计
  async getUserUsageByUserId(userId: string, periodStart?: string, periodEnd?: string) {
    const { supabase } = useSupabase()
    
    try {
      // 获取当前月份的起止日期（如果未提供）
      if (!periodStart || !periodEnd) {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        
        periodStart = monthStart.toISOString().split('T')[0]
        periodEnd = monthEnd.toISOString().split('T')[0]
      }
      
      console.log(`获取特定用户使用量，用户ID: ${userId}, 周期: ${periodStart} 至 ${periodEnd}`)
      
      // 查询特定用户的使用数据
      const { data: usageData, error } = await supabase
        .from('usage_metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('period_start', periodStart)
        .eq('period_end', periodEnd)
        .order('token_count', { ascending: false })
      
      if (error) {
        console.error(`获取用户 ${userId} 使用量失败:`, error)
        return { data: [], error }
      }
      
      if (!usageData || usageData.length === 0) {
        console.log(`没有找到此用户在指定周期的使用数据，查询所有周期`)
        
        // 如果没有找到当前周期的数据，查询所有周期的数据
        const { data: allPeriodsData, error: allPeriodsError } = await supabase
          .from('usage_metrics')
          .select('*')
          .eq('user_id', userId)
          .order('period_start', { ascending: false })
          .order('token_count', { ascending: false })
        
        if (allPeriodsError) {
          console.error(`获取用户 ${userId} 所有周期使用量失败:`, allPeriodsError)
          return { data: [], error: allPeriodsError }
        }
        
        if (!allPeriodsData || allPeriodsData.length === 0) {
          console.log(`没有找到用户 ${userId} 任何周期的使用数据`)
          return { data: [], error: null }
        }
        
        console.log(`找到用户 ${userId} 其他周期的使用数据:`, allPeriodsData.length, '条记录')
        
        // 收集所有数智人ID进行批量查询
        const botIds = [...new Set(allPeriodsData.filter(item => item.bot_id).map(item => item.bot_id))]
        
        // 获取用户信息 - 只需要获取指定用户的信息
        let userData = null
        const userResponse = await supabase
          .from('profiles')
          .select('id, email')
          .eq('id', userId)
          .single()
        
        if (userResponse.error) {
          console.error(`获取用户 ${userId} 信息失败:`, userResponse.error)
        } else {
          userData = userResponse.data
        }
        
        // 获取数智人信息
        interface Bot {
          id: string;
          name: string;
          coze_bot_id?: string;
        }
        
        let botsData: Bot[] = []
        if (botIds.length > 0) {
          const botsResponse = await supabase
            .from('bots')
            .select('id, name, coze_bot_id')
            .in('id', botIds)
          
          if (botsResponse.error) {
            console.error('获取数智人信息失败:', botsResponse.error)
          } else {
            botsData = botsResponse.data || []
          }
        }
        
        // 手动关联数据
        const enrichedData = allPeriodsData.map(usage => {
          const bot = usage.bot_id ? botsData.find(b => b.id === usage.bot_id) : null
          
          return {
            ...usage,
            profiles: userData ? { email: userData.email } : null,
            bots: bot ? { name: bot.name, coze_bot_id: bot.coze_bot_id } : null
          }
        })
        
        console.log(`成功关联数据，最终返回 ${enrichedData.length} 条记录`)
        return { data: enrichedData, error: null }
      }
      
      console.log(`找到用户 ${userId} 使用数据:`, usageData.length, '条记录')
      
      // 收集所有数智人ID
      const botIds = [...new Set(usageData.filter(item => item.bot_id).map(item => item.bot_id))]
      
      // 获取用户信息 - 只需要获取指定用户的信息
      let userData = null
      const userResponse = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', userId)
        .single()
      
      if (userResponse.error) {
        console.error(`获取用户 ${userId} 信息失败:`, userResponse.error)
      } else {
        userData = userResponse.data
      }
      
      // 获取数智人信息
      interface Bot {
        id: string;
        name: string;
        coze_bot_id?: string;
      }
      
      let botsData: Bot[] = []
      if (botIds.length > 0) {
        const botsResponse = await supabase
          .from('bots')
          .select('id, name, coze_bot_id')
          .in('id', botIds)
        
        if (botsResponse.error) {
          console.error('获取数智人信息失败:', botsResponse.error)
        } else {
          botsData = botsResponse.data || []
        }
      }
      
      // 手动关联数据
      const enrichedData = usageData.map(usage => {
        const bot = usage.bot_id ? botsData.find(b => b.id === usage.bot_id) : null
        
        return {
          ...usage,
          profiles: userData ? { email: userData.email } : null,
          bots: bot ? { name: bot.name, coze_bot_id: bot.coze_bot_id } : null
        }
      })
      
      console.log(`成功关联数据，最终返回 ${enrichedData.length} 条记录`)
      return { data: enrichedData, error: null }
    } catch (err) {
      console.error(`获取用户 ${userId} 使用量出错:`, err)
      return { data: [], error: err }
    }
  },
  
  // 记录对话使用量
  async recordConversationUsage(userId: string, botId: string, tokensUsed: number = 0) {
    const { supabase } = useSupabase()
    
    try {
      // 获取当前月份的起止日期
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      const periodStart = monthStart.toISOString().split('T')[0]
      const periodEnd = monthEnd.toISOString().split('T')[0]
      
      // 添加重试机制
      let retries = 3
      let success = false
      let lastError = null
      
      while (retries > 0 && !success) {
        try {
          // 处理特定数智人的使用统计
          // 先获取特定数智人的使用统计
          let botMetrics = await supabase
            .from('usage_metrics')
            .select('*')
            .eq('user_id', userId)
            .eq('bot_id', botId)
            .eq('period_start', periodStart)
            .eq('period_end', periodEnd)
            .maybeSingle() // 使用maybeSingle()避免406错误
          
          // 更新特定数智人的使用统计
          if (botMetrics.data) {
            const updateResult = await supabase
              .from('usage_metrics')
              .update({
                conversation_count: botMetrics.data.conversation_count + 1,
                token_count: botMetrics.data.token_count + tokensUsed,
                updated_at: new Date().toISOString()
              })
              .eq('id', botMetrics.data.id)
            
            if (updateResult.error) {
              throw new Error(`更新数智人使用统计失败: ${updateResult.error.message}`)
            }
          } else {
            const insertResult = await supabase
              .from('usage_metrics')
              .insert([{
                user_id: userId,
                bot_id: botId,
                conversation_count: 1,
                token_count: tokensUsed,
                period_start: periodStart,
                period_end: periodEnd
              }])
            
            if (insertResult.error) {
              throw new Error(`插入数智人使用统计失败: ${insertResult.error.message}`)
            }
          }
          
          // 处理全局使用统计 - 改为汇总所有数智人统计
          // 先获取所有数智人的用量
          const { data: allBotUsage, error: botUsageError } = await supabase
            .from('usage_metrics')
            .select('*')
            .eq('user_id', userId)
            .not('bot_id', 'is', null)
            .eq('period_start', periodStart)
            .eq('period_end', periodEnd)
          
          if (botUsageError) {
            throw new Error(`获取所有数智人使用统计失败: ${botUsageError.message}`)
          }
          
          // 计算所有数智人使用量总和
          let totalConversations = 0
          let totalTokens = 0
          
          if (allBotUsage && allBotUsage.length > 0) {
            totalConversations = allBotUsage.reduce((sum, item) => sum + (item.conversation_count || 0), 0)
            totalTokens = allBotUsage.reduce((sum, item) => sum + (item.token_count || 0), 0)
          }
          
          // 获取全局使用统计
          let globalMetrics = await supabase
            .from('usage_metrics')
            .select('*')
            .eq('user_id', userId)
            .is('bot_id', null)
            .eq('period_start', periodStart)
            .eq('period_end', periodEnd)
            .maybeSingle() // 使用maybeSingle()避免406错误
          
          // 更新全局使用统计
          if (globalMetrics.data) {
            // 只有当计算出的总和与现有记录不符时才更新
            if (globalMetrics.data.conversation_count !== totalConversations || 
                globalMetrics.data.token_count !== totalTokens) {
              const updateResult = await supabase
                .from('usage_metrics')
                .update({
                  conversation_count: totalConversations,
                  token_count: totalTokens,
                  updated_at: new Date().toISOString()
                })
                .eq('id', globalMetrics.data.id)
              
              if (updateResult.error) {
                throw new Error(`更新全局使用统计失败: ${updateResult.error.message}`)
              }
            }
          } else {
            const insertResult = await supabase
              .from('usage_metrics')
              .insert([{
                user_id: userId,
                bot_id: null,
                conversation_count: totalConversations,
                token_count: totalTokens,
                period_start: periodStart,
                period_end: periodEnd
              }])
            
            if (insertResult.error) {
              throw new Error(`插入全局使用统计失败: ${insertResult.error.message}`)
            }
          }
          
          // 全部操作成功
          success = true
          
        } catch (err) {
          lastError = err
          console.error(`记录对话使用量尝试 ${4-retries}/3 失败:`, err)
          retries--
          
          // 延迟一段时间后重试
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }
      
      if (!success) {
        console.error('所有尝试记录对话使用量均失败:', lastError)
        return { success: false, error: lastError }
      }
      
      return { success: true, error: null }
    } catch (err) {
      console.error('记录对话使用量出错:', err)
      return { success: false, error: err }
    }
  },
  
  // 记录Token使用量
  async recordTokenUsage(userId: string, botId: string, tokensUsed: number) {
    const { supabase } = useSupabase()
    
    try {
      // 获取当前月份的起止日期
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      const periodStart = monthStart.toISOString().split('T')[0]
      const periodEnd = monthEnd.toISOString().split('T')[0]
      
      // 添加重试机制
      let retries = 3
      let success = false
      let lastError = null
      
      while (retries > 0 && !success) {
        try {
          // 处理特定数智人的使用统计
          // 先获取特定数智人的使用统计
          let botMetrics = await supabase
            .from('usage_metrics')
            .select('*')
            .eq('user_id', userId)
            .eq('bot_id', botId)
            .eq('period_start', periodStart)
            .eq('period_end', periodEnd)
            .maybeSingle() // 使用maybeSingle()避免406错误
          
          // 更新特定数智人的使用统计
          if (botMetrics.data) {
            const updateResult = await supabase
              .from('usage_metrics')
              .update({
                token_count: botMetrics.data.token_count + tokensUsed,
                updated_at: new Date().toISOString()
              })
              .eq('id', botMetrics.data.id)
            
            if (updateResult.error) {
              throw new Error(`更新数智人Token使用统计失败: ${updateResult.error.message}`)
            }
          } else {
            const insertResult = await supabase
              .from('usage_metrics')
              .insert([{
                user_id: userId,
                bot_id: botId,
                conversation_count: 0,
                token_count: tokensUsed,
                period_start: periodStart,
                period_end: periodEnd
              }])
            
            if (insertResult.error) {
              throw new Error(`插入数智人Token使用统计失败: ${insertResult.error.message}`)
            }
          }
          
          // 处理全局使用统计 - 改为汇总所有数智人统计
          // 先获取所有数智人的用量
          const { data: allBotUsage, error: botUsageError } = await supabase
            .from('usage_metrics')
            .select('*')
            .eq('user_id', userId)
            .not('bot_id', 'is', null)
            .eq('period_start', periodStart)
            .eq('period_end', periodEnd)
          
          if (botUsageError) {
            throw new Error(`获取所有数智人Token使用统计失败: ${botUsageError.message}`)
          }
          
          // 计算所有数智人使用量总和
          let totalConversations = 0
          let totalTokens = 0
          
          if (allBotUsage && allBotUsage.length > 0) {
            totalConversations = allBotUsage.reduce((sum, item) => sum + (item.conversation_count || 0), 0)
            totalTokens = allBotUsage.reduce((sum, item) => sum + (item.token_count || 0), 0)
          }
          
          // 获取全局使用统计
          let globalMetrics = await supabase
            .from('usage_metrics')
            .select('*')
            .eq('user_id', userId)
            .is('bot_id', null)
            .eq('period_start', periodStart)
            .eq('period_end', periodEnd)
            .maybeSingle() // 使用maybeSingle()避免406错误
          
          // 更新全局使用统计
          if (globalMetrics.data) {
            // 只有当计算出的总和与现有记录不符时才更新
            if (globalMetrics.data.conversation_count !== totalConversations || 
                globalMetrics.data.token_count !== totalTokens) {
              const updateResult = await supabase
                .from('usage_metrics')
                .update({
                  conversation_count: totalConversations,
                  token_count: totalTokens,
                  updated_at: new Date().toISOString()
                })
                .eq('id', globalMetrics.data.id)
              
              if (updateResult.error) {
                throw new Error(`更新全局Token使用统计失败: ${updateResult.error.message}`)
              }
            }
          } else {
            const insertResult = await supabase
              .from('usage_metrics')
              .insert([{
                user_id: userId,
                bot_id: null,
                conversation_count: totalConversations,
                token_count: totalTokens,
                period_start: periodStart,
                period_end: periodEnd
              }])
            
            if (insertResult.error) {
              throw new Error(`插入全局Token使用统计失败: ${insertResult.error.message}`)
            }
          }
          
          // 全部操作成功
          success = true
          
        } catch (err) {
          lastError = err
          console.error(`记录Token使用量尝试 ${4-retries}/3 失败:`, err)
          retries--
          
          // 延迟一段时间后重试
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }
      
      if (!success) {
        console.error('所有尝试记录Token使用量均失败:', lastError)
        return { success: false, error: lastError }
      }
      
      return { success: true, error: null }
    } catch (err) {
      console.error('记录Token使用量出错:', err)
      return { success: false, error: err }
    }
  },
  
  // 检查用户是否超出对话次数限制（原子操作：检查并记录）
  // 最简单直接的方法：在一个数据库事务中完成检查和记录，避免竞态条件
  async checkConversationQuota(userId: string, botId: string) {
    const { supabase } = useSupabase()
    
    try {
      console.log('[配额检查] ========== 开始检查并记录用户配额 ==========')
      console.log('[配额检查] 参数:', { userId, botId })
      
      // 验证参数
      if (!userId || !botId) {
        console.error('[配额检查] 参数无效:', { userId, botId })
        return { allowed: false, error: new Error('参数无效') }
      }
      
      // 使用原子操作函数：检查配额并记录使用量（如果允许）
      const { data, error } = await supabase
        .rpc('check_and_record_conversation_usage', {
          p_user_id: userId,
          p_bot_id: botId
        })
      
      console.log('[配额检查] RPC调用结果:', { 
        data, 
        error, 
        dataType: typeof data,
        dataValue: data,
        errorCode: error?.code,
        errorMessage: error?.message
      })
      
      // 如果RPC调用有错误，严格禁止
      if (error) {
        console.error('[配额检查] ❌ RPC调用失败，禁止发送消息')
        console.error('[配额检查] 错误详情:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        return { allowed: false, error }
      }
      
      // 严格检查返回值：只有 data === true 才允许
      const allowed = data === true
      
      if (!allowed) {
        console.warn('[配额检查] ❌ 配额检查未通过，禁止发送消息（已超过配额限制）')
      } else {
        console.log('[配额检查] ✅ 配额检查通过，已记录使用量，允许发送消息')
      }
      
      return { allowed, error: null }
    } catch (err) {
      console.error('[配额检查] ❌ 检查用户对话配额异常:', err)
      return { allowed: false, error: err }
    }
  },
  
  // 获取用户的使用状态（当前使用量与配额）
  async getUserUsageStatus(userId: string, botId?: string) {
    try {
      console.log(`获取用户使用状态: userId=${userId}, botId=${botId || '全局'}`)
      
      // 获取用户配额
      const { data: quota, error: quotaError } = await this.getUserQuota(userId, botId)
      
      if (quotaError) {
        console.error(`获取用户配额失败: userId=${userId}, botId=${botId || '全局'}`, quotaError)
        return { data: null, error: quotaError }
      }
      
      console.log(`用户配额数据: userId=${userId}, botId=${botId || '全局'}`, quota)
      
      // 获取用户使用量
      const { data: usage, error: usageError } = await this.getUserUsage(userId, botId)
      
      if (usageError) {
        console.error(`获取用户使用量失败: userId=${userId}, botId=${botId || '全局'}`, usageError)
        return { data: null, error: usageError }
      }
      
      console.log(`用户使用量数据: userId=${userId}, botId=${botId || '全局'}`, usage)
      
      // 计算使用百分比
      let conversationPercent = 0
      let tokenPercent = 0
      
      // 只有当max_conversations大于0时才计算百分比，-1表示无限制
      if (quota.max_conversations > 0) {
        conversationPercent = Math.round((usage.conversation_count / quota.max_conversations) * 100)
      }
      
      // 只有当max_tokens大于0时才计算百分比，-1表示无限制
      if (quota.max_tokens > 0) {
        tokenPercent = Math.round((usage.token_count / quota.max_tokens) * 100)
      }
      
      const result = {
        quota,
        usage,
        conversationPercent,
        tokenPercent,
        // 修改这里：当max_conversations > 0时才有限制
        hasConversationLimit: quota.max_conversations > 0,
        // 修改这里：当max_tokens > 0时才有限制
        hasTokenLimit: quota.max_tokens > 0,
        // 修改这里：只有当设置了限制且达到限制时才标记为到达限制
        reachedConversationLimit: quota.max_conversations > 0 && usage.conversation_count >= quota.max_conversations,
        reachedTokenLimit: quota.max_tokens > 0 && usage.token_count >= quota.max_tokens
      }
      
      console.log(`用户使用状态结果: userId=${userId}, botId=${botId || '全局'}`, result)
      return { data: result, error: null }
    } catch (err) {
      console.error(`获取用户使用状态出错: userId=${userId}, botId=${botId || '全局'}`, err)
      return { data: null, error: err }
    }
  },
  
  // 为测试生成用量记录
  async generateTestUsageData(userId: string, botId: string, options: {
    conversationCount?: number, 
    tokenCount?: number, 
    periodStart?: string, 
    periodEnd?: string
  }) {
    const { supabase } = useSupabase()
    
    try {
      // 确定记录周期
      const now = new Date()
      const periodStart = options.periodStart || 
        new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const periodEnd = options.periodEnd || 
        new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
      
      console.log(`生成测试用量记录，周期: ${periodStart} 至 ${periodEnd}`)
      
      // 设置默认值
      const conversationCount = options.conversationCount || 10
      const tokenCount = options.tokenCount || 1000
      
      // 先检查是否已有记录
      const { data: existingData, error: checkError } = await supabase
        .from('usage_metrics')
        .select('id')
        .eq('user_id', userId)
        .eq('bot_id', botId)
        .eq('period_start', periodStart)
        .eq('period_end', periodEnd)
        .maybeSingle()
      
      if (checkError) {
        console.error('检查现有记录失败:', checkError)
        return { success: false, error: checkError }
      }
      
      let result
      
      // 如果已有记录，更新
      if (existingData) {
        console.log('更新现有用量记录')
        result = await supabase
          .from('usage_metrics')
          .update({
            conversation_count: conversationCount,
            token_count: tokenCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
      } else {
        // 插入新记录
        console.log('创建新的用量记录')
        result = await supabase
          .from('usage_metrics')
          .insert([{
            user_id: userId,
            bot_id: botId,
            conversation_count: conversationCount,
            token_count: tokenCount,
            period_start: periodStart,
            period_end: periodEnd
          }])
      }
      
      if (result.error) {
        console.error('生成测试用量记录失败:', result.error)
        return { success: false, error: result.error }
      }
      
      // 同时更新或创建全局记录
      const { data: allBotUsage } = await supabase
        .from('usage_metrics')
        .select('*')
        .eq('user_id', userId)
        .not('bot_id', 'is', null)
        .eq('period_start', periodStart)
        .eq('period_end', periodEnd)
      
      let totalConversations = 0
      let totalTokens = 0
      
      // 计算所有数智人使用量总和
      if (allBotUsage && allBotUsage.length > 0) {
        totalConversations = allBotUsage.reduce((sum, item) => sum + (item.conversation_count || 0), 0)
        totalTokens = allBotUsage.reduce((sum, item) => sum + (item.token_count || 0), 0)
      }
      
      // 检查全局记录是否存在
      const { data: globalData } = await supabase
        .from('usage_metrics')
        .select('id')
        .eq('user_id', userId)
        .is('bot_id', null)
        .eq('period_start', periodStart)
        .eq('period_end', periodEnd)
        .maybeSingle()
      
      let globalResult
      
      if (globalData) {
        // 更新全局记录
        globalResult = await supabase
          .from('usage_metrics')
          .update({
            conversation_count: totalConversations,
            token_count: totalTokens,
            updated_at: new Date().toISOString()
          })
          .eq('id', globalData.id)
      } else {
        // 创建全局记录
        globalResult = await supabase
          .from('usage_metrics')
          .insert([{
            user_id: userId,
            bot_id: null,
            conversation_count: totalConversations,
            token_count: totalTokens,
            period_start: periodStart,
            period_end: periodEnd
          }])
      }
      
      if (globalResult.error) {
        console.error('更新全局测试用量记录失败:', globalResult.error)
        return { success: true, warning: '已生成数智人记录，但全局记录更新失败' }
      }
      
      console.log('成功生成测试用量记录')
      return { success: true, error: null }
    } catch (err) {
      console.error('生成测试用量记录出错:', err)
      return { success: false, error: err }
    }
  }
} 