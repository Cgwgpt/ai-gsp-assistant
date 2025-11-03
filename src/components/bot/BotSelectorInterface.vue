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
            <h1 class="text-white text-xl font-medium">多数智人对话系统</h1>
            <div class="flex items-center gap-4">
              <span class="text-white">选择不同的数智人进行对话</span>
              <span class="text-white">当前数智人：{{ currentBotName }}</span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex h-[calc(90vh-64px-64px-48px)] bg-white rounded-b-lg shadow-sm overflow-hidden">
          <!-- Chat Area -->
          <div class="flex-1 flex flex-col">
            <!-- Bot Selector -->
            <div class="p-4 bg-white border-b">
              <div class="flex gap-4 items-center">
                <label class="text-gray-700 font-medium">选择数智人：</label>
                <select 
                  class="flex-1 border rounded-lg px-4 py-2.5 bg-white focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent outline-none
                         text-gray-600 cursor-pointer"
                  v-model="selectedBot"
                  @change="handleBotChange"
                >
                  <option v-for="bot in botList" :key="bot.id" :value="bot.id">
                    {{ bot.name }}
                  </option>
                </select>
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
                <!-- 只对管理员显示管理按钮 -->
                <router-link 
                  v-if="isAdmin"
                  to="/bot-management" 
                  class="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1"
                  title="管理数智人"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="hidden sm:inline">管理</span>
                </router-link>
              </div>
            </div>

            <!-- Messages Area -->
            <div class="flex-1 p-4 overflow-y-auto" ref="messagesContainer">
              <div class="flex flex-col gap-4">
                <div v-for="(msg, index) in messages" 
                     :key="msg.id"
                     :ref="msg === streamingMessage ? 'activeMessage' : undefined"
                     class="mb-4 message-card">
                  <div :class="[
                    'rounded-lg p-4 shadow-sm h-full message-transition relative',
                    msg.role === 'user' ? 'bg-gray-50 rounded-bl-none' : 
                    (msg === streamingMessage ? 'bg-blue-100 rounded-br-none' : 'bg-blue-50 rounded-br-none')
                  ]">
                    <div class="flex justify-between text-sm text-gray-500 mb-1 pr-20">
                      <span>{{ msg.role === 'user' ? '用户' : '数智人' }}</span>
                      <span class="timestamp">{{ msg.timestamp }}</span>
                    </div>
                    <div v-if="msg.role === 'user'" class="whitespace-pre-wrap">
                      {{ msg.content }}
                    </div>
                    <div v-else class="markdown-body" v-html="renderMessageContent(msg.content)"></div>
                    <span v-if="msg === streamingMessage" 
                          class="cursor">|</span>
                    
                    <!-- 操作按钮组 -->
                    <div v-if="msg.role === 'assistant' && (!streamingMessage || msg !== streamingMessage)"
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

              <!-- Loading indicator -->
              <div v-if="loading" class="flex justify-center mt-4">
                <div class="inline-block bg-gray-100 rounded-lg px-4 py-2 text-gray-500">
                  正在思考中...
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div class="border-t p-4 bg-white">
              <div class="flex gap-4">
                <input 
                  type="text" 
                  class="flex-1 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent outline-none"
                  placeholder="输入您的问题..."
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
                <!-- 添加调试按钮 -->
                <button 
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  @click="showDebugInfo"
                  title="显示调试信息"
                  v-if="isAdmin"
                >
                  调试
                </button>
              </div>
              
              <!-- Prompt Selector -->
              <div class="mt-3 pt-3 border-t border-gray-200">
                <div class="flex gap-2 items-center">
                  <label class="text-sm text-gray-600 font-medium whitespace-nowrap">预设提示词：</label>
                  <select 
                    class="flex-1 border rounded-lg px-3 py-2 bg-white focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent outline-none
                           text-sm text-gray-600 cursor-pointer"
                    v-model="selectedPromptId"
                    @change="handlePromptSelect"
                  >
                    <option value="">请选择提示词...</option>
                    <option v-for="prompt in prompts" :key="prompt.id" :value="prompt.id">
                      {{ prompt.title }}
                    </option>
                  </select>
                  <button 
                    class="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                           transition-colors flex items-center gap-1 text-sm"
                    @click="showPromptDialog = true"
                    title="管理提示词"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 4v16m8-8H4"/>
                    </svg>
                    管理
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat History Sidebar -->
          <div class="w-80 border-l bg-white">
            <div class="p-4 border-b flex justify-between items-center">
              <h2 class="text-lg font-medium">对话历史</h2>
              <button 
                class="text-gray-500 hover:text-red-500 transition-colors"
                @click="clearCurrentBotHistory"
                title="清除当前数智人的所有历史记录"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div class="overflow-y-auto h-[calc(100%-60px)]">
              <div 
                v-for="chat in currentBotHistory" 
                :key="chat.id" 
                class="group p-4 border-b hover:bg-gray-50 cursor-pointer relative"
                @click="loadChatHistory(chat)"
              >
                <div class="text-sm text-gray-500">{{ chat.timestamp }}</div>
                <div class="text-sm text-blue-500 font-medium">{{ getBotNameById(chat.botId) }}</div>
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

      <!-- 提示词管理对话框 -->
      <div v-if="showPromptDialog" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
           @click="showPromptDialog = false">
        <div class="bg-white rounded-lg w-[700px] max-h-[80vh] flex flex-col" 
             @click.stop>
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="text-lg font-medium">提示词管理</h3>
            <button class="text-gray-500 hover:text-gray-700" @click="showPromptDialog = false">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto flex-1">
            <!-- 添加/编辑提示词表单 -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="text-sm font-medium mb-3 text-gray-700">
                {{ editingPrompt ? '编辑提示词' : '添加新提示词' }}
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">标题</label>
                  <input 
                    type="text"
                    v-model="promptForm.title"
                    class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent outline-none text-sm"
                    placeholder="输入提示词标题"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">内容</label>
                  <textarea 
                    v-model="promptForm.content"
                    rows="4"
                    class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent outline-none text-sm"
                    placeholder="输入提示词内容"
                  ></textarea>
                </div>
                <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2 text-sm text-gray-600">
                    <input 
                      type="checkbox"
                      v-model="promptForm.is_public"
                      class="rounded"
                    />
                    <span>设为公开（所有用户可见）</span>
                  </label>
                </div>
                <div class="flex gap-2">
                  <button 
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                           transition-colors text-sm"
                    @click="savePrompt"
                    :disabled="!promptForm.title || !promptForm.content"
                  >
                    {{ editingPrompt ? '保存' : '添加' }}
                  </button>
                  <button 
                    v-if="editingPrompt"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                           transition-colors text-sm"
                    @click="cancelEditPrompt"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>

            <!-- 提示词列表 -->
            <div>
              <h4 class="text-sm font-medium mb-3 text-gray-700">提示词列表</h4>
              <div class="space-y-2">
                <div 
                  v-for="prompt in prompts" 
                  :key="prompt.id"
                  class="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h5 class="font-medium text-sm text-gray-800">{{ prompt.title }}</h5>
                        <span v-if="prompt.is_public" 
                              class="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                          公开
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 line-clamp-2">{{ prompt.content }}</p>
                    </div>
                    <div class="flex gap-2 ml-4">
                      <button 
                        class="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        @click="editPrompt(prompt)"
                        title="编辑"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button 
                        class="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        @click="deletePrompt(prompt.id!)"
                        title="删除"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                      <button 
                        class="p-1.5 text-green-500 hover:bg-green-50 rounded transition-colors"
                        @click="usePrompt(prompt)"
                        title="使用此提示词"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="prompts.length === 0" class="text-center py-8 text-gray-400 text-sm">
                  暂无提示词，点击上方"添加新提示词"创建第一个提示词
                </div>
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
            <!-- 数智人信息 -->
            <div class="mb-4">
              <div class="text-sm text-gray-500 mb-2">使用数智人</div>
              <div class="bg-blue-50 rounded-lg p-2 inline-block">
                {{ getBotNameById(selectedChat?.botId || '') }}
              </div>
            </div>
            
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
                <span>数智人回复</span>
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
              使用此问题
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import TheNavbar from '../TheNavbar.vue'
import { botService } from '../../../services/botService'
import { promptService } from '../../../services/promptService'
import { useSupabase } from '../../../composables/useSupabase'
import { renderMessageContent } from '../../composables/useMarkdown'
import { useSpeech } from '../../composables/useSpeech'
import '../../assets/markdown.css'
import '../../assets/highlight.css'

