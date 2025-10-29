import { ref, onUnmounted } from 'vue'

// 语音播报状态
export type SpeechStatus = 'idle' | 'playing' | 'paused'

/**
 * 语音播报 Composable
 * 使用 Web Speech API 实现文字转语音功能
 */
export function useSpeech() {
  const status = ref<SpeechStatus>('idle')
  const currentUtterance = ref<SpeechSynthesisUtterance | null>(null)
  const isSupported = ref(false)

  // 检查浏览器是否支持语音合成
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    isSupported.value = true
  }

  /**
   * 播放语音
   * @param text 要播放的文本内容
   */
  const speak = (text: string) => {
    if (!isSupported.value) {
      alert('您的浏览器不支持语音播报功能')
      return
    }

    // 如果正在播放，先停止
    if (status.value === 'playing') {
      stop()
    }

    // 清理文本中的Markdown语法和HTML标签
    const cleanText = cleanMarkdown(text)

    if (!cleanText.trim()) {
      alert('没有可播放的内容')
      return
    }

    // 创建语音合成实例
    const utterance = new SpeechSynthesisUtterance(cleanText)
    currentUtterance.value = utterance

    // 设置语音参数
    utterance.rate = 1.0 // 语速 (0.1 - 10)
    utterance.pitch = 1.0 // 音调 (0 - 2)
    utterance.volume = 1.0 // 音量 (0 - 1)
    utterance.lang = 'zh-CN' // 设置为中文

    // 监听事件
    utterance.onstart = () => {
      status.value = 'playing'
    }

    utterance.onend = () => {
      status.value = 'idle'
      currentUtterance.value = null
    }

    utterance.onerror = (event) => {
      console.error('语音播报错误:', event)
      status.value = 'idle'
      currentUtterance.value = null
    }

    // 开始播放
    window.speechSynthesis.speak(utterance)
  }

  /**
   * 暂停播放
   */
  const pause = () => {
    if (!isSupported.value) return

    if (status.value === 'playing') {
      window.speechSynthesis.pause()
      status.value = 'paused'
    }
  }

  /**
   * 恢复播放
   */
  const resume = () => {
    if (!isSupported.value) return

    if (status.value === 'paused') {
      window.speechSynthesis.resume()
      status.value = 'playing'
    }
  }

  /**
   * 停止播放
   */
  const stop = () => {
    if (!isSupported.value) return

    window.speechSynthesis.cancel()
    status.value = 'idle'
    currentUtterance.value = null
  }

  /**
   * 切换播放/暂停
   */
  const toggle = (text: string) => {
    if (status.value === 'idle') {
      speak(text)
    } else if (status.value === 'playing') {
      pause()
    } else if (status.value === 'paused') {
      resume()
    }
  }

  /**
   * 清理 Markdown 语法和 HTML 标签
   * @param text 原始文本
   * @returns 清理后的纯文本
   */
  const cleanMarkdown = (text: string): string => {
    let cleaned = text

    // 移除代码块
    cleaned = cleaned.replace(/```[\s\S]*?```/g, ' 代码块 ')
    cleaned = cleaned.replace(/`[^`]+`/g, ' ')

    // 移除 Markdown 链接，保留链接文字
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

    // 移除图片
    cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '')

    // 移除标题标记
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '')

    // 移除粗体和斜体标记
    cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2')
    cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2')

    // 移除删除线
    cleaned = cleaned.replace(/~~(.*?)~~/g, '$1')

    // 移除列表标记
    cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '')
    cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '')

    // 移除引用标记
    cleaned = cleaned.replace(/^\s*>\s+/gm, '')

    // 移除分隔线
    cleaned = cleaned.replace(/^[\s-*_]{3,}$/gm, '')

    // 移除 HTML 标签
    cleaned = cleaned.replace(/<[^>]+>/g, '')

    // 移除表格
    cleaned = cleaned.replace(/\|.*?\|/g, '')

    // 移除多余的空白
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
    cleaned = cleaned.trim()

    return cleaned
  }

  // 组件卸载时停止播放
  onUnmounted(() => {
    stop()
  })

  return {
    status,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    toggle
  }
}

