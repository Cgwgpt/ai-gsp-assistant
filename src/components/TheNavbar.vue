<template>
  <nav :class="[
    'fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300',
    isDarkMode 
      ? 'bg-gray-900/90 backdrop-blur-sm border-gray-800' 
      : 'bg-white/80 backdrop-blur-sm border-gray-100'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <picture>
              <source media="(min-width: 1440px)" :srcset="isDarkMode ? '/images/logo-final-large-dark.svg' : '/images/logo-final-large.svg'">
              <source media="(prefers-color-scheme: dark)" :srcset="isDarkMode ? '/images/logo-final-dark.svg' : '/images/logo-final.svg'">
              <img :src="isDarkMode ? '/images/logo-final-dark.svg' : '/images/logo-final.svg'" alt="数智医药" class="h-8 sm:h-10" />
            </picture>
          </router-link>
        </div>
        
        <!-- 深色模式切换按钮 -->
        <button @click="toggleDarkMode" class="p-2 rounded-full mr-4 focus:outline-none" :class="isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-800'">
          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </button>
        
        <!-- 桌面端菜单 -->
        <div class="hidden md:flex items-center space-x-5">
          <router-link 
            to="/" 
            :class="linkClass"
          >首页</router-link>
          
          <!-- 需要登录的菜单项 -->
          <template v-if="userStore.user">
            <router-link 
              to="/my-bots" 
              :class="linkClass"
            >
              我的数智人
            </router-link>
            <router-link to="/gsp" :class="linkClass">条款速查</router-link>
            <router-link to="/features" :class="linkClass">检查原则</router-link>
            <router-link to="/blog" :class="linkClass">常见缺陷</router-link>
            <router-link 
              to="/bot-selector" 
              :class="linkClass"
            >多数智人对话</router-link>
          </template>
          
          <!-- 未登录时显示登录提示 -->
          <template v-else>
            <a 
              @click="showLoginMessage" 
              :class="[linkClass, 'cursor-pointer']"
            >条款速查</a>
            <a 
              @click="showLoginMessage" 
              :class="[linkClass, 'cursor-pointer']"
            >检查原则</a>
            <a 
              @click="showLoginMessage" 
              :class="[linkClass, 'cursor-pointer']"
            >常见缺陷</a>
            <a 
              @click="showLoginMessage" 
              :class="[linkClass, 'cursor-pointer']"
            >多数智人对话</a>
          </template>
          
          <!-- 用户未登录时显示 -->
          <template v-if="!userStore.user">
            <div :class="['border-l h-6 mx-1', isDarkMode ? 'border-gray-700' : 'border-gray-200']"></div>
            <router-link 
              to="/auth/register" 
              class="text-purple-600 hover:text-purple-700 border border-purple-600 px-4 py-2 rounded-full hover:bg-purple-50 transition-colors"
            >
              注册
            </router-link>
            <router-link 
              to="/auth/login"
              class="text-purple-600 hover:text-purple-700"
            >
              登录
            </router-link>
          </template>
          
          <!-- 用户已登录时显示 -->
          <template v-else>
            <div :class="['border-l h-6 mx-1', isDarkMode ? 'border-gray-700' : 'border-gray-200']"></div>
            <div class="relative" v-if="userStore.isAdmin()">
              <button 
                @click="isAdminMenuOpen = !isAdminMenuOpen" 
                :class="linkClass"
              >
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  管理选项
                  <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                v-show="isAdminMenuOpen" 
                class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1"
              >
                <div class="px-3 py-2 text-sm font-medium text-gray-500">管理选项</div>
                <router-link 
                  to="/admin/users" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    用户管理
                  </span>
                </router-link>
                <router-link 
                  to="/bot-management" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    数智人管理
                  </span>
                </router-link>
                <router-link 
                  to="/bot-authorization" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    授权管理
                  </span>
                </router-link>
                <router-link 
                  to="/admin/usage" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    用量管理
                  </span>
                </router-link>
                <router-link 
                  to="/admin/usage?tab=usage" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    用户使用统计
                  </span>
                </router-link>
              </div>
            </div>
            <router-link 
              v-if="userStore.user"
              to="/usage" 
              :class="linkClass"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                我的用量
              </span>
            </router-link>
            
            <!-- 用户下拉菜单 -->
            <div class="relative">
              <button 
                @click="isUserMenuOpen = !isUserMenuOpen" 
                :class="linkClass"
              >
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ userStore.user.username || userStore.user.email.split('@')[0] }}
                  <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                v-show="isUserMenuOpen" 
                class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1"
              >
                <div class="px-3 py-2 text-sm font-medium text-gray-500">用户选项</div>
                <router-link 
                  to="/auth/reset-password" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    修改密码
                  </span>
                </router-link>
                <button 
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    退出
                  </span>
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="md:hidden flex items-center">
          <button 
            @click="toggleMobileMenu"
            :class="[
              'text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md transition-colors',
              isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'hover:bg-gray-100'
            ]"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端下拉菜单 -->
      <transition 
        name="mobile-menu"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-show="isMenuOpen" class="md:hidden">
          <div :class="[
            'px-2 pt-2 pb-3 space-y-2 border-t rounded-b-lg shadow-lg',
            isDarkMode 
              ? 'bg-gray-900 border-gray-800 text-gray-200' 
              : 'bg-white border-gray-100'
          ]">
            <router-link 
              to="/" 
              :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base']"
              @click="closeMenu"
            >首页</router-link>
            
            <!-- 需要登录的菜单项 -->
            <template v-if="userStore.user">
              <router-link 
                to="/my-bots" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base']"
                @click="closeMenu"
              >
                我的数智人
              </router-link>
              <router-link 
                to="/gsp" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base']"
                @click="closeMenu"
              >条款速查</router-link>
              <router-link 
                to="/features" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base']"
                @click="closeMenu"
              >检查原则</router-link>
              <router-link 
                to="/blog" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base']"
                @click="closeMenu"
              >常见缺陷</router-link>
              <router-link 
                to="/bot-selector" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base']"
                @click="closeMenu"
              >多数智人对话</router-link>
            </template>
            
            <!-- 未登录时显示登录提示 -->
            <template v-else>
              <a 
                @click="showLoginMessage" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base cursor-pointer']"
              >条款速查</a>
              <a 
                @click="showLoginMessage" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base cursor-pointer']"
              >检查原则</a>
              <a 
                @click="showLoginMessage" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base cursor-pointer']"
              >常见缺陷</a>
              <a 
                @click="showLoginMessage" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base cursor-pointer']"
              >多数智人对话</a>
            </template>
            
            <!-- 移动端用户未登录时显示 -->
            <template v-if="!userStore.user">
              <div :class="['border-t my-2', isDarkMode ? 'border-gray-800' : 'border-gray-100']"></div>
              <div class="flex flex-col sm:flex-row gap-2 px-3 py-2">
                <router-link 
                  to="/auth/register" 
                  class="block px-3 py-2 rounded-lg text-center text-base font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                  @click="closeMenu"
                >
                  注册
                </router-link>
                <router-link 
                  to="/auth/login"
                  class="block px-3 py-2 rounded-lg text-center text-base font-medium border transition-colors"
                  :class="isDarkMode 
                    ? 'border-gray-700 text-gray-200 hover:bg-gray-800' 
                    : 'border-purple-600 text-purple-600 hover:bg-purple-50'"
                  @click="closeMenu"
                >
                  登录
                </router-link>
              </div>
            </template>
            
            <!-- 移动端用户已登录时显示 -->
            <template v-else>
              <div :class="['border-t my-2', isDarkMode ? 'border-gray-800' : 'border-gray-100']"></div>
              
              <!-- 管理员选项 - 可折叠面板 -->
              <div v-if="userStore.isAdmin()" class="mb-2">
                <button 
                  @click="isAdminMobileOpen = !isAdminMobileOpen"
                  class="flex items-center justify-between w-full px-3 py-2 rounded-md text-base"
                  :class="mobileLinkClass"
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    管理选项
                  </span>
                  <svg 
                    class="h-4 w-4 transition-transform duration-200" 
                    :class="isAdminMobileOpen ? 'transform rotate-180' : ''"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <transition 
                  name="expand"
                  @enter="expandElement"
                  @leave="collapseElement"
                >
                  <div v-show="isAdminMobileOpen" class="overflow-hidden">
                    <div :class="[
                      'pl-6 space-y-1 rounded-md mt-1',
                      isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                    ]">
                      <router-link 
                        to="/admin/users" 
                        :class="[mobileLinkClass, 'block px-3 py-2 text-sm']"
                        @click="closeMenu"
                      >
                        <span class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          用户管理
                        </span>
                      </router-link>
                      <router-link 
                        to="/bot-management" 
                        :class="[mobileLinkClass, 'block px-3 py-2 text-sm']"
                        @click="closeMenu"
                      >
                        <span class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          数智人管理
                        </span>
                      </router-link>
                      <router-link 
                        to="/bot-authorization" 
                        :class="[mobileLinkClass, 'block px-3 py-2 text-sm']"
                        @click="closeMenu"
                      >
                        <span class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          授权管理
                        </span>
                      </router-link>
                      <router-link 
                        to="/admin/usage" 
                        :class="[mobileLinkClass, 'block px-3 py-2 text-sm']"
                        @click="closeMenu"
                      >
                        <span class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          用量管理
                        </span>
                      </router-link>
                      <router-link 
                        to="/admin/usage?tab=usage" 
                        :class="[mobileLinkClass, 'block px-3 py-2 text-sm']"
                        @click="closeMenu"
                      >
                        <span class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          用户使用统计
                        </span>
                      </router-link>
                    </div>
                  </div>
                </transition>
              </div>
              
              <router-link 
                v-if="userStore.user"
                to="/usage" 
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base']"
                @click="closeMenu"
              >
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  我的用量
                </span>
              </router-link>
              
              <!-- 用户信息与退出 -->
              <div :class="['border-t my-2', isDarkMode ? 'border-gray-800' : 'border-gray-100']"></div>
              <div :class="[
                'px-3 py-2 mb-2 flex items-center rounded-md',
                isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span :class="[
                  'font-medium', 
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                ]">
                  {{ userStore.user.username || userStore.user.email.split('@')[0] }}
                </span>
              </div>
              <router-link 
                to="/auth/reset-password"
                :class="[mobileLinkClass, 'block px-3 py-2 rounded-md text-base']"
                @click="closeMenu"
              >
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  修改密码
                </span>
              </router-link>
              <button 
                @click="handleLogout"
                :class="[mobileLinkClass, 'block w-full text-left px-3 py-2 rounded-md text-base']"
              >
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  退出
                </span>
              </button>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const isMenuOpen = ref(false)
const isAdminMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const isDarkMode = ref(false)
const isAdminMobileOpen = ref(false)

// 链接样式计算属性
const linkClass = computed(() => 
  isDarkMode.value 
    ? 'text-gray-300 hover:text-white' 
    : 'text-gray-600 hover:text-gray-900'
)

// 移动端链接样式计算属性
const mobileLinkClass = computed(() => 
  isDarkMode.value 
    ? 'text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors' 
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors'
)

// 切换移动端菜单
function toggleMobileMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (!isMenuOpen.value) {
    isAdminMobileOpen.value = false
  }
}

// 关闭菜单
function closeMenu() {
  isMenuOpen.value = false
  isAdminMobileOpen.value = false
}

// 折叠面板展开动画
function expandElement(el) {
  const height = el.scrollHeight
  el.style.height = '0px'
  // 触发回流
  el.offsetHeight
  el.style.height = height + 'px'
}

// 折叠面板收起动画
function collapseElement(el) {
  const height = el.scrollHeight
  el.style.height = height + 'px'
  // 触发回流
  el.offsetHeight
  el.style.height = '0px'
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value ? 'enabled' : 'disabled')
}

// 初始化深色模式设置
if (typeof window !== 'undefined') {
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode === 'enabled') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else if (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/auth/login')
}

