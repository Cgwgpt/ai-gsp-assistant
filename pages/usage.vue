<template>
  <div class="usage-page">
    <h1 class="text-2xl font-bold mb-6">我的使用情况</h1>
    
    <UserUsageDashboard />
  </div>
</template>

<script setup>
import UserUsageDashboard from '../components/user/UsageDashboard.vue'
import { useSupabase } from '../composables/useSupabase'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user } = useSupabase()

// 检查用户是否登录
onMounted(async () => {
  if (!user.value) {
    router.push('/login')
  }
})
</script>

<style scoped>
.usage-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}
</style> 