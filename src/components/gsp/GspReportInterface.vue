<template>
  <div>
    <!-- 添加导航栏 -->
    <TheNavbar />
    
    <div class="pt-16 min-h-screen bg-gray-50">
      <!-- 整个内容区域容器 -->
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <!-- Header -->
        <div class="bg-blue-500 p-4 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h1 class="text-white text-xl font-medium">AI智能撰写GSP缺陷项整改报告</h1>
            <div class="flex items-center gap-4">
              <span class="text-white">报告为示例性内容，应以企业真实的相关证明材料为准!</span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex h-[calc(90vh-64px-64px-48px)] bg-white rounded-b-lg shadow-sm overflow-hidden">
          <!-- Chat Area -->
          <div class="flex-1 flex flex-col">
            <!-- Messages Area -->
            <div class="flex-1 p-4 overflow-y-auto" ref="messagesContainer">
              <div class="flex">
                <!-- 问题区域 - 左侧 40% -->
                <div class="w-[40%] pr-4">
                  <div v-for="(msg, index) in messages" 
                       :key="msg.id"
                       :ref="msg === streamingMessage ? 'activeMessage' : undefined"
                       class="mb-4 min-h-[80px]"
                       v-show="msg.role === 'user'">
                    <div class="bg-gray-50 rounded-lg p-4 rounded-bl-none shadow-sm h-full">
                      <div class="flex justify-between text-sm text-gray-500 mb-1">
                        <span>问题描述</span>
                        <span>{{ msg.timestamp }}</span>
                      </div>
                      <div class="whitespace-pre-wrap">
                        {{ msg.content }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 回复区域 - 右侧 60% -->
                <div class="w-[60%] pl-4 border-l border-gray-100">
                  <div v-for="(msg, index) in messages" 
                       :key="msg.id"
                       :ref="msg === streamingMessage ? 'activeMessage' : undefined"
                       class="mb-4 message-card"
                       v-show="msg.role === 'assistant'">
                    <div :class="[
                      'rounded-lg p-4 rounded-br-none shadow-sm h-full message-transition relative',
                      msg === streamingMessage ? 'bg-blue-100' : 'bg-blue-50'
                    ]">
                      <div class="question-area">
                        <div class="font-medium mb-1">缺陷项目：</div>
                        <div class="question-text">{{ messages[index-1]?.content || '' }}</div>
                      </div>
                      
                      <div class="flex justify-between mb-1 pr-20">
                        <span class="timestamp">智能撰写</span>
                        <span class="timestamp">{{ msg.timestamp }}</span>
                      </div>
                      <div class="markdown-body" v-html="renderMessageContent(msg.content)"></div>
                      <span v-if="msg === streamingMessage" 
                            class="cursor">|</span>
                      
                      <!-- 操作按钮组 -->
                      <div v-if="!streamingMessage || msg !== streamingMessage" 
                           class="absolute top-2 right-2 flex gap-1">
                        <!-- 语音播报按钮 -->
                        <button 
                          v-if="speech.isSupported"
                          @click="handleSpeak(msg.id, msg.content)"
                          class="p-2 rounded-md transition-colors"
                          :class="speakingMessageId === msg.id && speech.status.value !== 'idle'
                            ? 'text-blue-600 hover:text-blue-700 bg-blue-50' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
                          :title="speakingMessageId === msg.id && speech.status.value === 'playing' 
                            ? '暂停播放' 
                            : speakingMessageId === msg.id && speech.status.value === 'paused'
                            ? '继续播放'
                            : '语音播报'"
                        >
                          <!-- 播放图标 -->
                          <svg v-if="speakingMessageId !== msg.id || speech.status.value === 'idle'" 
                               class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                          <!-- 暂停图标 -->
                          <svg v-else-if="speech.status.value === 'playing'" 
                               class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <!-- 继续播放图标 -->
                          <svg v-else 
                               class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        
                        <!-- 停止按钮 -->
                        <button 
                          v-if="speech.isSupported && speakingMessageId === msg.id && speech.status.value !== 'idle'"
                          @click="handleStopSpeak"
                          class="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="停止播放"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                          </svg>
                        </button>
                        
                        <!-- 复制按钮 -->
                        <button 
                          @click="copyContent(msg.content)"
                          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="复制回复内容"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Loading indicator -->
              <div v-if="loading" class="flex justify-center mt-4">
                <div class="inline-block bg-gray-100 rounded-lg px-4 py-2 text-gray-500">
                  正在思考中...
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div class="border-t p-4 bg-white">
              <div class="flex gap-4 mb-4">
                <button 
                  class="new-chat-btn text-white px-8 py-2.5 rounded-lg 
                         transition-all flex items-center gap-2 font-medium"
                  @click="handleNewChat"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 4v16m8-8H4"/>
                  </svg>
                  新建对话
                </button>
                <input 
                  type="text" 
                  class="flex-1 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent outline-none"
                  placeholder="输入您要撰写报告的缺陷项目问题描述..."
                  v-model="inputMessage"
                  @keyup.enter="handleSend"
                />
                <button 
                  class="send-btn text-white px-10 py-2.5 rounded-lg
                         transition-all flex items-center gap-2 font-medium
                         disabled:bg-gray-300 disabled:cursor-not-allowed"
                  :disabled="loading"
                  @click="handleSend"
                >
                  <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                  <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  {{ loading ? '发送中...' : '发送' }}
                </button>
              </div>

              <!-- Dropdown -->
              <select 
                class="w-full border rounded-lg px-4 py-2.5 bg-white focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent outline-none
                       text-gray-600 cursor-pointer"
                v-model="selectedExample"
                @change="handleExampleSelect"
              >
                <option value="">选择预设问题范例...</option>
                <option v-for="example in examples" :key="example.id" :value="example.id">
                  {{ example.text }}
                </option>
              </select>
            </div>
          </div>

          <!-- Chat History Sidebar -->
          <div class="w-80 border-l bg-white">
            <div class="p-4 border-b">
              <h2 class="text-lg font-medium">对话历史</h2>
            </div>
            <div class="overflow-y-auto h-[calc(100%-60px)]">
              <div 
                v-for="chat in chatHistory" 
                :key="chat.id" 
                class="group p-4 border-b hover:bg-gray-50 cursor-pointer relative"
                @click="loadChatHistory(chat)"
              >
                <div class="text-sm text-gray-500">{{ chat.timestamp }}</div>
                <div class="mt-1 text-sm line-clamp-2">{{ chat.content }}</div>
                <button 
                  class="absolute right-2 top-2 p-1 rounded-full opacity-0 group-hover:opacity-100 
                         hover:bg-red-100 transition-opacity"
                  @click="handleDeleteHistory(chat.id, $event)"
                >
                  <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 对话详情模态 -->
      <div v-if="showDialog" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
           @click="closeDialog">
        <div class="bg-white rounded-lg w-[800px] max-h-[80vh] flex flex-col" 
             @click.stop>
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="text-lg font-medium">对话详情</h3>
            <button class="text-gray-500 hover:text-gray-700" @click="closeDialog">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto flex-1">
            <!-- 问题部分 -->
            <div class="mb-6">
              <div class="text-sm text-gray-500 mb-2">问题描述</div>
              <div class="bg-gray-50 rounded-lg p-4">
                {{ selectedChat?.content }}
              </div>
            </div>
            
            <!-- 回复部分 -->
            <div>
              <div class="text-sm text-gray-500 mb-2 flex justify-between items-center">
                <span>智能撰写</span>
                <button 
                  class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  @click="copyContent(selectedChat?.response || '')"
                  title="复制回复内容"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
              <div class="bg-blue-50 rounded-lg p-4 markdown-body" v-html="renderMessageContent(selectedChat?.response || '')"></div>
            </div>
          </div>
          
          <div class="p-4 border-t flex justify-end gap-3">
            <button 
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              @click="closeDialog"
            >
              关闭
            </button>
            <button 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              @click="useQuestion"
            >
              使用此问
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick, watch, onMounted, computed } from 'vue'
import { useGspChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import TheNavbar from '../TheNavbar.vue'
import { useSupabase } from '../../../composables/useSupabase'
import { renderMessageContent } from '../../composables/useMarkdown'
import { useSpeech } from '../../composables/useSpeech'
import '../../assets/markdown.css'
import '../../assets/highlight.css'

const chatStore = useGspChatStore()
const { messages, loading, streamingMessage } = storeToRefs(chatStore)

// 语音播报功能
const speech = useSpeech()
const speakingMessageId = ref<string | null>(null)

// 处理语音播报
const handleSpeak = (messageId: string, content: string) => {
  if (speakingMessageId.value === messageId && speech.status.value !== 'idle') {
    // 如果是同一条消息，切换播放/暂停
    speech.toggle(content)
  } else {
    // 播放新消息
    speakingMessageId.value = messageId
    speech.speak(content)
  }
}

const handleStopSpeak = () => {
  speech.stop()
  speakingMessageId.value = null
}

// 监听语音状态，当播放结束时清除ID
watch(() => speech.status.value, (newStatus) => {
  if (newStatus === 'idle') {
    speakingMessageId.value = null
  }
})

const inputMessage = ref('')
const selectedExample = ref<string>('')

interface Example {
  id: number
  text: string
}

const examples = ref<Example[]>([
  { 
    id: 1, 
    text: '企业未对相关人员进行同化制剂、肽类激素相关法律法规培训' 
  },
  { 
    id: 2, 
    text: '企业质量管理部门未建立委托运输管理规程' 
  },
  { 
    id: 3, 
    text: '企业部分销后退回药品未按规定验收' 
  },
  { 
    id: 4, 
    text: '企业未按委托运输协议要求收集送货回单' 
  },
  { 
    id: 5, 
    text: '企业未对温湿度监测系统进行验证' 
  }
])

interface ChatHistoryItem {
  id: number
  timestamp: string
  content: string
  response: string
  userId?: string
}

const chatHistory = ref<ChatHistoryItem[]>([])

const loadLocalChatHistory = () => {
  try {
    const { user } = useSupabase()
    const userId = user.value?.id || 'anonymous'
    const storageKey = `gsp_chat_history_${userId}`
    
    const savedHistory = localStorage.getItem(storageKey)
    if (savedHistory) {
      chatHistory.value = JSON.parse(savedHistory)
    }
  } catch (error) {
    console.error('加载聊天历史失败:', error)
  }
}

const saveLocalChatHistory = (message: string, response: string) => {
  try {
    const { user } = useSupabase()
    const userId = user.value?.id || 'anonymous'
    const storageKey = `gsp_chat_history_${userId}`
    
    const newChat: ChatHistoryItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      content: message,
      response: response,
      userId: userId
    }
    
    chatHistory.value.unshift(newChat)
    // 限制保存最近20条记录
    chatHistory.value = chatHistory.value.slice(0, 20)
    
    localStorage.setItem(storageKey, JSON.stringify(chatHistory.value))
  } catch (error) {
    console.error('保存聊天历史失败:', error)
  }
}

