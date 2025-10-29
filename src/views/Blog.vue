<template>
  <div class="min-h-screen bg-white">
    <TheNavbar />
    <div class="pt-24 px-4"> <!-- 增加顶部内边距以确保内容完全在导航栏下方显示 -->
      <h1 class="text-2xl font-bold text-center mb-8">GSP检查中企业常见缺陷汇总</h1>
      <p class="text-center text-gray-600 mb-12">收集GSP检查中企业常见缺陷项共181项，供企业自查使用</p>
      <gsp-app></gsp-app>
    </div>
  </div>
</template>

<script setup>
import TheNavbar from '../components/TheNavbar.vue'
import GspApp from '../gspApp.vue'
</script>