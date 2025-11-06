import { defineStore } from 'pinia'
import { chatService } from '@/services/chatService'
import type { BotType } from '@/services/chatService'
import { useSupabase } from '../../composables/useSupabase'
import { botService } from '../../services/botService'
import { conversationService } from '../../services/conversationService'
import type { Message, Conversation } from '../../services/conversationService'
import { usageService } from '../../services/usageService'

interface Bot {
  id?: string
  coze_bot_id: string
  name: string
  api_key: string
  type?: string
}

// 创建两个独立的store，一个用于GSP报告，一个用于普通多数智人对话
export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[],
    loading: false,
    error: null as string | null,
    conversationId: '' as string,
    currentAssistantMessage: '' as string,
    streamingMessage: null as Message | null,
    currentBotId: '' as string,
    currentApiKey: '' as string,
    botType: 'general' as BotType
  }),

  actions: {
    async sendMessage(content: string) {
      // 获取当前数智人的API Key
      let apiKey = this.currentApiKey
      if (!apiKey) {
        try {
          // 从botService获取数智人信息
          const { data } = await botService.getBots()
          if (data) {
            const currentBot = data.find(bot => bot.coze_bot_id === this.currentBotId)
            if (currentBot) {
              apiKey = currentBot.api_key
              this.currentApiKey = apiKey
            }
          }
        } catch (error) {
          console.error('获取数智人API Key失败:', error)
        }
      }
      
      return this.sendMessageWithBot(content, this.currentBotId || import.meta.env.VITE_COZE_BOT_ID, apiKey)
    },

    async sendMessageWithBot(content: string, botId: string, apiKey?: string) {
      this.loading = true
      this.error = null
      this.currentAssistantMessage = ''
      this.currentBotId = botId
      
      if (apiKey) {
        this.currentApiKey = apiKey
      } else {
        // 尝试从botService获取API Key
        try {
          const { data } = await botService.getBots()
          if (data) {
            // 检查传入的botId是否是UUID格式（Supabase的id）
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(botId);
            
            let currentBot;
            if (isUuid) {
              // 如果是UUID格式，通过id查找
              currentBot = data.find(bot => bot.id === botId);
              // 如果找到了，使用其coze_bot_id
              if (currentBot) {
                this.currentBotId = currentBot.coze_bot_id;
                console.log('检测到UUID格式的bot_id，已转换为coze_bot_id:', this.currentBotId);
              }
            } else {
              // 如果不是UUID格式，假设已经是coze_bot_id
              currentBot = data.find(bot => bot.coze_bot_id === botId);
            }
            
            if (currentBot) {
              this.currentApiKey = currentBot.api_key;
              apiKey = currentBot.api_key;
            }
          }
        } catch (error) {
          console.error('获取数智人API Key失败:', error)
        }
      }
      
      try {
        // ========== 配额检查（优先级最高，不能绕过） ==========
        // 每次发送消息前都强制检查配额（无论是否已有对话）
        const { user } = useSupabase()
        
        // 如果用户未登录，禁止发送消息
        if (!user.value) {
          this.loading = false
          this.error = '用户未登录，无法发送消息'
          return null
        }
        
        // 获取数智人信息（必须找到bot才能检查配额）
        let botDbId = ''
        const { data: bots } = await botService.getBots()
        if (!bots || bots.length === 0) {
          this.loading = false
          this.error = '无法获取数智人信息，无法发送消息'
          return null
        }
        
        // 使用当前的this.currentBotId（已确保是coze_bot_id）查找
        const bot = bots.find(b => b.coze_bot_id === this.currentBotId)
        if (!bot || !bot.id) {
          this.loading = false
          this.error = '无法找到指定的数智人，无法发送消息'
          return null
        }
        
        botDbId = bot.id
        
        // 检查用户配额（优先级最高，超过限制则禁止对话）- 这是强制检查，不能绕过
        console.log('[消息发送] 开始配额检查...')
        const { allowed, error: quotaError } = await usageService.checkConversationQuota(user.value.id, botDbId)
        console.log('[消息发送] 配额检查完成:', { allowed, quotaError, userId: user.value.id, botId: botDbId, cozeBotId: botId })
        
        // 严格检查：任何错误或不允许的情况，都立即阻止
        if (quotaError) {
          console.error('[消息发送] ❌ 配额检查失败，立即阻止消息发送')
          console.error('[消息发送] 错误详情:', quotaError)
          this.loading = false
          this.error = '检查对话配额失败，无法发送消息，请稍后重试'
          console.log('[消息发送] 已设置错误状态并返回null，错误信息:', this.error)
          // 确保返回null，阻止后续执行
          return null
        }
        
        // 严格检查：只有 allowed === true 才允许继续
        // 如果 allowed 是 false、null、undefined 或任何其他值，都禁止
        if (allowed !== true) {
          console.warn('[消息发送] ❌ 配额检查未通过，立即阻止消息发送')
          console.warn('[消息发送] allowed值:', allowed, '类型:', typeof allowed, '是否为true:', allowed === true)
          this.loading = false
          this.error = '您已达到本月对话次数限制，请联系管理员增加配额或等待下个月重置'
          console.log('[消息发送] 已设置错误状态并返回null，错误信息:', this.error)
          // 确保返回null，阻止后续执行
          return null
        }
        
        console.log('[消息发送] ✅ 配额检查通过，允许继续发送消息')
        // ========== 配额检查结束 ==========
        
        // 添加用户消息
        const userMessage: Message = {
          id: Date.now().toString(),
          conversation_id: this.conversationId,
          role: 'user',
          content,
          timestamp: new Date().toISOString()
        }
        this.messages.push(userMessage)

        // 创建一个流式消息占位并直接添加到消息列表
        const streamMsg: Message = {
          id: (Date.now() + 1).toString(),
          conversation_id: this.conversationId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString()
        }
        this.streamingMessage = streamMsg
        this.messages.push(streamMsg)

        // 如果没有对话ID，创建一个新对话
        if (!this.conversationId) {
          try {
            // 生成对话标题（使用用户消息的前20个字符）
            const title = content.substring(0, 20) + (content.length > 20 ? '...' : '')
            
            // 获取数智人信息
            let botDbId = ''
            const { data: bots } = await botService.getBots()
            if (bots) {
              // 使用当前的this.currentBotId（已确保是coze_bot_id）查找
              const bot = bots.find(b => b.coze_bot_id === this.currentBotId)
              if (bot && bot.id) {
                botDbId = bot.id
              }
            }
            
            // 如果找到了数智人，创建新对话
            if (botDbId) {
              const { data, error } = await conversationService.createConversation(botDbId, title)
              if (!error && data) {
                this.conversationId = data.id
              }
            }
          } catch (error) {
            console.error('创建对话失败:', error)
          }
        }

        // 使用this.currentBotId（已确保是coze_bot_id）发送消息
        const stream = await chatService.sendMessage(content, this.conversationId, this.currentBotId, apiKey, this.botType)
        if (!stream) throw new Error('获取响应流失败')

        const reader = stream.getReader()
        const decoder = new TextDecoder()
        
        console.log('开始读取流式响应')
        
        while(true) {
          const {done, value} = await reader.read()
          if(done) {
            console.log('流式响应读取完成')
            break
          }
          
          const chunk = decoder.decode(value, {stream: true})
          console.log('收到数据块:', chunk)
          
          // 检查是否是错误响应（必须是完整的JSON对象，且不包含SSE格式）
          const trimmedChunk = chunk.trim()
          // 确保不是SSE格式（不包含event:或data:），且是完整的JSON对象
          const isSSEFormat = trimmedChunk.includes('event:') || trimmedChunk.includes('data:')
          if (!isSSEFormat && trimmedChunk.startsWith('{') && trimmedChunk.endsWith('}') && trimmedChunk.includes('"code":') && trimmedChunk.includes('"msg":')) {
            try {
              const errorObj = JSON.parse(trimmedChunk)
              if (errorObj.code && errorObj.msg) {
                // 处理错误情况
                console.error('API返回错误:', errorObj)
                
                // 更新流式消息内容，显示错误信息
                if (this.streamingMessage) {
                  // 根据错误代码提供更具体的错误信息
                  let errorMessage = `错误: ${errorObj.msg}`
                  
                  // 针对常见错误提供更友好的中文提示
                  if (errorObj.code === 4101) {
                    errorMessage = `错误: API密钥没有权限访问该数智人\n\n可能的原因:\n` +
                      `1. API密钥不正确或已过期\n` +
                      `2. 数智人ID不正确: ${this.currentBotId}\n` +
                      `3. 该API密钥没有被授权访问此数智人\n\n` +
                      `解决方法:\n` +
                      `1. 在Coze平台验证API密钥和数智人ID\n` +
                      `2. 确保在Coze平台上已为该API密钥启用了必要的权限\n` +
                      `3. 点击界面上的"重置"按钮，重新配置数智人`
                  } else if (errorObj.code === 4102) {
                    errorMessage = `错误: 数智人资源不存在\n\n` +
                      `数智人ID "${this.currentBotId}" 不存在或已被删除\n\n` +
                      `请在Coze平台上确认正确的数智人ID，然后点击"重置"按钮重新配置`
                  } else {
                    errorMessage = `错误: ${errorObj.msg}\n\n可能的原因:\n` +
                      `1. API密钥不正确\n` +
                      `2. 数智人ID不正确\n` +
                      `3. 服务器暂时不可用\n\n` +
                      `请检查设置或稍后再试。`
                  }
                  
                  this.streamingMessage.content = errorMessage
                }
                
                // 设置错误状态
                this.error = errorObj.msg
                break
              }
            } catch (e) {
              console.error('解析错误响应失败:', e)
            }
          }
          
          const events = chunk.split('\n\n')
          
          for(const event of events) {
            if(!event) continue
            
            const lines = event.split('\n')
            if(lines.length < 2) continue
            
            const eventType = lines[0].replace('event:', '')
            const dataLine = lines[1]
            
            if(!eventType || !dataLine.startsWith('data:')) continue

            try {
              const eventData = JSON.parse(dataLine.replace('data:', ''))
              console.log('解析事件:', eventType, eventData)
              
              switch(eventType) {
                case 'conversation.chat.created':
                  // 保存Coze返回的对话ID，这是一个数字格式的ID
                  const cozeConversationId = eventData.conversation_id
                  console.log('Coze对话ID:', cozeConversationId)
                  
                  // 如果当前使用的是本地ID，我们需要创建一个映射
                  const originalId = this.conversationId
                  if (originalId && originalId.startsWith('local-')) {
                    console.log(`将本地ID ${originalId} 映射到Coze ID ${cozeConversationId}`)
                    
                    // 尝试更新本地存储中的对话，添加Coze ID
                    try {
                      const localConversations = conversationService.getLocalConversations()
                      const conversationIndex = localConversations.findIndex((c: Conversation) => c.id === originalId)
                      
                      if (conversationIndex !== -1) {
                        const conversation = localConversations[conversationIndex]
                        // 添加Coze ID引用，保留原始本地ID作为主键
                        conversation.coze_conversation_id = cozeConversationId
                        // 立即保存更新
                        conversationService.saveLocalConversation(conversation)
                        console.log('已更新本地对话，添加Coze对话ID引用')
                      }
                    } catch (err) {
                      console.error('更新本地对话添加Coze ID引用失败:', err)
                    }
                  }
                  
                  // 更新当前对话ID
                  this.conversationId = cozeConversationId
                  break
                  
                case 'conversation.message.delta':
                  if(eventData.role === 'assistant' && eventData.content) {
                    this.currentAssistantMessage += eventData.content
                    console.log('更新助手消息:', this.currentAssistantMessage)
                    if(this.streamingMessage) {
                      this.streamingMessage.content = this.currentAssistantMessage
                    }
                  }
                  break
                  
                case 'conversation.message.completed':
                  console.log('消息完成:', eventData)
                  if(eventData.type === 'answer') {
                    // 确保流式消息的内容已经正确更新
                    if(this.streamingMessage) {
                      // 如果eventData包含content，使用完整的content更新
                      if(eventData.content && eventData.content !== this.currentAssistantMessage) {
                        this.streamingMessage.content = eventData.content
                        this.currentAssistantMessage = eventData.content
                      } else {
                        // 否则使用累积的currentAssistantMessage
                        this.streamingMessage.content = this.currentAssistantMessage
                      }
                    }
                    this.streamingMessage = null
                    // 保存对话历史到本地并记录使用量
                    this.saveConversationHistory()
                  }
                  break
              }
            } catch (e) {
              console.error('解析事件数据失败:', e, dataLine)
            }
          }
        }

        return this.currentAssistantMessage

      } catch (error: any) {
        this.error = error.message || '发送消息失败'
        console.error('Chat error:', error)
        this.streamingMessage = null
        throw error
      } finally {
        this.loading = false
      }
    },

    // 保存对话历史到本地并记录使用量
    async saveConversationHistory() {
      try {
        if (this.messages.length === 0 || !this.conversationId) return

        // 获取当前数智人信息
        let botName = '未知数智人'
        let botDbId = ''
        
        try {
          const { data: bots } = await botService.getBots()
          if (bots) {
            const currentBot = bots.find(bot => bot.coze_bot_id === this.currentBotId)
            if (currentBot) {
              botName = currentBot.name
              if (currentBot.id) {
                botDbId = currentBot.id
              }
            }
          }
        } catch (error) {
          console.error('获取数智人信息失败:', error)
        }

        // 如果没有找到数智人ID，无法记录使用量
        if (!botDbId) {
          console.error('无法记录使用量：未找到数智人ID')
          return
        }

        // 生成对话标题（使用第一条用户消息的前20个字符）
        const firstUserMessage = this.messages.find(m => m.role === 'user')
        const title = firstUserMessage 
          ? firstUserMessage.content.substring(0, 20) + (firstUserMessage.content.length > 20 ? '...' : '')
          : `与${botName}的对话`

        // 创建对话历史记录
        const conversation: Conversation = {
          id: this.conversationId,
          bot_id: botDbId,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_archived: false,
          messages: [...this.messages]
        }

        // 如果this.conversationId是数字格式，同时保存为coze_conversation_id
        if (this.conversationId && /^\d+$/.test(this.conversationId)) {
          conversation.coze_conversation_id = this.conversationId;
        }

        // 保存到本地存储
        conversationService.saveLocalConversation(conversation)

        // 仅用于统计使用量，不存储对话内容
        if (this.conversationId) {
          // 获取最新的助手回复以估算token
          const assistantMsg = this.messages[this.messages.length - 1]
          
          if (assistantMsg && assistantMsg.role === 'assistant') {
            try {
              // 估算token数量（简单实现）
              const tokens = Math.ceil(assistantMsg.content.length / 4)
              
              // 获取用户信息
              const { user } = useSupabase()
              if (user.value) {
                // 记录token使用量
                await usageService.recordTokenUsage(
                  user.value.id,
                  botDbId,
                  tokens
                ).catch(err => console.error('记录Token使用量失败:', err))
              }
            } catch (err) {
              console.error('处理Token使用量过程出错:', err)
            }
          }
        }
      } catch (error) {
        console.error('保存对话历史失败:', error)
      }
    },

    // 加载对话历史
    async loadConversationHistory(conversationId: string) {
      try {
        // 从本地存储加载对话
        const localConversations = conversationService.getLocalConversations()
        const conversation = localConversations.find((c: Conversation) => c.id === conversationId)
        
        if (!conversation) {
          console.error('本地未找到对话:', conversationId)
          return false
        }
        
        // 设置对话ID
        this.conversationId = conversationId
        
        // 设置对话ID - 优先使用Coze的对话ID
        if (conversation.coze_conversation_id) {
          console.log(`使用Coze对话ID: ${conversation.coze_conversation_id}，本地ID: ${conversationId}`)
          this.conversationId = conversation.coze_conversation_id
        } else {
          this.conversationId = conversationId
        }
        
        // 设置消息
        if (conversation.messages) {
          this.messages = conversation.messages
        } else {
          this.messages = []
        }
        
        // 尝试获取数智人信息
        if (conversation.bot_id) {
          try {
            const { data: bots } = await botService.getBots()
            if (bots) {
              const bot = bots.find(b => b.id === conversation.bot_id)
              if (bot) {
                this.currentBotId = bot.coze_bot_id
                this.currentApiKey = bot.api_key
              }
            }
          } catch (err) {
            console.error('获取数智人信息失败:', err)
          }
        }
        
        return true
      } catch (error) {
        console.error('加载对话历史失败:', error)
        return false
      }
    },

    reset() {
      this.messages = []
      this.loading = false
      this.error = null
      this.conversationId = ''
      this.streamingMessage = null
      this.currentAssistantMessage = ''
    },
    
    setBotType(type: BotType) {
      this.botType = type
    },
    
    // 设置当前数智人
    setBot(botId: string, apiKey: string, botType?: string) {
      this.currentBotId = botId
      this.currentApiKey = apiKey
      if (botType) {
        this.botType = botType as BotType
      }
      // 切换数智人时重置对话
      this.reset()
    }
  }
})