const deleteLocalChat = (id: number) => {
  try {
    const { user } = useSupabase()
    const userId = user.value?.id || 'anonymous'
    const storageKey = `gsp_chat_history_${userId}`
    
    chatHistory.value = chatHistory.value.filter(chat => chat.id !== id)
    localStorage.setItem(storageKey, JSON.stringify(chatHistory.value))
  } catch (error) {
    console.error('删除聊天记录失败:', error)
  }
}

const handleSend = async () => {
  if (!inputMessage.value.trim() || loading.value) return
  
  const message = inputMessage.value
  inputMessage.value = ''
  
  try {
    const result = await chatStore.sendMessage(message)
    
    // 检查返回值，如果返回null说明被阻止了（比如配额超限）
    if (result === null) {
      // 如果返回null，说明消息发送被阻止（配额检查失败或其他原因）
      const errorMessage = chatStore.error || '消息发送被阻止，请稍后重试'
      console.error('发送消息被阻止:', errorMessage, 'result:', result, 'chatStore.error:', chatStore.error)
      alert(errorMessage)
      
      // 如果消息已经被添加到消息列表（不应该发生，但为了安全起见），移除它们
      if (chatStore.messages.length > 0) {
        const lastMessage = chatStore.messages[chatStore.messages.length - 1]
        if (lastMessage && lastMessage.role === 'user' && lastMessage.content === message) {
          chatStore.messages.pop()
        }
        // 如果还有助手消息占位符，也移除
        if (chatStore.messages.length > 0) {
          const lastMsg = chatStore.messages[chatStore.messages.length - 1]
          if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
            chatStore.messages.pop()
          }
        }
      }
      return
    }
    
    // 检查是否有错误（配额检查失败等情况）
    if (chatStore.error) {
      console.error('发送消息失败:', chatStore.error)
      alert(chatStore.error)
      return
    }
    
    // 保存到本地史记录
    const response = chatStore.messages[chatStore.messages.length - 1]?.content || ''
    saveLocalChatHistory(message, response)
  } catch (error) {
    console.error('发送消息失败:', error)
    alert('发送消息失败,请稍后重试')
  }
}

