<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">用户管理</h2>
    
    <div v-if="loading" class="text-center">
      加载中...
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手机号</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">单位名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.organization }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                v-model="user.role"
                @change="updateUserRole(user)"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="deleteUser(user.id)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const users = ref([])
const loading = ref(true)

// 检查是否是管理员
const checkAdmin = async () => {
  if (!userStore.isAdmin()) {
    router.push('/')
  }
}

// 获取所有用户
const fetchUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    users.value = data
  } catch (error) {
    console.error('获取用户列表错误:', error.message)
  } finally {
    loading.value = false
  }
}

// 更新用户角色
const updateUserRole = async (user) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: user.role })
      .eq('id', user.id)

    if (error) throw error
  } catch (error) {
    console.error('更新用户角色错误:', error.message)
  }
}

// 删除用户
const deleteUser = async (userId) => {
  if (!confirm('确定要删除该用户吗？')) return

  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) throw error

    // 从列表中移除用户
    users.value = users.value.filter(u => u.id !== userId)
  } catch (error) {
    console.error('删除用户错误:', error.message)
  }
}

onMounted(async () => {
  await checkAdmin()
  await fetchUsers()
})
</script> 