<template>
  <div class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-center mb-4">
        <span class="text-purple-600">AI在医药监管领域上应用</span>
      </h2>
      <p class="text-center text-gray-600 mb-12">监管应用场景</p>
      <div class="flex justify-center">
        <video 
          controls
          class="w-full max-w-4xl rounded-lg shadow-lg"
          src="/data/output.mp4"
        >
          <p>您的浏览器不支持 video 标签。</p>
        </video>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  frameworks: {
    type: Array,
    required: true
  }
})
</script> 