const handleNewChat = () => {
  chatStore.reset()
  inputMessage.value = ''
  selectedExample.value = ''
}

const handleExampleSelect = async () => {
  if (selectedExample.value) {
    const example = examples.value.find(e => e.id === parseInt(selectedExample.value))
    if (example) {
      try {
        // 直接发送预设问题
        await chatStore.sendMessage(example.text)
        // 保存到本地历史记录
        const response = chatStore.messages[chatStore.messages.length - 1]?.content || ''
        saveLocalChatHistory(example.text, response)
        // 重置选择
        selectedExample.value = ''
      } catch (error) {
        console.error('发送预设问题失败:', error)
        alert('发送失败,请稍后重试')
      }
    }
  }
}

const handleDeleteHistory = (id: number, event: Event) => {
  event.stopPropagation() // 阻止事件冒泡
  if (confirm('确定要删除这条聊天记录吗？')) {
    deleteLocalChat(id)
  }
}

const messagesContainer = ref<HTMLElement | null>(null)
const activeMessage = ref<HTMLElement | null>(null)

// 监听流式消息的内容变化
watch(() => streamingMessage.value?.content, async () => {
  if (streamingMessage.value) {
    await nextTick()
    const element = activeMessage.value
    if (element) {
      // 获取消息容器的可见区域高度
      const containerHeight = messagesContainer.value?.clientHeight || 0
      const elementTop = element.offsetTop
      const elementHeight = element.clientHeight
      const containerScrollTop = messagesContainer.value?.scrollTop || 0
      const containerScrollBottom = containerScrollTop + containerHeight

      // 如果元素不在可见区域内，或者接近底部，就滚动到合适位置
      if (elementTop < containerScrollTop || 
          elementTop + elementHeight > containerScrollBottom ||
          elementTop + elementHeight > containerScrollBottom - 100) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end'
        })
      }
    }
  }
}, { immediate: true })

