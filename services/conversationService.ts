import { useSupabase } from '../composables/useSupabase'
import { usageService } from './usageService'

export interface Message {
  id?: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  tokens?: number
  timestamp: string
}

export interface Conversation {
  id?: string
  title: string
  bot_id: string
  user_id?: string
  is_archived?: boolean
  created_at?: string
  updated_at?: string
  messages?: Message[]
  coze_conversation_id?: string  // 存储Coze API返回的对话ID（整数格式）
  bot?: {
    name: string
    coze_bot_id: string
    api_key: string
  }
}

export const conversationService = {
  // 获取用户的对话列表 (从本地存储)
  async getConversations(botId?: string) {
    const { user } = useSupabase()
    
    if (!user.value) return { data: [], error: new Error('用户未登录') }
    
    try {
      // 从本地存储获取对话列表
      const localConversations = this.getLocalConversations()
      
      // 筛选未归档的对话
      let conversations = localConversations.filter((c: Conversation) => !c.is_archived)
      
      // 如果指定了数智人ID，再次筛选
      if (botId) {
        conversations = conversations.filter((c: Conversation) => c.bot_id === botId)
      }
      
      // 按更新时间排序（最新的在前）
      conversations.sort((a: Conversation, b: Conversation) => {
        const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0
        const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0
        return timeB - timeA
      })
      
      return { data: conversations, error: null }
    } catch (err) {
      console.error('获取对话列表出错:', err)
      return { data: [], error: err }
    }
  },
  
  // 获取单个对话及其消息 (从本地存储)
  async getConversation(id: string) {
    try {
      // 从本地存储获取对话列表
      const localConversations = this.getLocalConversations()
      
      // 查找指定对话
      const conversation = localConversations.find((c: Conversation) => c.id === id)
      
      if (!conversation) {
        return { error: new Error('未找到对话') }
      }
      
      // 返回对话和消息
      return { 
        conversation, 
        messages: conversation.messages || []
      }
    } catch (error) {
      console.error('获取对话失败:', error)
      return { error }
    }
  },
  
  // 创建新对话 (保存到本地存储)
  async createConversation(botId: string, title: string) {
    const { user } = useSupabase()
    
    if (!user.value) return { data: null, error: new Error('用户未登录') }
    
    try {
      console.log(`创建本地对话: 用户=${user.value.id}, 数智人=${botId}, 标题=${title}`)
      
      // 注意：配额检查和记录已在 sendMessageWithBot 中完成（原子操作）
      // 这里直接创建对话对象，不再重复检查和记录
      
      // 创建本地对话对象
      const conversationData = {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title,
        bot_id: botId,
        user_id: user.value.id,
        is_archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: []
      }
      
      return { data: conversationData, error: null }
    } catch (err) {
      console.error('创建对话出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 添加消息到对话 (保存到本地存储)
  async addMessage(conversationId: string, role: 'user' | 'assistant', content: string) {
    try {
      // 估算token数量（简单实现）
      const tokens = Math.ceil(content.length / 4)
      
      console.log(`添加本地消息: 对话=${conversationId}, 角色=${role}, 估算tokens=${tokens}`)
      
      // 创建消息对象
      const message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        conversation_id: conversationId,
        role,
        content,
        tokens,
        timestamp: new Date().toISOString()
      }
      
      // 获取本地对话列表
      const localConversations = this.getLocalConversations()
      
      // 查找指定对话
      const conversationIndex = localConversations.findIndex((c: Conversation) => c.id === conversationId)
      
      if (conversationIndex === -1) {
        return { data: null, error: new Error('未找到对话') }
      }
      
      // 更新对话
      const conversation = localConversations[conversationIndex]
      if (!conversation.messages) {
        conversation.messages = []
      }
      conversation.messages.push(message)
      conversation.updated_at = new Date().toISOString()
      
      // 保存回本地存储
      localConversations[conversationIndex] = conversation
      this.saveLocalConversation(conversation)
      
      // 如果是助手回复，记录token使用量
      if (role === 'assistant') {
        try {
          const { user } = useSupabase()
          if (user.value && conversation.bot_id) {
            // 同步记录token使用量
            try {
              const { success, error: usageError } = await usageService.recordTokenUsage(
                user.value.id, 
                conversation.bot_id, 
                tokens
              )
              
              if (usageError) {
                console.error('记录Token使用量失败:', usageError)
              } else if (!success) {
                console.warn('记录Token使用量可能未完成')
              } else {
                console.log('Token使用量记录成功')
              }
            } catch (usageErr) {
              console.error('记录Token使用量异常:', usageErr)
            }
          }
        } catch (err) {
          console.error('处理Token使用量过程出错:', err)
        }
      }
      
      return { data: message, error: null }
    } catch (err) {
      console.error('添加消息出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 更新对话标题 (本地存储)
  async updateConversationTitle(id: string, title: string) {
    try {
      // 获取本地对话列表
      const localConversations = this.getLocalConversations()
      
      // 查找指定对话
      const conversationIndex = localConversations.findIndex((c: Conversation) => c.id === id)
      
      if (conversationIndex === -1) {
        return { data: null, error: new Error('未找到对话') }
      }
      
      // 更新对话标题
      const conversation = localConversations[conversationIndex]
      conversation.title = title
      conversation.updated_at = new Date().toISOString()
      
      // 保存回本地存储
      localConversations[conversationIndex] = conversation
      this.saveLocalConversation(conversation)
      
      return { data: conversation, error: null }
    } catch (err) {
      console.error('更新对话标题出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 归档对话 (本地存储)
  async archiveConversation(id: string) {
    try {
      // 获取本地对话列表
      const localConversations = this.getLocalConversations()
      
      // 查找指定对话
      const conversationIndex = localConversations.findIndex((c: Conversation) => c.id === id)
      
      if (conversationIndex === -1) {
        return { data: null, error: new Error('未找到对话') }
      }
      
      // 更新对话为归档状态
      const conversation = localConversations[conversationIndex]
      conversation.is_archived = true
      conversation.updated_at = new Date().toISOString()
      
      // 保存回本地存储
      localConversations[conversationIndex] = conversation
      this.saveLocalConversation(conversation)
      
      return { data: conversation, error: null }
    } catch (err) {
      console.error('归档对话出错:', err)
      return { data: null, error: err }
    }
  },
  
  // 删除对话 (本地存储)
  async deleteConversation(id: string) {
    try {
      // 获取本地对话列表
      let localConversations = this.getLocalConversations()
      
      // 过滤掉要删除的对话
      localConversations = localConversations.filter((c: Conversation) => c.id !== id)
      
      // 保存回本地存储
      const { user } = useSupabase()
      const userId = user.value?.id || 'anonymous'
      const storageKey = `conversations_${userId}`
      localStorage.setItem(storageKey, JSON.stringify(localConversations))
      
      return { error: null }
    } catch (err) {
      console.error('删除对话出错:', err)
      return { error: err }
    }
  },
  
  // 从本地存储加载对话历史
  getLocalConversations() {
    try {
      const { user } = useSupabase()
      const userId = user.value?.id || 'anonymous'
      const storageKey = `conversations_${userId}`
      
      const savedConversations = localStorage.getItem(storageKey)
      if (savedConversations) {
        return JSON.parse(savedConversations)
      }
    } catch (error) {
      console.error('从本地存储加载对话历史失败:', error)
    }
    return []
  },
  
  // 保存对话历史到本地存储
  saveLocalConversation(conversation: Conversation) {
    try {
      const { user } = useSupabase()
      const userId = user.value?.id || 'anonymous'
      const storageKey = `conversations_${userId}`
      
      // 获取现有对话
      let conversations = this.getLocalConversations()
      
      // 检查是否已存在该对话
      const index = conversations.findIndex((c: Conversation) => c.id === conversation.id)
      if (index !== -1) {
        conversations[index] = conversation
      } else {
        conversations.unshift(conversation)
      }
      
      // 限制每个数智人最多保存20条对话
      const botConversations: { [key: string]: Conversation[] } = {}
      
      // 按数智人ID分组
      conversations.forEach((conv: Conversation) => {
        if (!botConversations[conv.bot_id]) {
          botConversations[conv.bot_id] = []
        }
        botConversations[conv.bot_id].push(conv)
      })
      
      // 限制每个数智人的对话记录数量
      let newConversations: Conversation[] = []
      Object.keys(botConversations).forEach(botId => {
        newConversations = newConversations.concat(botConversations[botId].slice(0, 20))
      })
      
      // 保存到本地存储，使用用户ID作为键的一部分
      localStorage.setItem(storageKey, JSON.stringify(newConversations))
      return true
    } catch (error) {
      console.error('保存对话历史到本地存储失败:', error)
      return false
    }
  }
} 