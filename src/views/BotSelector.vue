<template>
  <BotSelectorInterface :initial-bot-id="botId" :initial-bot-name="botName" />
  </template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BotSelectorInterface from '../components/bot/BotSelectorInterface.vue'

const route = useRoute()
const botId = ref('')
const botName = ref('')

onMounted(() => {
  botId.value = route.query.bot_id || ''
  botName.value = route.query.bot_name || ''
  console.log('BotSelector.vue - 接收到bot_id参数:', botId.value)
})
</script>