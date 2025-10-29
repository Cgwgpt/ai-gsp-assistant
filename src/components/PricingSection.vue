<template>
  <div class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold mb-4"></h2>
      <p class="text-gray-600 mb-12">药品质量管理AI赋能系统</p>
      <div class="max-w-lg mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex justify-center items-baseline mb-8">
            <span class="text-4xl font-bold">¥</span>
            <span class="text-6xl font-bold">5688/年</span>
          </div>
          <button 
            class="w-full bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors mb-8"
            @click="handlePurchase"
          >
            立即购买
          </button>
          <div class="text-left space-y-4">
            <div v-for="feature in features" :key="feature" class="flex items-center">
              <CheckIcon class="w-5 h-5 text-purple-600 mr-2" />
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckIcon } from 'lucide-vue-next'

const features = [
  'AI_智能助理',
  '智能撰写报告',
  '智能条款速查',
  '智能缺陷识别',
  '智能GSP解读',
  'AI_语音对话',
  'AI_智能审核'
]

const handlePurchase = () => {
  // 这里添加购买逻辑
  console.log('处理购买...')
}
</script> 