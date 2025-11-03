import { useSupabase } from '../composables/useSupabase'

export interface Prompt {
  id?: string
  title: string
  content: string
  bot_id?: string
  user_id?: string
  is_public?: boolean
  created_at?: string
  updated_at?: string
}

export const promptService = {
  // 获取提示词列表
  async getPrompts(botId?: string, includePublic = true) {
    const { supabase, user } = useSupabase()
    
    try {
      let query = supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })
      
      // 构建权限查询条件（用户权限和公开性）
      let userOrConditions: string[] = []
      
      // 如果用户已登录
      if (user.value) {
        if (includePublic) {
          // 用户可以看到自己的提示词和公开的提示词
          userOrConditions.push(`user_id.eq.${user.value.id}`)
          userOrConditions.push('is_public.eq.true')
        } else {
          // 只看自己的提示词
          query = query.eq('user_id', user.value.id)
        }
      } else if (includePublic) {
        // 未登录用户只能看公开的提示词
        query = query.eq('is_public', true)
      }
      
      // 应用用户权限OR条件
      if (userOrConditions.length > 0) {
        query = query.or(userOrConditions.join(','))
      }
      
      // 如果指定了数智人ID，筛选该数智人的提示词（包括null，即通用的提示词）
      // 注意：这里需要与前面的条件组合，使用AND逻辑
      if (botId) {
        // 先过滤出有权限查看的提示词，然后再筛选数智人
        // 由于Supabase的限制，我们需要在客户端过滤或使用更复杂的查询
        // 这里先获取所有有权限的提示词，然后在客户端过滤数智人
        // 或者使用更精细的查询逻辑
        const { data: allPrompts, error: queryError } = await query
        
        if (queryError) {
          return { data: [], error: queryError }
        }
        
        // 在客户端过滤：属于该数智人或通用的提示词（bot_id为null）
        const filteredPrompts = (allPrompts || []).filter((p: any) => 
          !p.bot_id || p.bot_id === botId
        )
        
        return { data: filteredPrompts, error: null }
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('获取提示词列表失败:', error)
        return { data: [], error }
      }
      
      return { data: data || [], error: null }
    } catch (err) {
      console.error('获取提示词列表出错:', err)
      return { data: [], error: err }
    }
  },
  
  // 获取单条提示词
  async getPrompt(id: string) {
    const { supabase } = useSupabase()
    
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('获取提示词失败:', error)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('获取提示词出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 创建提示词
  async createPrompt(promptData: Prompt) {
    const { supabase, user } = useSupabase()
    
    if (!user.value) {
      return { data: null, error: new Error('用户未登录') }
    }
    
    try {
      const newPrompt = {
        title: promptData.title,
        content: promptData.content,
        bot_id: promptData.bot_id || null,
        user_id: user.value.id,
        is_public: promptData.is_public !== undefined ? promptData.is_public : false
      }
      
      const { data, error } = await supabase
        .from('prompts')
        .insert([newPrompt])
        .select()
        .single()
      
      if (error) {
        console.error('创建提示词失败:', error)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('创建提示词出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 更新提示词
  async updatePrompt(id: string, promptData: Partial<Prompt>) {
    const { supabase } = useSupabase()
    
    try {
      const updateData: any = {
        title: promptData.title,
        content: promptData.content,
        updated_at: new Date().toISOString()
      }
      
      if (promptData.bot_id !== undefined) {
        updateData.bot_id = promptData.bot_id
      }
      
      if (promptData.is_public !== undefined) {
        updateData.is_public = promptData.is_public
      }
      
      const { data, error } = await supabase
        .from('prompts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('更新提示词失败:', error)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('更新提示词出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 删除提示词
  async deletePrompt(id: string) {
    const { supabase } = useSupabase()
    
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('删除提示词失败:', error)
        return { error }
      }
      
      return { error: null }
    } catch (err) {
      console.error('删除提示词出错:', err)
      return { error: err }
    }
  }
}

