<template>
    <div class="relative overflow-hidden bg-gradient-to-br from-gray-900 to-purple-900 py-20 md:py-32">
      <!-- 背景动画效果 -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-0 w-full h-full bg-grid-pattern animate-pulse-slow"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-circuit-pattern animate-float-slow"></div>
      </div>
      
      <!-- 主内容 -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-12">
          <!-- 左侧文字内容 -->
          <div class="md:w-1/2 text-white">
            <div class="inline-flex items-center bg-purple-500 bg-opacity-20 border border-purple-400 rounded-full px-4 py-1 text-sm text-purple-300 mb-6 transform hover:scale-105 transition-transform">
              DeepSeek 医药智能平台
              <ChevronRightIcon class="w-4 h-4 ml-1" />
            </div>
            
            <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 animate-gradient">AI赋能医药企业</span>
              <br />GSP合规全流程解决方案
            </h1>
            
            <p class="text-gray-300 text-lg mb-8 leading-relaxed">
              基于DeepSeek大模型打造的医药行业垂直应用，提供智能合规检查、自动生成整改报告、
              专业咨询顾问和全天候合规助手，让GSP合规管理更简单、更高效、更专业。
            </p>
            
            <div class="flex flex-wrap gap-4">
              <router-link to="/auth/login" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center transform hover:translate-y-[-2px] hover:shadow-lg">
                <RocketIcon class="w-5 h-5 mr-2" />
                立即部署体验
              </router-link>
              <router-link to="/features" class="bg-transparent border border-purple-400 hover:bg-purple-600 hover:bg-opacity-20 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center transform hover:translate-y-[-2px]">
                <InfoIcon class="w-5 h-5 mr-2" />
                了解更多
              </router-link>
            </div>
            
            <!-- 关键特点简介 -->
            <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-start group hover:bg-purple-900 hover:bg-opacity-20 p-2 rounded-lg transition-all">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3 group-hover:bg-purple-500 group-hover:bg-opacity-30 transition-all">
                  <ShieldCheckIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">智能合规检查</h3>
                  <p class="text-sm text-gray-400">自动筛查GSP违规风险点</p>
                </div>
              </div>
              <div class="flex items-start group hover:bg-purple-900 hover:bg-opacity-20 p-2 rounded-lg transition-all">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3 group-hover:bg-purple-500 group-hover:bg-opacity-30 transition-all">
                  <FileTextIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">自动整改报告</h3>
                  <p class="text-sm text-gray-400">一键生成专业整改方案</p>
                </div>
              </div>
              <div class="flex items-start group hover:bg-purple-900 hover:bg-opacity-20 p-2 rounded-lg transition-all">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3 group-hover:bg-purple-500 group-hover:bg-opacity-30 transition-all">
                  <BrainCircuitIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">垂直领域知识</h3>
                  <p class="text-sm text-gray-400">医药行业专属大模型</p>
                </div>
              </div>
              <div class="flex items-start group hover:bg-purple-900 hover:bg-opacity-20 p-2 rounded-lg transition-all">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3 group-hover:bg-purple-500 group-hover:bg-opacity-30 transition-all">
                  <CloudIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">便捷部署体验</h3>
                  <p class="text-sm text-gray-400">十分钟完成DeepSeek部署</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧展示图 -->
          <div class="md:w-1/2 relative transform hover:translate-y-[-5px] transition-transform duration-500">
            <div class="relative z-10 bg-gradient-to-br from-purple-800 to-indigo-900 p-2 rounded-2xl shadow-2xl overflow-hidden">
              <!-- 顶部仿浏览器UI -->
              <div class="bg-gray-800 flex items-center rounded-t-xl p-3">
                <div class="flex space-x-2">
                  <div class="h-3 w-3 bg-red-500 rounded-full"></div>
                  <div class="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <div class="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                <div class="mx-auto bg-gray-700 rounded-full px-4 py-1 text-xs text-gray-300 flex items-center">
                  <LockIcon class="w-3 h-3 mr-1" />
                  ai-gsp.deepseek-med.com
                </div>
              </div>
              
              <!-- 屏幕内容 -->
              <div class="p-4 bg-gray-950">
                <div 
                  class="rounded-lg shadow-lg w-full h-48 bg-gray-800 flex items-center justify-center overflow-hidden relative"
                >
                  <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
                  <div class="relative z-10">
                    <div class="text-gray-400 text-lg font-medium">AI GSP 智能分析平台</div>
                    <div class="flex items-center justify-center mt-2">
                      <div class="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                      <div class="text-gray-500 text-sm">系统运行中</div>
                    </div>
                  </div>
                </div>
                
                <!-- AI交互效果示意 -->
                <div class="mt-4 bg-gray-800 rounded-lg p-3">
                  <div class="flex items-start mb-3">
                    <div class="bg-purple-600 rounded-full p-2 mr-2">
                      <BotIcon class="w-4 h-4 text-white" />
                    </div>
                    <div class="bg-gray-700 rounded-lg p-2 text-xs text-gray-300 typing-animation">
                      我已检测到3个严重缺陷项，7个主要缺陷项。正在生成整改建议报告...
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="bg-gray-700 rounded-lg p-2 flex-1 transition-all focus-within:ring-2 focus-within:ring-purple-500">
                      <input type="text" placeholder="请输入您的GSP合规问题..." class="bg-transparent text-gray-300 text-xs w-full outline-none" />
                    </div>
                    <button class="ml-2 bg-purple-600 hover:bg-purple-700 rounded-full p-2 transition-colors">
                      <SendIcon class="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 装饰元素 -->
            <div class="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
            <div class="absolute -top-6 -left-6 w-48 h-48 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-float-slow"></div>
          </div>
        </div>
        
        <!-- 合作伙伴信息 -->
        <div class="mt-20 text-center">
          <p class="text-gray-400 mb-6 text-sm">受到行业领先企业信赖</p>
          <div class="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div class="h-8 w-24 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-sm hover:bg-gray-700 transition-colors">科济医药</div>
            <div class="h-8 w-24 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-sm hover:bg-gray-700 transition-colors">百济神州</div>
            <div class="h-8 w-24 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-sm hover:bg-gray-700 transition-colors">华润医药</div>
            <div class="h-8 w-24 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-sm hover:bg-gray-700 transition-colors">阿里健康</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { 
    ChevronRightIcon, 
    RocketIcon, 
    InfoIcon, 
    ShieldCheckIcon, 
    FileTextIcon, 
    BrainCircuitIcon, 
    CloudIcon, 
    LockIcon, 
    BotIcon, 
    SendIcon 
  } from 'lucide-vue-next'
  </script>
  
  <style scoped>
  .bg-grid-pattern {
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  .bg-circuit-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.03)' fill-rule='evenodd'/%3E%3C/svg%3E");
  }

  .animate-pulse-slow {
    animation: pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-float-slow {
    animation: float 7s ease-in-out infinite;
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradientMovement 5s ease infinite;
  }

  .typing-animation {
    position: relative;
  }

  .typing-animation::after {
    content: '|';
    position: absolute;
    right: 0;
    animation: typing 1s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.1;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes gradientMovement {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes typing {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  </style> 