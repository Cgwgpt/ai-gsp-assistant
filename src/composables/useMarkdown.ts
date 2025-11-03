import { marked } from 'marked'
import hljs from 'highlight.js'

// 配置marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('代码高亮错误:', err)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true, // 支持GitHub风格的换行
  gfm: true, // 启用GitHub风格的Markdown
})

/**
 * 渲染Markdown文本为HTML
 * @param content Markdown文本
 * @returns 渲染后的HTML字符串
 */
export function renderMarkdown(content: string): string {
  if (!content) return ''
  
  try {
    return marked(content) as string
  } catch (error) {
    console.error('Markdown解析错误:', error)
    // 如果解析失败，返回原始文本（已进行HTML转义）
    return escapeHtml(content)
  }
}

/**
 * HTML转义函数，防止XSS攻击
 * @param text 需要转义的文本
 * @returns 转义后的文本
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * 解析卡片类型响应
 * @param content 可能包含卡片JSON的字符串
 * @returns 格式化后的Markdown字符串
 */
export function parseCardResponse(content: string): string {
  if (!content) return ''
  
  try {
    // 尝试解析为JSON，检查是否是卡片类型响应
    const parsed = JSON.parse(content)
    
    // 检查是否是卡片类型响应
    if (parsed.response_type === 'card' || parsed.card_type !== undefined) {
      let cardContent = ''
      
      // 解析data字段（可能是JSON字符串）
      let cardData
      if (typeof parsed.data === 'string') {
        try {
          cardData = JSON.parse(parsed.data)
        } catch (e) {
          console.warn('解析卡片data失败:', e)
          return content // 返回原始内容
        }
      } else {
        cardData = parsed.data
      }
      
      // 提取变量中的数据数组
      if (cardData && cardData.variables) {
        const variables = cardData.variables
        // 查找包含数组数据的变量
        for (const key in variables) {
          const variable = variables[key]
          if (Array.isArray(variable.defaultValue) && variable.defaultValue.length > 0) {
            const items = variable.defaultValue
            
            // 格式化每个项目
            items.forEach((item: any, index: number) => {
              const num = item.index || (index + 1)
              const title = item.title || '无标题'
              const con = item.con || item.content || ''
              const link = item.link || ''
              
              cardContent += `### ${num}. ${title}\n\n`
              
              // 处理内容，清理多余的换行
              const cleanContent = con
                .replace(/\n{3,}/g, '\n\n') // 合并多个连续换行
                .trim()
              
              cardContent += `${cleanContent}\n\n`
              
              // 如果有链接，添加链接
              if (link) {
                cardContent += `[查看详情](${link})\n\n`
              }
              
              cardContent += '---\n\n'
            })
          }
        }
      }
      
      // 如果成功解析了卡片内容，返回格式化后的内容
      if (cardContent) {
        return cardContent.trim()
      }
    }
    
    // 如果不是卡片类型或解析失败，返回原始内容
    return content
  } catch (e) {
    // 如果不是JSON格式，检查是否包含卡片类型的特征
    if (content.includes('"card_type"') || content.includes('"response_type":"card"')) {
      // 尝试提取JSON部分
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return parseCardResponse(jsonMatch[0])
        }
      } catch (err) {
        console.warn('尝试提取卡片JSON失败:', err)
      }
    }
    
    // 解析失败，返回原始内容
    return content
  }
}

/**
 * 渲染消息内容（支持卡片类型）
 * @param content 消息内容
 * @returns 渲染后的HTML字符串
 */
export function renderMessageContent(content: string): string {
  if (!content) return ''
  
  // 先尝试解析卡片类型响应
  const parsedContent = parseCardResponse(content)
  
  // 如果是卡片内容，直接渲染Markdown
  if (parsedContent !== content) {
    return renderMarkdown(parsedContent)
  }
  
  // 如果不是卡片类型，检查是否是JSON格式的纯文本
  try {
    const parsed = JSON.parse(content)
    // 如果是JSON对象但不是卡片类型，格式化为代码块显示
    return renderMarkdown('```json\n' + JSON.stringify(parsed, null, 2) + '\n```')
  } catch (e) {
    // 不是JSON，正常渲染Markdown
    return renderMarkdown(content)
  }
}

/**
 * 用于Vue组件的composable
 */
export function useMarkdown() {
  return {
    renderMarkdown,
    parseCardResponse,
    renderMessageContent
  }
}

