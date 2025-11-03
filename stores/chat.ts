import { defineStore } from 'pinia'
import { chatService } from '../services/chatService'
import { botService } from '../services/botService'
import { conversationService } from '../services/conversationService'
import { usageService } from '../services/usageService'
import { useSupabase } from '../composables/useSupabase'

export interface Message {
  id: string
  conversation_id?: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  tokens?: number
}

export type BotType = 'general' | 'gsp'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[],
    loading: false,
    error: null as string | null,
    conversationId: '' as string,
    currentBotId: '' as string,
    currentApiKey: '' as string,
    currentAssistantMessage: '' as string,
    streamingMessage: null as Message | null,
    botType: 'general' as BotType
  }),

  actions: {
    async sendMessageWithBot(content: string, botId: string, apiKey?: string) {
      this.loading = true
      this.error = null
      this.currentAssistantMessage = ''
      
      try {
        // 检查是否有创建新对话的权限
        if (!this.conversationId) {
          const { user } = useSupabase()
          if (user.value) {
            // 获取数智人信息
            let botDbId = ''
            const { data: bots } = await botService.getBots()
            if (bots) {
              // 使用当前的this.currentBotId（已确保是coze_bot_id）查找
              const bot = bots.find(b => b.coze_bot_id === this.currentBotId)
              if (bot && bot.id) {
                botDbId = bot.id
                
                // 检查用户配额
                const { allowed, error } = await usageService.checkConversationQuota(user.value.id, botDbId)
                if (error) {
                  console.error('检查用户对话配额失败:', error)
                  // 继续执行，但记录错误
                } else if (!allowed) {
                  this.loading = false
                  this.error = '您已达到本月对话次数限制，请联系管理员增加配额或等待下个月重置'
                  return null
                }
              }
            }
          }
        }

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
                  
                  if (errorObj.code === 4101) {
                    errorMessage = `错误: API密钥没有权限访问该数智人\n\n可能的原因:\n` +
                      `1. API密钥不正确或已过期\n` +
                      `2. 数智人ID不正确\n` +
                      `3. 该API密钥没有被授权访问此数智人\n\n` +
                      `解决方法:\n` +
                      `1. 在Coze平台验证API密钥和数智人ID\n` +
                      `2. 确保在Coze平台上已为该API密钥启用了必要的权限`
                  }
                  
                  this.streamingMessage.content = errorMessage
                  this.currentAssistantMessage = errorMessage
                  this.streamingMessage = null
                }
                
                this.loading = false
                return null
              }
            } catch (e) {
              // 如果不是完整的JSON错误响应，继续处理为SSE事件
              console.warn('解析错误响应失败，继续作为SSE事件处理:', e)
            }
          }
          
          // 解析SSE事件格式
          const events = chunk.split('\n\n')
          
          for(const event of events) {
            if(!event || !event.trim()) continue
            
            const lines = event.split('\n').filter(line => line.trim())
            if(lines.length < 1) continue
            
            // 查找event行和data行
            let eventType = ''
            let dataLine = ''
            
            for(const line of lines) {
              if(line.startsWith('event:')) {
                eventType = line.replace('event:', '').trim()
              } else if(line.startsWith('data:')) {
                dataLine = line.replace('data:', '').trim()
              }
            }
            
            // 处理done事件（可能是[done]格式）
            if(eventType === 'done' || event.trim() === '[DONE]' || event.trim().startsWith('[DONE]')) {
              console.log('解析事件: done [DONE]')
              this.loading = false
              if(this.streamingMessage) {
                this.streamingMessage = null
                this.saveConversationHistory()
              }
              break
            }
            
            // 如果缺少eventType或dataLine，跳过
            if(!eventType || !dataLine) {
              // 如果不是以event:开头的数据块，可能是其他格式，跳过
              if(!event.trim().startsWith('event:') && !event.trim().startsWith('data:')) {
                continue
              }
            }

            try {
              // 尝试解析JSON数据
              let eventData
              try {
                eventData = JSON.parse(dataLine)
              } catch (parseError) {
                // 如果解析失败，可能是非JSON格式的数据，记录并跳过
                console.warn('无法解析事件数据为JSON:', eventType, dataLine, parseError)
                continue
              }
              
              console.log('解析事件:', eventType, eventData)
              
              switch(eventType) {
                case 'conversation.chat.created':
                  this.conversationId = eventData.conversation_id
                  console.log('对话ID:', this.conversationId)
                  break
                  
                case 'conversation.chat.completed':
                  console.log('对话完成:', eventData)
                  if(eventData.conversation_id) {
                    this.conversationId = eventData.conversation_id
                  }
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
                    // 保存对话历史
                    this.saveConversationHistory()
                  }
                  break
              }
            } catch (e) {
              // 记录解析错误，但不中断流程
              console.warn('解析事件数据失败:', eventType, dataLine, e)
            }
          }
        }

        return this.currentAssistantMessage
      } catch (err) {
        console.error('发送消息失败:', err)
        
        this.loading = false
        this.error = err.message || '发送消息失败，请重试'
        
        // 如果有正在显示的流式消息，更新其内容为错误信息
        if (this.streamingMessage) {
          this.streamingMessage.content = `发送消息失败: ${err.message || '未知错误'}`
          this.streamingMessage = null
        }
        
        return null
      } finally {
        this.loading = false
      }
    },

    // 设置当前数智人
    setCurrentBot(botId: string, apiKey: string) {
      this.currentBotId = botId
      this.currentApiKey = apiKey
      this.reset()
    },
    
    // 重置聊天状态
    reset() {
      this.messages = []
      this.conversationId = ''
      this.error = null
      this.currentAssistantMessage = ''
      this.streamingMessage = null
    },
    
    // 保存对话历史
    saveConversationHistory() {
      try {
        // 如果有对话ID，尝试保存到数据库
        if (this.conversationId) {
          // 调用conversationService保存最新消息
          if (this.messages.length > 0) {
            const lastUserMsg = [...this.messages].reverse().find(m => m.role === 'user')
            const lastAssistantMsg = [...this.messages].reverse().find(m => m.role === 'assistant')
            
            if (lastUserMsg) {
              conversationService.addMessage(
                this.conversationId,
                'user',
                lastUserMsg.content
              ).catch(err => console.error('保存用户消息失败:', err))
            }
            
            if (lastAssistantMsg) {
              conversationService.addMessage(
                this.conversationId,
                'assistant',
                lastAssistantMsg.content
              ).catch(err => console.error('保存助手消息失败:', err))
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
        // 从Supabase加载对话
        const result = await conversationService.getConversation(conversationId)
        
        if (result.error) {
          console.error('加载对话失败:', result.error)
          return false
        }
        
        if (result.conversation && result.messages) {
          // 设置对话ID
          this.conversationId = conversationId
          
          // 设置消息
          this.messages = result.messages
          
          // 设置数智人ID和API Key
          if (result.conversation.bot && result.conversation.bot.coze_bot_id) {
            this.currentBotId = result.conversation.bot.coze_bot_id
            this.currentApiKey = result.conversation.bot.api_key
          }
          
          return true
        }
        
        return false
      } catch (error) {
        console.error('加载对话历史失败:', error)
        return false
      }
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
    botType: 'gsp' as BotType
  }),

  actions: {
    async sendMessage(content: string) {
      this.loading = true
      this.error = null
      this.currentAssistantMessage = ''
      
      try {
        // 检查是否有创建新对话的权限
        if (!this.conversationId) {
          const { user } = useSupabase()
          if (user.value) {
            // 使用环境变量中的GSP专用数智人ID获取数智人ID
            const botCozeId = import.meta.env.VITE_GSP_BOT_ID || import.meta.env.VITE_COZE_BOT_ID
            const { data: bots } = await botService.getBots()
            if (bots && botCozeId) {
              const bot = bots.find(b => b.coze_bot_id === botCozeId)
              if (bot && bot.id) {
                // 检查用户配额
                const { allowed, error } = await usageService.checkConversationQuota(user.value.id, bot.id)
                if (error) {
                  console.error('检查用户对话配额失败:', error)
                  // 继续执行，但记录错误
                } else if (!allowed) {
                  this.loading = false
                  this.error = '您已达到本月对话次数限制，请联系管理员增加配额或等待下个月重置'
                  return null
                }
              }
            }
          }
        }
        
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
        
        // 如果没有对话ID，创建一个新对话
        if (!this.conversationId && user.value) {
          try {
            // 生成对话标题（使用用户消息的前20个字符）
            const title = content.substring(0, 20) + (content.length > 20 ? '...' : '')
            
            // 获取数智人信息
            const { data: bots } = await botService.getBots()
            if (bots && botId) {
              const bot = bots.find(b => b.coze_bot_id === botId)
              if (bot && bot.id) {
                const { data, error } = await conversationService.createConversation(bot.id, title)
                if (!error && data) {
                  this.conversationId = data.id
                }
              }
            }
          } catch (error) {
            console.error('创建对话失败:', error)
          }
        }
        
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
                      `3. 检查环境变量中的API密钥和数智人ID设置`
                  }
                  
                  this.streamingMessage.content = errorMessage
                  this.currentAssistantMessage = errorMessage
                  this.streamingMessage = null
                }
                
                this.loading = false
                return null
              }
            } catch (e) {
              // 如果不是完整的JSON错误响应，继续处理为SSE事件
              console.warn('解析错误响应失败，继续作为SSE事件处理:', e)
            }
          }
          
          // 解析SSE事件格式
          const events = chunk.split('\n\n')
          
          for(const event of events) {
            if(!event || !event.trim()) continue
            
            const lines = event.split('\n').filter(line => line.trim())
            if(lines.length < 1) continue
            
            // 查找event行和data行
            let eventType = ''
            let dataLine = ''
            
            for(const line of lines) {
              if(line.startsWith('event:')) {
                eventType = line.replace('event:', '').trim()
              } else if(line.startsWith('data:')) {
                dataLine = line.replace('data:', '').trim()
              }
            }
            
            // 处理done事件（可能是[done]格式）
            if(eventType === 'done' || event.trim() === '[DONE]' || event.trim().startsWith('[DONE]')) {
              console.log('解析事件: done [DONE]')
              this.loading = false
              if(this.streamingMessage) {
                this.streamingMessage = null
              }
              break
            }
            
            // 如果缺少eventType或dataLine，跳过
            if(!eventType || !dataLine) {
              // 如果不是以event:开头的数据块，可能是其他格式，跳过
              if(!event.trim().startsWith('event:') && !event.trim().startsWith('data:')) {
                continue
              }
            }

            try {
              // 尝试解析JSON数据
              let eventData
              try {
                eventData = JSON.parse(dataLine)
              } catch (parseError) {
                // 如果解析失败，可能是非JSON格式的数据，记录并跳过
                console.warn('无法解析事件数据为JSON:', eventType, dataLine, parseError)
                continue
              }
              
              console.log('解析事件:', eventType, eventData)
              
              switch(eventType) {
                case 'conversation.chat.created':
                  this.conversationId = eventData.conversation_id
                  console.log('对话ID:', this.conversationId)
                  break
                  
                case 'conversation.chat.completed':
                  console.log('对话完成:', eventData)
                  if(eventData.conversation_id) {
                    this.conversationId = eventData.conversation_id
                  }
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
                    // 不需要保存GSP对话历史
                  }
                  break
              }
            } catch (e) {
              // 记录解析错误，但不中断流程
              console.warn('解析事件数据失败:', eventType, dataLine, e)
            }
          }
        }

        return this.currentAssistantMessage
      } catch (err) {
        console.error('发送消息失败:', err)
        
        this.loading = false
        this.error = err.message || '发送消息失败，请重试'
        
        // 如果有正在显示的流式消息，更新其内容为错误信息
        if (this.streamingMessage) {
          this.streamingMessage.content = `发送消息失败: ${err.message || '未知错误'}`
          this.streamingMessage = null
        }
        
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 重置GSP聊天状态
    reset() {
      this.messages = []
      this.conversationId = ''
      this.error = null
      this.currentAssistantMessage = ''
      this.streamingMessage = null
    }
  }
}) 