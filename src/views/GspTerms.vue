<template>
  <div class="min-h-screen bg-white">
    <TheNavbar />
    <div class="pt-24 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- 抽屉式菜单 -->
        <div class="mb-8">
          <div class="flex gap-4 justify-center">
            <button 
              @click="activeType = 'retail'"
              :class="['menu-tab', { active: activeType === 'retail' }]"
            >
              零售企业GSP检查条款速查
            </button>
            <button 
              @click="activeType = 'wholesale'"
              :class="['menu-tab', { active: activeType === 'wholesale' }]"
            >
              批发企业GSP检查条款速查
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="content-area">
          <transition name="slide" mode="out-in">
            <div :key="activeType" class="bg-white rounded-lg shadow-lg p-6">
              <div v-if="activeType === 'retail'">
                <p class="text-center text-gray-600 mb-8">零售企业检查项目共176项，其中严重缺陷项目（**）8项，主要缺陷项（*）53项，一般缺陷项115项</p>
                <retail-gsp-items></retail-gsp-items>
              </div>
              <div v-else>
                <p class="text-center text-gray-600 mb-8">批发企业检查项目共256项，其中严重缺陷项目（**）10项，主要缺陷项（*）103项，一般缺陷项143项</p>
                <wholesale-gsp-items></wholesale-gsp-items>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TheNavbar from '../components/TheNavbar.vue'
import RetailGspItems from '../gspCheckItemsApp.vue'
import WholesaleGspItems from '../pgspCheckItemsApp.vue'

const activeType = ref('retail')
</script>

<style scoped>
.menu-tab {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.menu-tab:hover {
  background: #e5e7eb;
}

.menu-tab.active {
  background: #1976d2;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(25, 118, 210, 0.1), 0 2px 4px -1px rgba(25, 118, 210, 0.06);
}

.content-area {
  position: relative;
  min-height: 400px;
}

/* 滑动过渡效果 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style> 