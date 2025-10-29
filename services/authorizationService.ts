import { useSupabase } from '../composables/useSupabase'

export interface BotAuthorization {
  id?: string
  user_id: string
  bot_id: string
  created_at?: string
  updated_at?: string
}

export const authorizationService = {
  // 获取用户被授权的所有数智人
  async getUserAuthorizedBots(userId: string) {
    const { supabase } = useSupabase()
    
    try {
      // 1. 获取用户的授权记录
      const { data: authData, error: authError } = await supabase
        .from('bot_authorizations')
        .select('id, bot_id, created_at')
        .eq('user_id', userId)
      
      if (authError) {
        console.error('获取用户授权记录失败:', authError)
        return { data: [], error: authError }
      }
      
      if (!authData || authData.length === 0) {
        return { data: [], error: null }
      }
      
      // 2. 获取所有相关数智人
      const botIds = authData.map(auth => auth.bot_id)
      const { data: botsData, error: botsError } = await supabase
        .from('bots')
        .select('id, name, coze_bot_id, api_key, type, description, is_public')
        .in('id', botIds)
      
      if (botsError) {
        console.error('获取数智人信息失败:', botsError)
        return { data: [], error: botsError }
      }
      
      // 3. 构建授权ID到创建时间的映射
      interface AuthMap {
        [key: string]: { id: string, created_at: string }
      }
      
      const authMap: AuthMap = {}
      authData.forEach(auth => {
        authMap[auth.bot_id] = { id: auth.id, created_at: auth.created_at }
      })
      
      // 4. 组合数据
      const botsWithAuth = botsData.map(bot => ({
        ...bot,
        authorization_id: authMap[bot.id]?.id,
        authorization_created_at: authMap[bot.id]?.created_at
      }))
      
      return { data: botsWithAuth, error: null }
    } catch (err) {
      console.error('获取用户授权数智人出错:', err)
      return { data: [], error: err }
    }
  },
  
  // 获取所有用户的数智人授权情况
  async getAllAuthorizations() {
    const { supabase } = useSupabase()
    
    try {
      // 1. 获取所有授权记录
      const { data: authData, error: authError } = await supabase
        .from('bot_authorizations')
        .select('id, user_id, bot_id, created_at')
        .order('created_at', { ascending: false })
      
      if (authError) {
        console.error('获取所有授权记录失败:', authError)
        return { data: [], error: authError }
      }
      
      if (!authData || authData.length === 0) {
        return { data: [], error: null }
      }
      
      // 2. 获取所有相关用户
      const userIds = [...new Set(authData.map(auth => auth.user_id))]
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds)
      
      if (profilesError) {
        console.error('获取用户信息失败:', profilesError)
        return { data: [], error: profilesError }
      }
      
      // 构建用户ID到用户信息的映射
      interface ProfileMap {
        [key: string]: { id: string, email: string }
      }
      const profilesMap: ProfileMap = {}
      profilesData?.forEach(profile => {
        profilesMap[profile.id] = profile
      })
      
      // 3. 获取所有相关数智人
      const botIds = [...new Set(authData.map(auth => auth.bot_id))]
      const { data: botsData, error: botsError } = await supabase
        .from('bots')
        .select('id, name, coze_bot_id')
        .in('id', botIds)
      
      if (botsError) {
        console.error('获取数智人信息失败:', botsError)
        return { data: [], error: botsError }
      }
      
      // 构建数智人ID到数智人信息的映射
      interface BotMap {
        [key: string]: { id: string, name: string, coze_bot_id: string }
      }
      const botsMap: BotMap = {}
      botsData?.forEach(bot => {
        botsMap[bot.id] = bot
      })
      
      // 4. 组合数据
      const combinedData = authData.map(auth => ({
        ...auth,
        profiles: profilesMap[auth.user_id] || { id: auth.user_id, email: '未知用户' },
        bots: botsMap[auth.bot_id] || { id: auth.bot_id, name: '未知数智人', coze_bot_id: '' }
      }))
      
      return { data: combinedData, error: null }
    } catch (err) {
      console.error('获取所有授权记录出错:', err)
      return { data: [], error: err }
    }
  },
  
  // 授权用户使用数智人
  async authorizeUserBot(userId: string, botId: string) {
    const { supabase } = useSupabase()
    
    try {
      const { data, error } = await supabase
        .from('bot_authorizations')
        .insert([
          { user_id: userId, bot_id: botId }
        ])
        .select()
      
      if (error) {
        console.error('授权用户使用数智人失败:', error)
        return { data: null, error }
      }
      
      return { data: data[0], error: null }
    } catch (err) {
      console.error('授权用户使用数智人出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 取消用户使用数智人的授权
  async revokeUserBot(authorizationId: string) {
    const { supabase } = useSupabase()
    
    try {
      const { error } = await supabase
        .from('bot_authorizations')
        .delete()
        .eq('id', authorizationId)
      
      if (error) {
        console.error('取消用户数智人授权失败:', error)
        return { error }
      }
      
      return { error: null }
    } catch (err) {
      console.error('取消用户数智人授权出错:', err)
      return { error: err }
    }
  },
  
  // 检查用户是否有权使用特定数智人
  async checkUserBotAuthorization(userId: string, botId: string) {
    const { supabase } = useSupabase()
    
    try {
      // 首先检查该数智人是否为公开的
      const { data: botData, error: botError } = await supabase
        .from('bots')
        .select('is_public')
        .eq('id', botId)
        .single()
      
      if (botError) {
        console.error('检查数智人公开状态失败:', botError)
        return { isAuthorized: false, error: botError }
      }
      
      // 如果数智人是公开的，任何用户都可以使用
      if (botData && botData.is_public) {
        return { isAuthorized: true, error: null }
      }
      
      // 如果不是公开的，检查用户是否有特定授权
      const { data, error } = await supabase
        .from('bot_authorizations')
        .select('id')
        .eq('user_id', userId)
        .eq('bot_id', botId)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 是没有找到记录的错误
        console.error('检查用户数智人授权失败:', error)
        return { isAuthorized: false, error }
      }
      
      // 如果找到授权记录，则用户有权使用该数智人
      return { isAuthorized: !!data, error: null }
    } catch (err) {
      console.error('检查用户数智人授权出错:', err)
      return { isAuthorized: false, error: err }
    }
  }
} 