<template>
  <div class="min-h-screen bg-white">
    <TheNavbar />
    <div class="pt-24 px-4">
      <h1 class="text-2xl font-bold text-center">GSP检查指南智能体</h1>
      <p class="text-center text-gray-600 mt-4">快速询问GSP检查条款相关知识，更好了解GSP检查内容及方法</p>
      <div class="mt-8">
        <iframe 
          src="http://106.52.236.135:4000/chat/share?shareId=nmdvvnkc7j5v359xk4e7pf5y&chatId=ohaqytjbp8kj"
          class="w-4/5 h-[600px] border-2 border-gray-200 rounded-lg shadow-md mx-auto"
          title="GSP检查指南对话"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import TheNavbar from '../components/TheNavbar.vue'
</script>