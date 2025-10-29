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
 * 用于Vue组件的composable
 */
export function useMarkdown() {
  return {
    renderMarkdown
  }
}