// 创建GSP报告专用的store
export const useGspChatStore = defineStore('gspChat', {
  state: () => ({
    messages: [] as Message[],
    loading: false,
    error: null as string | null,
    conversationId: '' as string,
    currentAssistantMessage: '' as string,
    streamingMessage: null as Message | null,
    botType: 'gsp' as BotType,
    currentBotId: '' as string,
    currentApiKey: '' as string
  }),

  actions: {
    async sendMessage(content: string) {
      this.loading = true
      this.error = null
      this.currentAssistantMessage = ''
      
      try {
        // ========== 配额检查（优先级最高，不能绕过） ==========
        // 每次发送消息前都强制检查配额（无论是否已有对话）
        const { user } = useSupabase()
        
        // 如果用户未登录，禁止发送消息
        if (!user.value) {
          this.loading = false
          this.error = '用户未登录，无法发送消息'
          return null
        }
        
        // 使用环境变量中的GSP专用数智人ID获取数智人ID
        const botCozeId = import.meta.env.VITE_GSP_BOT_ID || import.meta.env.VITE_COZE_BOT_ID
        if (!botCozeId) {
          this.loading = false
          this.error = '无法获取数智人ID，无法发送消息'
          return null
        }
        
        // 获取数智人信息（必须找到bot才能检查配额）
        const { data: bots } = await botService.getBots()
        if (!bots || bots.length === 0) {
          this.loading = false
          this.error = '无法获取数智人信息，无法发送消息'
          return null
        }
        
        const bot = bots.find(b => b.coze_bot_id === botCozeId)
        if (!bot || !bot.id) {
          this.loading = false
          this.error = '无法找到指定的数智人，无法发送消息'
          return null
        }
        
        // 检查用户配额（优先级最高，超过限制则禁止对话）- 这是强制检查，不能绕过
        console.log('[GSP消息发送] 开始配额检查...')
        const { allowed, error: quotaError } = await usageService.checkConversationQuota(user.value.id, bot.id)
        console.log('[GSP消息发送] 配额检查完成:', { allowed, quotaError, userId: user.value.id, botId: bot.id, cozeBotId: botCozeId })
        
        // 严格检查：任何错误或不允许的情况，都立即阻止
        if (quotaError) {
          console.error('[GSP消息发送] ❌ 配额检查失败，立即阻止消息发送')
          console.error('[GSP消息发送] 错误详情:', quotaError)
          this.loading = false
          this.error = '检查对话配额失败，无法发送消息，请稍后重试'
          console.log('[GSP消息发送] 已设置错误状态并返回null，错误信息:', this.error)
          // 确保返回null，阻止后续执行
          return null
        }
        
        // 严格检查：只有 allowed === true 才允许继续
        // 如果 allowed 是 false、null、undefined 或任何其他值，都禁止
        if (allowed !== true) {
          console.warn('[GSP消息发送] ❌ 配额检查未通过，立即阻止消息发送')
          console.warn('[GSP消息发送] allowed值:', allowed, '类型:', typeof allowed, '是否为true:', allowed === true)
          this.loading = false
          this.error = '您已达到本月对话次数限制，请联系管理员增加配额或等待下个月重置'
          console.log('[GSP消息发送] 已设置错误状态并返回null，错误信息:', this.error)
          // 确保返回null，阻止后续执行
          return null
        }
        
        console.log('[GSP消息发送] ✅ 配额检查通过，允许继续发送消息')
        // ========== 配额检查结束 ==========
        
        // 添加用户消息
        this.messages.push({
          id: Date.now().toString(),
          conversation_id: this.conversationId,
          role: 'user',
          content,
          timestamp: new Date().toISOString()
        })

        // 创建一个流式消息占位并直接添加到消息列表
        const streamMsg: Message = {
          id: (Date.now() + 1).toString(),
          conversation_id: this.conversationId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString()
        }
        this.streamingMessage = streamMsg
        this.messages.push(streamMsg)

        // 使用环境变量中的GSP专用数智人ID和API Key
        const botId = import.meta.env.VITE_GSP_BOT_ID || import.meta.env.VITE_COZE_BOT_ID
        const apiKey = import.meta.env.VITE_COZE_API_KEY
        
        // 设置当前数智人ID，以便记录使用量时能找到数智人
        this.currentBotId = botId || ''
        this.currentApiKey = apiKey || ''
        
        const stream = await chatService.sendMessage(content, this.conversationId, botId, apiKey, this.botType)
        if (!stream) throw new Error('获取响应流失败')

        const reader = stream.getReader()
        const decoder = new TextDecoder()
        
        while(true) {
          const {done, value} = await reader.read()
          if(done) break
          
          const chunk = decoder.decode(value, {stream: true})
          
          // 检查是否是错误响应（必须是完整的JSON对象，且不包含SSE格式）
          const trimmedChunk = chunk.trim()
          // 确保不是SSE格式（不包含event:或data:），且是完整的JSON对象
          const isSSEFormat = trimmedChunk.includes('event:') || trimmedChunk.includes('data:')
          if (!isSSEFormat && trimmedChunk.startsWith('{') && trimmedChunk.endsWith('}') && trimmedChunk.includes('"code":') && trimmedChunk.includes('"msg":')) {
            try {
              const errorObj = JSON.parse(trimmedChunk)
              if (errorObj.code && errorObj.msg) {
                // 处理错误情况
                console.error('API返回错误:', errorObj)
                
                // 更新流式消息内容，显示错误信息
                if (this.streamingMessage) {
                  // 根据错误代码提供更具体的错误信息
                  let errorMessage = `错误: ${errorObj.msg}`
                  
                  // 针对常见错误提供更友好的中文提示
                  if (errorObj.code === 4101) {
                    const botIdUsed = botId || import.meta.env.VITE_GSP_BOT_ID || import.meta.env.VITE_COZE_BOT_ID;
                    errorMessage = `错误: API密钥没有权限访问该数智人\n\n可能的原因:\n` +
                      `1. API密钥不正确或已过期\n` +
                      `2. 数智人ID不正确: ${botIdUsed}\n` +
                      `3. 该API密钥没有被授权访问此数智人\n\n` +
                      `解决方法:\n` +
                      `1. 在Coze平台验证API密钥和数智人ID\n` +
                      `2. 确保在Coze平台上已为该API密钥启用了必要的权限\n` +
                      `3. 点击界面上的"重置"按钮，重新配置数智人`
                  } else if (errorObj.code === 4102) {
                    errorMessage = `错误: 数智人资源不存在\n\n` +
                      `数智人ID "${botId}" 不存在或已被删除\n\n` +
                      `请在Coze平台上确认正确的数智人ID，然后点击"重置"按钮重新配置`
                  } else {
                    errorMessage = `错误: ${errorObj.msg}\n\n可能的原因:\n` +
                      `1. API密钥不正确\n` +
                      `2. 数智人ID不正确\n` +
                      `3. 服务器暂时不可用\n\n` +
                      `请检查设置或稍后再试。`
                  }
                  
                  this.streamingMessage.content = errorMessage
                }
                
                // 设置错误状态
                this.error = errorObj.msg
                break
              }
            } catch (e) {
              console.error('解析错误响应失败:', e)
            }
          }
          
          const events = chunk.split('\n\n')
          
          for(const event of events) {
            if(!event) continue
            
            const lines = event.split('\n')
            if(lines.length < 2) continue
            
            const eventType = lines[0].replace('event:', '')
            const dataLine = lines[1]
            
            if(!eventType || !dataLine.startsWith('data:')) continue

            try {
              const eventData = JSON.parse(dataLine.replace('data:', ''))
              console.log('解析事件:', eventType, eventData)
              
              switch(eventType) {
                case 'conversation.chat.created':
                  this.conversationId = eventData.conversation_id
                  console.log('对话ID:', this.conversationId)
                  break
                  
                case 'conversation.message.delta':
                  if(eventData.role === 'assistant' && eventData.content) {
                    this.currentAssistantMessage += eventData.content
                    console.log('更新助手消息:', this.currentAssistantMessage)
                    if(this.streamingMessage) {
                      this.streamingMessage.content = this.currentAssistantMessage
                    }
                  }
                  break
                  
                case 'conversation.message.completed':
                  console.log('消息完成:', eventData)
                  if(eventData.type === 'answer') {
                    // 确保流式消息的内容已经正确更新
                    if(this.streamingMessage) {
                      // 如果eventData包含content，使用完整的content更新
                      if(eventData.content && eventData.content !== this.currentAssistantMessage) {
                        this.streamingMessage.content = eventData.content
                        this.currentAssistantMessage = eventData.content
                      } else {
                        // 否则使用累积的currentAssistantMessage
                        this.streamingMessage.content = this.currentAssistantMessage
                      }
                    }
                    this.streamingMessage = null
                    // 保存对话历史到本地并记录使用量
                    this.saveConversationHistory()
                  }
                  break
              }
            } catch (e) {
              console.error('解析事件数据失败:', e, dataLine)
            }
          }
        }

        return this.currentAssistantMessage

      } catch (error: any) {
        this.error = error.message || '发送消息失败'
        console.error('Chat error:', error)
        this.streamingMessage = null
        throw error
      } finally {
        this.loading = false
      }
    },

    // 保存对话历史到本地并记录使用量
    async saveConversationHistory() {
      try {
        if (this.messages.length === 0 || !this.conversationId) return

        // 获取当前数智人信息
        let botName = '未知数智人'
        let botDbId = ''
        
        try {
          const { data: bots } = await botService.getBots()
          if (bots) {
            const currentBot = bots.find(bot => bot.coze_bot_id === this.currentBotId)
            if (currentBot) {
              botName = currentBot.name
              if (currentBot.id) {
                botDbId = currentBot.id
              }
            }
          }
        } catch (error) {
          console.error('获取数智人信息失败:', error)
        }

        // 如果没有找到数智人ID，无法记录使用量
        if (!botDbId) {
          console.error('无法记录使用量：未找到数智人ID')
          return
        }

        // 生成对话标题（使用第一条用户消息的前20个字符）
        const firstUserMessage = this.messages.find(m => m.role === 'user')
        const title = firstUserMessage 
          ? firstUserMessage.content.substring(0, 20) + (firstUserMessage.content.length > 20 ? '...' : '')
          : `与${botName}的对话`

        // 创建对话历史记录
        const conversation: Conversation = {
          id: this.conversationId,
          bot_id: botDbId,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_archived: false,
          messages: [...this.messages]
        }

        // 如果this.conversationId是数字格式，同时保存为coze_conversation_id
        if (this.conversationId && /^\d+$/.test(this.conversationId)) {
          conversation.coze_conversation_id = this.conversationId;
        }

        // 保存到本地存储
        conversationService.saveLocalConversation(conversation)

        // 仅用于统计使用量，不存储对话内容
        if (this.conversationId) {
          // 获取最新的助手回复以估算token
          const assistantMsg = this.messages[this.messages.length - 1]
          
          if (assistantMsg && assistantMsg.role === 'assistant') {
            try {
              // 估算token数量（简单实现）
              const tokens = Math.ceil(assistantMsg.content.length / 4)
              
              // 获取用户信息
              const { user } = useSupabase()
              if (user.value) {
                // 记录token使用量
                await usageService.recordTokenUsage(
                  user.value.id,
                  botDbId,
                  tokens
                ).catch(err => console.error('记录Token使用量失败:', err))
              }
            } catch (err) {
              console.error('处理Token使用量过程出错:', err)
            }
          }
        }
      } catch (error) {
        console.error('保存对话历史失败:', error)
      }
    },

    // 加载对话历史
    async loadConversationHistory(conversationId: string) {
      try {
        // 从本地存储加载对话
        const localConversations = conversationService.getLocalConversations()
        const conversation = localConversations.find((c: Conversation) => c.id === conversationId)
        
        if (!conversation) {
          console.error('本地未找到对话:', conversationId)
          return false
        }
        
        // 设置对话ID
        this.conversationId = conversationId
        
        // 设置对话ID - 优先使用Coze的对话ID
        if (conversation.coze_conversation_id) {
          console.log(`使用Coze对话ID: ${conversation.coze_conversation_id}，本地ID: ${conversationId}`)
          this.conversationId = conversation.coze_conversation_id
        } else {
          this.conversationId = conversationId
        }
        
        // 设置消息
        if (conversation.messages) {
          this.messages = conversation.messages
        } else {
          this.messages = []
        }
        
        // 尝试获取数智人信息
        if (conversation.bot_id) {
          try {
            const { data: bots } = await botService.getBots()
            if (bots) {
              const bot = bots.find(b => b.id === conversation.bot_id)
              if (bot) {
                this.currentBotId = bot.coze_bot_id
                this.currentApiKey = bot.api_key
              }
            }
          } catch (err) {
            console.error('获取数智人信息失败:', err)
          }
        }
        
        return true
      } catch (error) {
        console.error('加载对话历史失败:', error)
        return false
      }
    },

    reset() {
      this.messages = []
      this.loading = false
      this.error = null
      this.conversationId = ''
      this.streamingMessage = null
      this.currentAssistantMessage = ''
    },
    
    setBotType(type: BotType) {
      this.botType = type
    },
    
    // 设置当前数智人
    setBot(botId: string, apiKey: string, botType?: string) {
      this.currentBotId = botId
      this.currentApiKey = apiKey
      if (botType) {
        this.botType = botType as BotType
      }
      // 切换数智人时重置对话
      this.reset()
    }
  }
})