// 监听新消息添加
watch(() => messages.value.length, async () => {
  await nextTick()
  if (messagesContainer.value) {
    const lastMessage = messagesContainer.value.lastElementChild
    lastMessage?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'end'
    })
  }
})

// 优化现有的消息内容监听
watch(() => messages.value, async () => {
  if (streamingMessage.value) {
    await nextTick()
    const element = activeMessage.value
    if (element && messagesContainer.value) {
      // 计算是否需要滚动
      const containerHeight = messagesContainer.value.clientHeight
      const elementBottom = element.offsetTop + element.clientHeight
      const containerScrollBottom = messagesContainer.value.scrollTop + containerHeight

      if (elementBottom > containerScrollBottom - 100) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end'
        })
      }
    }
  }
}, { deep: true })

// 在组件挂载时加载历史记录
onMounted(() => {
  loadLocalChatHistory()
})

// 添加对话框相关的状态和方法
const showDialog = ref(false)
const selectedChat = ref<ChatHistoryItem | null>(null)

// 加历史记录的方法
const loadChatHistory = (chat: ChatHistoryItem) => {
  selectedChat.value = chat
  showDialog.value = true
}

// 关闭对话框
const closeDialog = () => {
  showDialog.value = false
  selectedChat.value = null
}

// 使用选中的问题
const useQuestion = () => {
  if (selectedChat.value) {
    inputMessage.value = selectedChat.value.content
    closeDialog()
  }
}

