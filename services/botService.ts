import { useSupabase } from '../composables/useSupabase'
import { authorizationService } from './authorizationService'

export interface Bot {
  id?: string
  coze_bot_id: string
  name: string
  api_key: string
  type?: string
  description?: string
  is_public?: boolean
  user_id?: string
  organization_id?: string
  created_at?: string
  updated_at?: string
  authorization_id?: string // 授权ID
  authorization_created_at?: string // 授权创建时间
}

export const botService = {
  // 获取用户可用的数智人列表
  async getUserBots() {
    const { supabase, user } = useSupabase()
    
    if (!user.value) {
      console.error('获取用户数智人失败: 用户未登录')
      return { data: [], error: new Error('用户未登录') }
    }
    
    try {
      console.log('正在获取用户数智人列表:', user.value.id)
      
      // 首先获取公开的数智人
      const { data: publicBots, error: publicError } = await supabase
        .from('bots')
        .select('id, name, coze_bot_id, type, description, is_public')
        .eq('is_public', true)
      
      if (publicError) {
        console.error('获取公开数智人失败:', publicError)
      }
      
      // 然后获取用户被授权的非公开数智人
      const { data: authorizedBots, error: authError } = await authorizationService.getUserAuthorizedBots(user.value.id)
      
      if (authError) {
        console.error('获取授权数智人失败:', authError)
      }
      
      // 合并两个列表，移除重复项
      const allBots = [...(publicBots || [])];
      
      // 只添加不在公开列表中的授权数智人
      if (authorizedBots) {
        authorizedBots.forEach(authBot => {
          if (!allBots.find(bot => bot.id === authBot.id)) {
            allBots.push(authBot);
          }
        });
      }
      
      console.log('获取到用户可用数智人:', allBots.length)
      return { data: allBots, error: null }
    } catch (err) {
      console.error('获取用户数智人列表出错:', err)
      return { data: [], error: err }
    }
  },
  
  // 获取数智人列表
  async getBots(onlyAuthorized = false) {
    const { supabase, user } = useSupabase()
    
    try {
      if (onlyAuthorized && user?.value?.id) {
        // 获取用户被授权的数智人
        return await authorizationService.getUserAuthorizedBots(user.value.id)
      } else {
        // 获取所有数智人（管理员使用）
        const { data, error } = await supabase
          .from('bots')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('获取数智人列表失败:', error)
          return { data: [], error }
        }
        
        return { data, error: null }
      }
    } catch (err) {
      console.error('获取数智人列表出错:', err)
      return { data: [], error: err }
    }
  },
  
  // 获取单个数智人
  async getBot(id: string) {
    const { supabase, user } = useSupabase()
    
    try {
      let botData;
      let botError;
      
      // 检查是否是UUID格式
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      if (isUuid) {
        // 如果是UUID，使用id字段查询
        const result = await supabase
          .from('bots')
          .select('*')
          .eq('id', id)
          .single();
          
        botData = result.data;
        botError = result.error;
      } else {
        // 如果不是UUID，假设是coze_bot_id
        const result = await supabase
          .from('bots')
          .select('*')
          .eq('coze_bot_id', id)
          .single();
          
        botData = result.data;
        botError = result.error;
      }
      
      if (botError) {
        console.error('获取数智人详情失败:', botError)
        return { data: null, error: botError }
      }
      
      // 如果用户已登录且数智人不是公开的，检查用户是否有权限
      if (user?.value?.id && botData && !botData.is_public) {
        // 首先检查用户是否是管理员
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.value.id)
          .single()
        
        const isAdmin = profileData?.role === 'admin'
        
        if (!isAdmin) {
          // 非管理员需要检查授权
          const { isAuthorized } = await authorizationService.checkUserBotAuthorization(
            user.value.id, 
            botData.id
          )
          
          if (!isAuthorized) {
            return { 
              data: null, 
              error: { message: '您没有使用此数智人的权限' } 
            }
          }
        }
      }
      
      return { data: botData, error: null }
    } catch (err) {
      console.error('获取数智人详情出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 创建数智人
  async createBot(botData: Bot) {
    const { supabase, user } = useSupabase()
    
    // 确保coze_bot_id是字符串类型
    const coze_bot_id = String(botData.coze_bot_id)
    
    // 准备数据
    const newBotData: any = {
      name: botData.name,
      coze_bot_id,
      api_key: botData.api_key,
      type: botData.type || 'general',
      description: botData.description || '',
      is_public: botData.is_public !== undefined ? botData.is_public : true // 默认设置为公开
    }
    
    // 如果有用户ID，添加用户ID
    if (user?.value?.id) {
      newBotData.user_id = user.value.id
    }
    
    // 如果有组织ID，添加组织ID
    if (botData.organization_id) {
      newBotData.organization_id = botData.organization_id
    }
    
    return await supabase
      .from('bots')
      .insert([newBotData])
      .select()
  },
  
  // 更新数智人
  async updateBot(id: string, botData: Partial<Bot>) {
    const { supabase } = useSupabase()
    
    // 准备更新数据，只包含允许更新的字段
    const updateData: any = {
      name: botData.name,
      api_key: botData.api_key,
      type: botData.type,
      description: botData.description,
      updated_at: new Date().toISOString()
    }
    
    // 如果更新包含coze_bot_id，确保它是字符串类型
    if (botData.coze_bot_id) {
      updateData.coze_bot_id = String(botData.coze_bot_id)
    }
    
    // 如果更新包含is_public字段
    if (botData.is_public !== undefined) {
      updateData.is_public = botData.is_public
    }
    
    // 如果更新包含organization_id
    if (botData.organization_id) {
      updateData.organization_id = botData.organization_id
    }
    
    return await supabase
      .from('bots')
      .update(updateData)
      .eq('id', id)
      .select()
  },
  
  // 删除数智人
  async deleteBot(id: string) {
    const { supabase } = useSupabase()
    return await supabase
      .from('bots')
      .delete()
      .eq('id', id)
  },
  
  // 从本地存储加载数智人列表
  getLocalBots() {
    try {
      const { user } = useSupabase()
      const userId = user.value?.id || 'anonymous'
      const storageKey = `bot_list_${userId}`
      
      const savedBots = localStorage.getItem(storageKey)
      if (savedBots) {
        return JSON.parse(savedBots)
      }
    } catch (error) {
      console.error('从本地存储加载数智人列表失败:', error)
    }
    return []
  },
  
  // 保存数智人列表到本地存储
  saveLocalBots(bots: Bot[]) {
    try {
      const { user } = useSupabase()
      const userId = user.value?.id || 'anonymous'
      const storageKey = `bot_list_${userId}`
      
      localStorage.setItem(storageKey, JSON.stringify(bots))
      return true
    } catch (error) {
      console.error('保存数智人列表到本地存储失败:', error)
      return false
    }
  },
  
  // 验证数智人ID和API密钥
  validateBotCredentials(botId: string, apiKey: string) {
    // 验证数智人ID是否为10-20位的纯数字
    const isValidId = /^\d{10,20}$/.test(botId)
    
    // 验证API密钥是否以pat_开头
    const isValidKey = apiKey.startsWith('pat_')
    
    return {
      isValid: isValidId && isValidKey,
      errors: {
        id: !isValidId ? '数智人ID必须是10-20位的纯数字' : null,
        key: !isValidKey ? 'API密钥必须以pat_开头' : null
      }
    }
  }
} 