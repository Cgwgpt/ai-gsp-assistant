<template>
  <div class="admin-usage-page">
    <h1 class="text-2xl font-bold mb-6">用户用量管理</h1>
    
    <UsageQuotaManager :initial-active-tab="activeTab" />
  </div>
</template>

<script setup>
import UsageQuotaManager from '../../components/admin/UsageQuotaManager.vue'
import { useSupabase } from '../../../composables/useSupabase'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { user } = useSupabase()
const isAdmin = ref(false)
const activeTab = ref('quotas') // 默认标签页

// 检查当前用户是否是管理员
const checkAdminStatus = async () => {
  const { supabase } = useSupabase()
  
  if (!user.value) {
    router.push('/login')
    return
  }
  
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single()
    
    if (profile && profile.role === 'admin') {
      isAdmin.value = true
      
      // 根据URL参数设置初始标签页
      if (route.query.tab === 'usage') {
        activeTab.value = 'usage'
      } else if (route.query.tab === 'quotas') {
        activeTab.value = 'quotas'
      }
    } else {
      // 如果不是管理员，重定向到首页
      router.push('/')
    }
  } catch (error) {
    console.error('获取用户角色失败:', error)
    router.push('/')
  }
}

onMounted(async () => {
  await checkAdminStatus()
})
</script>

<style scoped>
.admin-usage-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}
</style> 