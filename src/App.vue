<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import okLandingPage from './okLandingPage.vue'

onMounted(() => {
  // 设置页面标题
  document.title = 'DeepSeek数智医药系统'
  
  // 添加favicon
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
  link.type = 'image/svg+xml'
  link.rel = 'shortcut icon'
  link.href = '/favicon-final.svg'
  document.getElementsByTagName('head')[0].appendChild(link)
})
</script> 