<template>
  <div>
    <BotSelectorInterface :initial-bot-id="botId" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BotSelectorInterface from '../components/bot/BotSelectorInterface.vue'
import { useChatStore } from '../stores/chat'

const route = useRoute()
const botId = ref('')
const chatStore = useChatStore()

onMounted(() => {
  // 从路由获取bot_id参数
  botId.value = route.query.bot_id || ''
  console.log('Chat.vue - 接收到bot_id参数:', botId.value)
  
  // 如果页面刷新后需要重置聊天状态
  if (botId.value) {
    chatStore.reset()
  }
})
</script> 