// 导入Bot接口
interface Bot {
  id: string
  name: string
  apiKey: string
  type?: string
  dbId?: string  // 改为可选参数
}

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

interface ChatHistoryItem {
  id: number
  timestamp: string
  content: string
  response: string
  botId: string
  apiKey?: string
  userId?: string
}

const chatStore = useChatStore()
const userStore = useUserStore()
const { messages, loading, streamingMessage } = storeToRefs(chatStore)

// 接收初始数智人ID参数
const props = defineProps({
  initialBotId: {
    type: String,
    default: ''
  }
})

// 检查当前用户是否为管理员
const isAdmin = computed(() => userStore.isAdmin())

const inputMessage = ref('')
const selectedBot = ref('')

// 提示词相关
const prompts = ref<any[]>([])
const selectedPromptId = ref('')
const showPromptDialog = ref(false)
const editingPrompt = ref<any>(null)
const promptForm = ref({
  title: '',
  content: '',
  is_public: false
})

// 数智人列表
const botList = ref<Bot[]>([
  { id: '7427724467013091364', name: '默认数智人', apiKey: '', dbId: '' }
])

// 加载用户授权的数智人列表
const loadUserAuthorizedBots = async () => {
  try {
    // 获取用户授权的数智人
    const { data, error } = await botService.getBots(true)
    
    if (error) {
      console.error('获取授权数智人列表失败:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log('从API获取到数智人列表原始数据:', data)
      // 将数据转换为组件需要的格式
      botList.value = data.map((bot: any) => ({
        id: bot.coze_bot_id,
        name: bot.name,
        apiKey: bot.api_key,
        type: bot.type,
        dbId: bot.id // 保存数据库中的ID
      }))
      
      console.log('转换后的数智人列表:', botList.value)
      
      // 如果传入了initialBotId，尝试预先选择对应的数智人
      if (props.initialBotId) {
        console.log('尝试预先选择数智人, initialBotId:', props.initialBotId)
        
        // 尝试多种匹配方式
        // 1. 先尝试通过coze_bot_id精确匹配
        let matchedBot = botList.value.find(b => b.id === props.initialBotId)
        
        // 2. 如果没找到，尝试通过数据库ID匹配
        if (!matchedBot) {
          matchedBot = botList.value.find(b => b.dbId === props.initialBotId)
          console.log('通过dbId尝试匹配数智人')
        }
        
        // 3. 尝试将initialBotId作为字符串匹配coze_bot_id，防止类型不一致
        if (!matchedBot) {
          matchedBot = botList.value.find(b => String(b.id) === String(props.initialBotId))
          console.log('通过字符串转换尝试匹配coze_bot_id')
        }
        
        // 4. 尝试部分匹配，防止ID格式略有差异
        if (!matchedBot && props.initialBotId.length > 5) {
          matchedBot = botList.value.find(b => 
            String(b.id).includes(props.initialBotId) || 
            String(props.initialBotId).includes(b.id)
          )
          console.log('通过部分匹配尝试匹配数智人')
        }
        
        if (matchedBot) {
          console.log('在加载时找到匹配的数智人:', matchedBot)
          selectedBot.value = matchedBot.id
          chatStore.setBot(matchedBot.id, matchedBot.apiKey, matchedBot.type)
        } else {
          console.warn('在加载时未找到匹配的数智人')
          
          if (botList.value.length > 0) {
            // 默认选择第一个数智人
            selectedBot.value = botList.value[0].id
            chatStore.setBot(selectedBot.value, botList.value[0].apiKey, botList.value[0].type)
          }
        }
      }
      // 如果没有传入initialBotId，默认选择第一个数智人
      else if (!selectedBot.value && botList.value.length > 0) {
        selectedBot.value = botList.value[0].id
        // 设置聊天store中的数智人
        chatStore.setBot(selectedBot.value, botList.value[0].apiKey, botList.value[0].type)
      }
    } else if (isAdmin.value) {
      // 如果是管理员但没有授权数智人，获取所有数智人
      const { data: allBots, error: allError } = await botService.getBots(false)
      
      if (!allError && allBots && allBots.length > 0) {
        botList.value = allBots.map((bot: any) => ({
          id: bot.coze_bot_id,
          name: bot.name,
          apiKey: bot.api_key,
          type: bot.type,
          dbId: bot.id
        }))
        
        if (!selectedBot.value && botList.value.length > 0) {
          selectedBot.value = botList.value[0].id
          chatStore.setBot(selectedBot.value, botList.value[0].apiKey, botList.value[0].type)
        }
      }
    }
  } catch (error) {
    console.error('加载数智人列表失败:', error)
  }
}

// 根据ID获取数智人名称
const getBotNameById = (id: string) => {
  const bot = botList.value.find((b: Bot) => b.id === id)
  return bot ? bot.name : '未知数智人'
}

interface ChatHistoryItem {
  id: number
  timestamp: string
  content: string
  response: string
  botId: string
  apiKey?: string
  userId?: string
}

const chatHistory = ref<ChatHistoryItem[]>([])

const loadLocalChatHistory = () => {
  try {
    // 加载当前用户的聊天历史
    const { user } = useSupabase()
    const userId = user.value?.id || 'anonymous'
    const storageKey = `bot_chat_history_${userId}`
    
    const savedHistory = localStorage.getItem(storageKey)
    if (savedHistory) {
      chatHistory.value = JSON.parse(savedHistory)
    }
  } catch (error) {
    console.error('加载聊天历史失败:', error)
  }
}

// 获取特定数智人的聊天历史
const getBotChatHistory = (botId: string) => {
  return chatHistory.value.filter(chat => chat.botId === botId)
}

// 显示当前选中数智人的聊天历史
const currentBotHistory = computed(() => {
  if (!selectedBot.value) return []
  return getBotChatHistory(selectedBot.value)
})

const saveLocalChatHistory = (message: string, response: string, botId: string) => {
  try {
    // 获取当前用户ID
    const { user } = useSupabase()
    const userId = user.value?.id || 'anonymous'
    const storageKey = `bot_chat_history_${userId}`
    
    // 获取当前数智人的API Key
    const bot = botList.value.find((b: Bot) => b.id === botId)
    const apiKey = bot ? bot.apiKey : undefined
    
    const newChat: ChatHistoryItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      content: message,
      response: response,
      botId: botId,
      apiKey: apiKey,
      userId: userId
    }
    
    // 添加到总历史记录
    chatHistory.value.unshift(newChat)
    // 限制每个数智人最多保存20条记录
    const botHistories: { [key: string]: ChatHistoryItem[] } = {}
    
    // 按数智人ID分组
    chatHistory.value.forEach(chat => {
      if (!botHistories[chat.botId]) {
        botHistories[chat.botId] = []
      }
      botHistories[chat.botId].push(chat)
    })
    
    // 限制每个数智人的历史记录数量
    let newChatHistory: ChatHistoryItem[] = []
    Object.keys(botHistories).forEach(botId => {
      newChatHistory = newChatHistory.concat(botHistories[botId].slice(0, 20))
    })
    
    // 更新历史记录
    chatHistory.value = newChatHistory
    
    localStorage.setItem(storageKey, JSON.stringify(chatHistory.value))
  } catch (error) {
    console.error('保存聊天历史失败:', error)
  }
}