const showLoginMessage = () => {
  alert('请先登录后使用此功能')
  router.push('/auth/login')
}
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* 添加导航栏项目悬停效果 */
.md\:flex a, .md\:flex button {
  position: relative;
  transition: all 0.2s ease;
}

.md\:flex a::after, .md\:flex button::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #8b5cf6;
  transition: width 0.3s ease;
}

.md\:flex a:hover::after, .md\:flex button:hover::after {
  width: 100%;
}

/* 下拉菜单效果 */
.absolute {
  border: 1px solid #f3f4f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
  animation: dropdown-appear 0.2s ease-out;
}

@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 下拉菜单项悬停效果 */
.absolute a:hover, .absolute button:hover {
  transition: all 0.2s ease;
}

/* 下拉菜单标题样式 */
.absolute .px-3.py-2.text-sm.font-medium.text-gray-500 {
  border-bottom: 1px solid #f3f4f6;
  background-color: #f9fafb;
}

/* 暗色模式下拉菜单样式 */
.dark .absolute {
  border-color: #374151;
  background-color: #1f2937;
}

.dark .absolute a, .dark .absolute button {
  color: #e5e7eb;
}

.dark .absolute a:hover, .dark .absolute button:hover {
  background-color: #374151;
  color: #f9fafb;
}

.dark .absolute .px-3.py-2.text-sm.font-medium.text-gray-500 {
  border-bottom-color: #374151;
  background-color: #111827;
  color: #9ca3af;
}

/* 折叠面板动画 */
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
}
</style> 