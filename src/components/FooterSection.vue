<template>
  <div>
    <h3 class="font-semibold mb-4">{{ title }}</h3>
    <ul class="space-y-2">
      <li v-for="link in links" :key="link.text">
        <a :href="link.url" class="text-gray-400 hover:text-white">{{ link.text }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  links: {
    type: Array,
    required: true
  }
})
</script> 