const deleteLocalChat = (id: number) => {
  try {
    const { user } = useSupabase()
    const userId = user.value?.id || 'anonymous'
    const storageKey = `bot_chat_history_${userId}`
    
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
    // 先尝试从Supabase获取最新的数智人信息
    const { data: botData } = await botService.getBot(selectedBot.value)
    
    if (!botData) {
      alert('错误: 无法获取数智人信息，请确认数智人ID是否正确')
      return
    }
    
    // 验证API密钥格式
    if (!botData.api_key || !botData.api_key.startsWith('pat_')) {
      console.error('API密钥格式不正确:', botData.api_key)
      alert('错误: API密钥格式不正确，请确保以"pat_"开头。请联系管理员更新API密钥。')
      return
    }
    
    const botIdToUse = botData.coze_bot_id;
    const apiKey = botData.api_key;
    
    console.log(`发送消息，使用ID: ${botIdToUse}, API Key: ${apiKey.substring(0, 8)}...`)
    await chatStore.sendMessageWithBot(message, botIdToUse, apiKey)
    
    // 保存到本地历史记录
    const response = chatStore.messages[chatStore.messages.length - 1]?.content || ''
    saveLocalChatHistory(message, response, selectedBot.value)
  } catch (error: any) {
    console.error('发送消息失败:', error)
    
    // 提供更详细的错误信息
    let errorMessage = '发送消息失败，请稍后重试'
    
    // 检查是否是API权限错误
    if (error.message && error.message.includes('token does not have permission')) {
      errorMessage = '您的API密钥没有权限访问该数智人。请检查：\n' +
        '1. API密钥是否正确\n' +
        '2. 数智人ID是否正确\n' +
        '3. 在Coze平台上是否已为该API密钥启用了必要的权限\n\n' +
        '您可以在Coze平台上验证这些信息：https://www.coze.com/open/oauth/pats'
    } else if (error.message && error.message.includes('resource ID')) {
      errorMessage = '数智人ID不正确或不存在。请检查您的数智人ID设置。'
    } else if (error.message && error.message.includes('Failed to fetch')) {
      errorMessage = '连接到Coze API服务器失败。可能原因：\n' +
        '1. 网络连接问题\n' +
        '2. Coze API服务器暂时不可用\n' +
        '请稍后再试或检查您的网络连接。'
    } else if (error.message && error.message.includes('token you entered is incorrect')) {
      errorMessage = 'API密钥不正确。请检查：\n' +
        '1. API密钥格式是否正确（以pat_开头）\n' +
        '2. API密钥是否已过期或被撤销\n' +
        '请在Coze平台上重新生成API密钥，并更新到系统中。'
    }
    
    alert(errorMessage)
  }
}