// 添加复制功能
const copyContent = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 可以添加一个提示，比如使用 toast 通知
    alert('复制成功')
  } catch (err) {
    console.error('复制失败:', err)
    alert('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: currentColor;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

/* 消息卡片样式 */
.message-card {
  min-height: 80px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 滚动条样式 */
:deep(.overflow-y-auto) {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar) {
  width: 4px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

/* 分隔线渐变效果 */
.border-gradient {
  border-image: linear-gradient(to bottom, transparent, rgba(156, 163, 175, 0.1), transparent) 1;
}

/* 消息卡片过渡效果 */
.message-transition {
  transition: background-color 0.3s ease;
}

/* 时间戳样式 */
.timestamp {
  font-size: 0.75rem;
  color: rgba(107, 114, 128, 1);
}

/* 问题描述区域样式 */
.question-area {
  background-color: rgba(249, 250, 251, 1);
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

/* 问题描述文本样式 */
.question-text {
  color: rgba(55, 65, 81, 1);
}

/* 添加历史记录项的过渡效果 */
.group {
  transition: background-color 0.2s ease;
}

.group:hover button {
  opacity: 1;
}

/* 添加模态框动画效果 */
.fixed {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 优化滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

/* 添加复制按钮悬浮效果 */
.message-card:hover button {
  opacity: 1;
}

/* 修改按钮的默认样式规则 */
button {
  transition: opacity 0.2s ease;
}

/* 只对消息卡片中的按钮应用透明效果 */
.message-card button {
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* 消息卡片按钮悬浮效果 */
.message-card:hover button {
  opacity: 1;
}

/* 对话框中的按钮始终显示 */
.fixed button {
  opacity: 1;
}

/* 新建对话按钮样式 */
.new-chat-btn {
  background: linear-gradient(to right, #2563eb, #3b82f6);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  transition: all 0.3s ease;
  opacity: 1 !important; /* 确保始终可见 */
}

.new-chat-btn:hover {
  background: linear-gradient(to right, #1d4ed8, #2563eb);
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
  transform: translateY(-1px);
}

/* 发送按钮样式 */
.send-btn {
  background: linear-gradient(to right, #059669, #10b981);
  box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
  transition: all 0.3s ease;
  opacity: 1 !important; /* 确保始终可见 */
}

.send-btn:hover {
  background: linear-gradient(to right, #047857, #059669);
  box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);
  transform: translateY(-1px);
}

.send-btn:disabled {
  background: #d1d5db;
  box-shadow: none;
  transform: none;
}

/* 在 <style scoped> 中添加/修改以下样式 */

/* 整体背景渐变 */
.min-h-screen {
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f6fe 100%);
}

/* Header样式优化 */
header {
  background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.15);
  backdrop-filter: blur(10px);
}

/* 主内容区域玻璃拟态效果 */
.flex-1.flex.flex-col {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 消息卡片样式优化 */
.message-card > div {
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.message-card > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* 输入框样式优化 */
input[type="text"] {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

input[type="text"]:focus {
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

/* 下拉框样式优化 */
select {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

select:focus {
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

/* 按钮样式进一步优化 */
.new-chat-btn {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  animation: buttonPulse 2s infinite;
}

.send-btn {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
}

/* 按钮呼吸动画 */
@keyframes buttonPulse {
  0% {
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(37, 99, 235, 0.5);
  }
  100% {
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  }
}

/* 侧边栏样式优化 */
.w-80.border-l {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
}

/* 历史记录项样式 */
.group {
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.group:hover {
  background: rgba(59, 130, 246, 0.05);
  backdrop-filter: blur(4px);
}

/* 模态框样式优化 */
.fixed .bg-white {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

/* 滚动条样式进一步优化 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #60a5fa);
  border-radius: 3px;
}

/* 添加打字机光标动画 */
.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: #3b82f6;
  margin-left: 2px;
  animation: cursorBlink 1s step-end infinite;
}

@keyframes cursorBlink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

/* 消息加载动画优化 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

