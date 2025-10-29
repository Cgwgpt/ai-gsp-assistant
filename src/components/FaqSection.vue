<template>
  <div class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-center mb-12">常见问题</h2>
      <div class="max-w-3xl mx-auto space-y-4">
        <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow-sm">
          <button 
            class="w-full px-6 py-4 text-left flex justify-between items-center"
            @click="toggleFaq(index)"
          >
            <span class="font-medium">{{ faq.question }}</span>
            <ChevronDownIcon 
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': openFaq === index }"
            />
          </button>
          <div v-show="openFaq === index" class="px-6 py-4 border-t border-gray-100">
            <p class="text-gray-600">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDownIcon } from 'lucide-vue-next'

const props = defineProps({
  faqs: {
    type: Array,
    required: true
  }
})

const openFaq = ref(null)

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}
</script> 