const handleNewChat = () => {
  chatStore.reset()
  inputMessage.value = ''
}

const handleBotChange = async () => {
  chatStore.reset()
  
  // 获取当前选中数智人的API Key
  const bot = botList.value.find((b: Bot) => b.id === selectedBot.value)
  if (bot) {
    // 从Supabase获取最新信息，确保API Key是正确的
    botService.getBot(selectedBot.value)
      .then(({ data }) => {
        if (data) {
          // 验证API密钥格式
          if (!data.api_key || !data.api_key.startsWith('pat_')) {
            console.error('API密钥格式不正确:', data.api_key)
            alert('错误: API密钥格式不正确，请确保以"pat_"开头。请联系管理员更新API密钥。')
            return
          }
          
          // 设置正确的coze_bot_id和API密钥到chatStore
          chatStore.setBot(data.coze_bot_id, data.api_key, data.type)
          console.log('设置数智人信息：', {
            id: data.id,
            coze_bot_id: data.coze_bot_id,
            api_key: `${data.api_key.substring(0, 8)}...`,
            type: data.type
          })
        } else {
          // 如果无法获取coze_bot_id，则使用本地ID
          console.warn('无法从Supabase获取数智人信息，使用本地ID和API密钥:', bot.id)
          chatStore.setBot(bot.id, bot.apiKey, bot.type)
        }
      })
      .catch(error => {
        console.error('获取数智人信息失败:', error)
        // 出错时使用本地ID
        chatStore.setBot(bot.id, bot.apiKey, bot.type)
      })
  }
  
  // 加载新数智人的提示词
  await loadPrompts()
  selectedPromptId.value = '' // 清除提示词选择
  
  // 尝试恢复该数智人的最近一次对话
  const botHistory = getBotChatHistory(selectedBot.value)
  if (botHistory.length > 0) {
    // 询问用户是否要恢复上次对话
    if (confirm(`是否要恢复与"${getBotNameById(selectedBot.value)}"的上次对话？`)) {
      const lastChat = botHistory[0]
      inputMessage.value = lastChat.content
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

// 监听消息内容变化
watch(() => messages.value, () => {
  console.log('消息列表更新:', messages.value)
  // 检查是否有空内容的消息
  const emptyMessages = messages.value.filter(msg => !msg.content)
  if (emptyMessages.length > 0) {
    console.warn('发现空内容消息:', emptyMessages)
  }
}, { deep: true })

// 监听流式消息内容变化
watch(() => streamingMessage.value?.content, (newContent) => {
  console.log('流式消息内容更新:', newContent)
}, { immediate: true })

// 加载提示词列表
const loadPrompts = async () => {
  try {
    // 获取当前选中数智人的数据库ID
    const bot = botList.value.find((b: Bot) => b.id === selectedBot.value)
    let botDbId = null
    
    if (bot && bot.dbId) {
      botDbId = bot.dbId
    } else if (bot) {
      // 如果没有dbId，尝试从Supabase获取
      const { data: botData } = await botService.getBot(selectedBot.value)
      if (botData && botData.id) {
        botDbId = botData.id
      }
    }
    
    const { data, error } = await promptService.getPrompts(botDbId || undefined, true)
    
    if (error) {
      console.error('加载提示词列表失败:', error)
      return
    }
    
    prompts.value = data || []
  } catch (error) {
    console.error('加载提示词列表出错:', error)
  }
}

// 选择提示词
const handlePromptSelect = () => {
  if (!selectedPromptId.value) return
  
  const prompt = prompts.value.find(p => p.id === selectedPromptId.value)
  if (prompt) {
    inputMessage.value = prompt.content
  }
}

// 使用提示词
const usePrompt = (prompt: any) => {
  inputMessage.value = prompt.content
  selectedPromptId.value = prompt.id || ''
  showPromptDialog.value = false
}

// 编辑提示词
const editPrompt = (prompt: any) => {
  editingPrompt.value = prompt
  promptForm.value = {
    title: prompt.title,
    content: prompt.content,
    is_public: prompt.is_public || false
  }
}

// 取消编辑
const cancelEditPrompt = () => {
  editingPrompt.value = null
  promptForm.value = {
    title: '',
    content: '',
    is_public: false
  }
}

// 保存提示词
const savePrompt = async () => {
  if (!promptForm.value.title || !promptForm.value.content) {
    alert('请填写标题和内容')
    return
  }
  
  try {
    // 获取当前选中数智人的数据库ID
    const bot = botList.value.find((b: Bot) => b.id === selectedBot.value)
    let botDbId = null
    
    if (bot && bot.dbId) {
      botDbId = bot.dbId
    } else if (bot) {
      // 如果没有dbId，尝试从Supabase获取
      const { data: botData } = await botService.getBot(selectedBot.value)
      if (botData && botData.id) {
        botDbId = botData.id
      }
    }
    
    if (editingPrompt.value) {
      // 更新提示词
      const { error } = await promptService.updatePrompt(editingPrompt.value.id, {
        title: promptForm.value.title,
        content: promptForm.value.content,
        bot_id: botDbId || undefined,
        is_public: promptForm.value.is_public
      })
      
      if (error) {
        alert('更新提示词失败: ' + (error.message || '未知错误'))
        return
      }
    } else {
      // 创建新提示词
      const { error } = await promptService.createPrompt({
        title: promptForm.value.title,
        content: promptForm.value.content,
        bot_id: botDbId || undefined,
        is_public: promptForm.value.is_public
      })
      
      if (error) {
        alert('创建提示词失败: ' + (error.message || '未知错误'))
        return
      }
    }
    
    // 重新加载提示词列表
    await loadPrompts()
    
    // 重置表单
    cancelEditPrompt()
  } catch (error: any) {
    console.error('保存提示词失败:', error)
    alert('保存提示词失败: ' + (error.message || '未知错误'))
  }
}

// 删除提示词
const deletePrompt = async (id: string) => {
  if (!confirm('确定要删除这条提示词吗？')) {
    return
  }
  
  try {
    const { error } = await promptService.deletePrompt(id)
    
    if (error) {
      alert('删除提示词失败: ' + (error.message || '未知错误'))
      return
    }
    
    // 重新加载提示词列表
    await loadPrompts()
    
    // 如果删除的是当前选中的提示词，清除选择
    if (selectedPromptId.value === id) {
      selectedPromptId.value = ''
    }
  } catch (error: any) {
    console.error('删除提示词失败:', error)
    alert('删除提示词失败: ' + (error.message || '未知错误'))
  }
}

// 在组件挂载时加载历史记录和设置默认数智人
onMounted(async () => {
  loadLocalChatHistory()
  await loadUserAuthorizedBots() // 加载用户授权的数智人
  
  // 设置数智人类型为general
  chatStore.setBotType('general')
  
  // 设置默认数智人
  if (botList.value.length > 0) {
    selectedBot.value = botList.value[0].id
    
    // 设置chatStore中的数智人信息
    const bot = botList.value[0]
    chatStore.currentBotId = bot.id
    chatStore.currentApiKey = bot.apiKey
    
    // 加载该数智人的提示词
    await loadPrompts()
    
    // 显示该数智人的历史记录
    const botHistory = getBotChatHistory(selectedBot.value)
    if (botHistory.length > 0) {
      // 可以选择自动加载最近的对话，或者让用户手动选择
      // 这里我们不自动加载，只显示历史记录
    }
  }
})

// 监听数智人变化，加载对应的提示词
watch(() => selectedBot.value, async () => {
  await loadPrompts()
  selectedPromptId.value = '' // 清除提示词选择
}, { immediate: false })

// 添加对话框相关的状态和方法
const showDialog = ref(false)
const selectedChat = ref<ChatHistoryItem | null>(null)

// 加载历史记录的方法
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
    selectedBot.value = selectedChat.value.botId
    
    // 如果历史记录中有API Key，设置到chatStore中
    if (selectedChat.value.apiKey) {
      chatStore.currentApiKey = selectedChat.value.apiKey
    }
    
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

// 加载数智人列表
const loadBotList = () => {
  try {
    const { user } = useSupabase()
    const userId = user.value?.id || 'anonymous'
    const storageKey = `bot_list_${userId}`
    
    const savedBots = localStorage.getItem(storageKey)
    if (savedBots) {
      botList.value = JSON.parse(savedBots)
    } else {
      // 使用默认数智人列表，确保使用环境变量中的API密钥
      botList.value = [
        { 
          id: import.meta.env.VITE_COZE_BOT_ID, 
          name: '默认数智人', 
          apiKey: '', // 不再使用环境变量中的默认密钥，需要从Supabase获取
          dbId: ''
        }
      ]
      console.warn('请确保在Supabase的bots表中为数智人ID设置了对应的api_key')
      saveBotList()
    }
    
    // 检查并修复API密钥
    botList.value.forEach(bot => {
      if (!bot.apiKey || bot.apiKey.trim() === '') {
        console.log('检测到数智人没有API密钥，需要从Supabase获取对应的API密钥')
        // 不再使用环境变量中的默认密钥
        // bot.apiKey = import.meta.env.VITE_COZE_API_KEY
        console.warn('数智人ID为' + bot.id + '的API密钥为空，请确保在Supabase的bots表中设置了对应的api_key')
      }
    })
    
    // 保存更新后的列表
    saveBotList()
  } catch (error) {
    console.error('加载数智人列表失败:', error)
    // 出错时使用默认值
    botList.value = [
      { 
        id: import.meta.env.VITE_COZE_BOT_ID, 
        name: '默认数智人', 
        apiKey: '', // 不再使用环境变量中的默认密钥，需要从Supabase获取
        dbId: ''
      }
    ]
    console.warn('请确保在Supabase的bots表中为数智人ID设置了对应的api_key')
  }
}

// 保存数智人列表到本地存储
const saveBotList = () => {
  try {
    const { user } = useSupabase()
    const userId = user.value?.id || 'anonymous'
    const storageKey = `bot_list_${userId}`
    
    localStorage.setItem(storageKey, JSON.stringify(botList.value))
  } catch (error) {
    console.error('保存数智人列表失败:', error)
  }
}

// 当前选中数智人的名称
const currentBotName = computed(() => {
  return getBotNameById(selectedBot.value)
})

// 清除当前数智人的历史记录
const clearCurrentBotHistory = () => {
  if (!selectedBot.value) return
  
  if (confirm(`确定要清除与"${getBotNameById(selectedBot.value)}"的所有对话历史吗？`)) {
    // 获取当前用户ID
    const { user } = useSupabase()
    const userId = user.value?.id || 'anonymous'
    const storageKey = `bot_chat_history_${userId}`
    
    // 过滤掉当前数智人的历史记录
    chatHistory.value = chatHistory.value.filter(chat => chat.botId !== selectedBot.value)
    localStorage.setItem(storageKey, JSON.stringify(chatHistory.value))
  }
}

// 添加调试方法
const showDebugInfo = () => {
  const debugInfo = {
    selectedBot: selectedBot.value,
    currentBotName: currentBotName.value,
    messagesCount: messages.value.length,
    hasStreamingMessage: !!streamingMessage.value,
    streamingMessageContent: streamingMessage.value?.content,
    lastMessageContent: messages.value.length > 0 ? messages.value[messages.value.length - 1].content : null,
    conversationId: chatStore.conversationId,
    loading: loading.value,
    error: chatStore.error
  }
  
  console.log('调试信息:', debugInfo)
  alert(JSON.stringify(debugInfo, null, 2))
}

// 如果传入了initialBotId，则在加载完数智人列表后设置
// 这个watch作为备用方案，主要的初始化逻辑已经在loadUserAuthorizedBots中处理
watch(() => botList.value, (newBotList) => {
  if (props.initialBotId && newBotList.length > 0 && !selectedBot.value) {
    console.log('watch中尝试设置数智人, initialBotId:', props.initialBotId)
    
    // 先尝试通过coze_bot_id匹配
    let matchedBot = newBotList.find(bot => bot.id === props.initialBotId)
    
    // 如果通过id没找到，尝试通过dbId查找
    if (!matchedBot) {
      matchedBot = newBotList.find(bot => bot.dbId === props.initialBotId)
      console.log('watch中通过dbId尝试匹配数智人')
    }
    
    if (matchedBot) {
      console.log('watch中找到匹配的数智人:', matchedBot)
      selectedBot.value = matchedBot.id
      chatStore.setBot(matchedBot.id, matchedBot.apiKey, matchedBot.type)
    } else {
      console.warn('watch中未找到匹配的数智人，ID:', props.initialBotId)
    }
  }
}, { immediate: true })
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

/* 消息卡片过渡效果 */
.message-transition {
  transition: background-color 0.3s ease;
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

/* 时间戳样式 */
.timestamp {
  font-size: 0.75rem;
  color: rgba(107, 114, 128, 1);
}

/* Markdown内容区域样式优化 */
.markdown-body {
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.6;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.markdown-body :deep(h1) {
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(229, 231, 235, 1);
  padding-bottom: 0.5rem;
}

.markdown-body :deep(h2) {
  font-size: 1.25rem;
}

.markdown-body :deep(h3) {
  font-size: 1.125rem;
}

.markdown-body :deep(p) {
  margin-bottom: 0.75rem;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
}

.markdown-body :deep(li) {
  margin-bottom: 0.25rem;
}

.markdown-body :deep(code) {
  background-color: rgba(243, 244, 246, 1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.markdown-body :deep(pre) {
  background-color: rgba(243, 244, 246, 1);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 0.75rem;
}

.markdown-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid rgba(59, 130, 246, 1);
  padding-left: 1rem;
  margin-left: 0;
  color: rgba(107, 114, 128, 1);
  margin-bottom: 0.75rem;
}

.markdown-body :deep(a) {
  color: rgba(59, 130, 246, 1);
  text-decoration: underline;
}

.markdown-body :deep(a:hover) {
  color: rgba(37, 99, 235, 1);
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid rgba(229, 231, 235, 1);
  margin: 1rem 0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.75rem;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid rgba(229, 231, 235, 1);
  padding: 0.5rem;
  text-align: left;
}

.markdown-body :deep(th) {
  background-color: rgba(249, 250, 251, 1);
  font-weight: 600;
}
</style> 