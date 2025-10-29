<template>
  <div class="space-y-6">
    <h3 class="text-xl font-bold text-purple-600">{{ title }}</h3>
    <ul class="space-y-4">
      <li v-for="feature in features" :key="feature" class="flex items-start">
        <CheckCircleIcon class="w-5 h-5 text-purple-600 mt-1 mr-2 flex-shrink-0" />
        <span>{{ feature }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true
  },
  features: {
    type: Array,
    required: true
  }
})
</script> 