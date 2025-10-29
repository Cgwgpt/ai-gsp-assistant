import http from '@/utils/http'

export interface ChatMessage {
  role: string
  content: string
  timestamp: string
  content_type?: string
}

export interface ChatResponse {
  conversation_id: string
  messages: ChatMessage[]
}

interface ChatRequest {
  bot_id: string
  user_id: string
  stream: boolean
  auto_save_history: boolean
  additional_messages: {
    role: string
    content: string
    content_type: string
  }[]
}

// 修改API URL，Coze的正确API域名
const COZE_API_URL = 'https://api.coze.cn/v3/chat'

// 定义数智人类型
export type BotType = 'gsp' | 'general'

export const chatService = {
  async sendMessage(message: string, conversationId?: string, botId?: string, apiKey?: string, botType: BotType = 'general') {
    // 检查API密钥是否存在
    if (!apiKey) {
      throw new Error('必须提供API密钥，且必须与数智人ID匹配')
    }
    
    // 验证API密钥格式
    if (!apiKey.startsWith('pat_')) {
      throw new Error('API密钥格式不正确，必须以pat_开头')
    }
    
    const request: ChatRequest = {
      bot_id: botId || import.meta.env.VITE_COZE_BOT_ID,
      user_id: 'default_user',
      stream: true,
      auto_save_history: true,
      additional_messages: [
        {
          role: 'user',
          content: message,
          content_type: 'text'
        }
      ]
    }

    // 添加备用API域名
    const apiUrls = [
      COZE_API_URL,
      'https://api.coze.cn/v3/chat',
      'https://api.coze.io/v3/chat',
      'https://api-cn.coze.com/v3/chat' // 中国区域可能使用此域名
    ];
    
    // 记录尝试的API URL
    console.log('尝试发送请求到多个可能的API URL')
    console.log('请求数据:', JSON.stringify(request))
    console.log('使用的API Key:', apiKey ? '已提供' : '未提供')
    console.log('使用的Bot ID:', botId || import.meta.env.VITE_COZE_BOT_ID)
    
    let lastError = null;
    
    // 检查conversationId是否为有效的Coze对话ID（应该是数字）
    const isValidCozeId = conversationId && /^\d+$/.test(conversationId);
    
    // 如果不是有效的Coze对话ID（如本地ID格式），不传递conversation_id参数
    if (conversationId && !isValidCozeId) {
      console.log(`检测到非数字格式的conversationId: ${conversationId}，API请求将创建新对话`);
    }
    
    // 依次尝试所有API URL
    for (const apiUrl of apiUrls) {
      // 只有在conversationId为数字格式时才添加到URL
      const url = (isValidCozeId) ? `${apiUrl}?conversation_id=${conversationId}` : apiUrl;
      console.log('尝试API URL:', url);
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(request)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`API请求失败 (${apiUrl}):`, response.status, errorText);
          
          // 尝试解析错误响应
          try {
            // 检查是否包含JSON格式的错误信息
            if (errorText.includes('{') && errorText.includes('}')) {
              const errorJson = JSON.parse(errorText);
              if (errorJson.msg) {
                // 特别处理token错误
                if (errorJson.msg.includes('token') && errorJson.msg.includes('incorrect')) {
                  lastError = new Error('The token you entered is incorrect. Please double-check and try again. For more information, refer to https://www.coze.com/docs/developer_guides/authentication');
                } else {
                  lastError = new Error(`API请求失败: ${response.status} - ${errorJson.msg}`);
                }
              } else {
                lastError = new Error(`API请求失败: ${response.status} - ${errorText}`);
              }
            } else {
              lastError = new Error(`API请求失败: ${response.status} - ${errorText}`);
            }
          } catch (parseError) {
            // 如果无法解析JSON，就使用原始错误文本
            lastError = new Error(`API请求失败: ${response.status} - ${errorText}`);
          }
          
          continue; // 尝试下一个URL
        }
        
        console.log(`API请求成功 (${apiUrl})，返回流式响应`);
        return response.body;
      } catch (error) {
        console.warn(`发送消息至 ${apiUrl} 时出错:`, error);
        lastError = error;
        // 继续尝试下一个URL
      }
    }
    
    // 如果所有URL都失败，抛出最后一个错误
    console.error('所有API URL都请求失败，最后错误:', lastError);
    throw lastError || new Error('所有API URL请求均失败');
  }
} 