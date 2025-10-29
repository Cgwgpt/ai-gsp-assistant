<template>
  <div>
    <!-- Hero部分 -->
    <div class="relative overflow-hidden bg-gradient-to-br from-gray-900 to-purple-900 py-20 md:py-32">
      <!-- 背景动画效果 -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-circuit-pattern"></div>
      </div>
      
      <!-- 主内容 -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-12">
          <!-- 左侧文字内容 -->
          <div class="md:w-1/2 text-white">
            <div class="inline-flex items-center bg-purple-500 bg-opacity-20 border border-purple-400 rounded-full px-4 py-1 text-sm text-purple-300 mb-6">
              DeepSeek 医药智能平台
              <ChevronRightIcon class="w-4 h-4 ml-1" />
            </div>
            
            <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">AI赋能医药企业</span>
              <br />DeepSeek大模型数智人解决方案
            </h1>
            
            <p class="text-gray-300 text-lg mb-8 leading-relaxed">
              基于DeepSeek大模型打造的医药行业垂直应用数智人，提供GSP条款智能(检索、判定、检查指南),自动生成整改报告、
              识病用药AI专家级顾问、AI辅助专业销售策略的全天候AI数智人助手，让管理更智能、更专业、更高效。
            </p>
            
            <div class="flex flex-wrap gap-4">
              <a href="#" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center">
                <RocketIcon class="w-5 h-5 mr-2" />
                立即部署体验
              </a>
              <a href="#" class="bg-transparent border border-purple-400 hover:bg-purple-600 hover:bg-opacity-20 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center">
                <InfoIcon class="w-5 h-5 mr-2" />
                了解更多
              </a>
            </div>
            
            <!-- 关键特点简介 -->
            <div class="mt-10 grid grid-cols-2 gap-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3">
                  <ShieldCheckIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">GSP检查智能辅助</h3>
                  <p class="text-sm text-gray-400">缺陷风险点智能识别</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3">
                  <FileTextIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">自动撰写报告</h3>
                  <p class="text-sm text-gray-400">一键生成专业整改报告</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3">
                  <BrainCircuitIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">垂直领域应用</h3>
                  <p class="text-sm text-gray-400">AI医药行业专属大模型</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3">
                  <CloudIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">便捷部署体验</h3>
                  <p class="text-sm text-gray-400">在线SAAS服务 本地化部署</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧轮播图 -->
          <div class="md:w-1/2 relative">
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
              
              <!-- 轮播图内容 -->
              <div class="bg-gray-950 p-4">
                <div class="carousel-container relative">
                  <!-- 轮播内容 -->
                  <div class="carousel-slide w-full h-68 bg-gray-800 rounded-lg overflow-hidden relative" 
                       v-for="(slide, index) in carouselSlides" 
                       :key="index"
                       v-show="currentSlide === index"
                       :class="[
                         index === 0 ? 'slide-left' : '', 
                         index === 1 ? 'slide-up' : '', 
                         index === 2 ? 'slide-right' : ''
                       ]">
                    <div class="absolute inset-0 p-4" :class="slide.bgClass">
                      <!-- 背景装饰元素 -->
                      <div class="absolute top-0 right-0 w-32 h-32 opacity-20" :class="slide.decorClass"></div>
                      <div class="absolute bottom-0 left-0 w-24 h-24 opacity-20" :class="slide.decor2Class"></div>
                      
                      <!-- 内容部分 - 不同布局 -->
                      <div v-if="index === 0" class="relative z-10 h-full flex flex-col items-center justify-center">
                        <div :class="slide.iconClass" class="rounded-full p-3 mb-4 shadow-lg animate-pulse">
                          <component :is="slide.icon" class="w-8 h-8 text-white" />
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">{{ slide.title }}</h3>
                        <p class="text-gray-100 text-sm max-w-xs">{{ slide.description }}</p>
                        
                        <!-- 风险等级指示器 -->
                        <div class="mt-4 w-full max-w-xs bg-gray-700 bg-opacity-50 rounded-lg p-2">
                          <div class="flex items-center justify-between mb-1">
                            <span class="text-xs text-white">风险等级检测</span>
                            <span class="text-xs text-white">78%</span>
                          </div>
                          <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full" style="width: 78%"></div>
                          </div>
                          <div class="flex justify-between mt-2">
                            <span class="px-2 py-0.5 text-xs bg-red-500 rounded-full text-white">严重: 2</span>
                            <span class="px-2 py-0.5 text-xs bg-yellow-500 rounded-full text-white">中等: 5</span>
                            <span class="px-2 py-0.5 text-xs bg-green-500 rounded-full text-white">轻微: 8</span>
                          </div>
                        </div>
                      </div>
                      
                      <div v-else-if="index === 1" class="relative z-10 h-full grid grid-cols-2 gap-2">
                        <div class="flex flex-col justify-center items-start p-3">
                          <div :class="slide.iconClass" class="rounded-full p-3 mb-4 shadow-lg">
                            <component :is="slide.icon" class="w-8 h-8 text-white" />
                          </div>
                          <h3 class="text-xl font-bold text-white mb-2">{{ slide.title }}</h3>
                          <p class="text-gray-100 text-sm">{{ slide.description }}</p>
                        </div>
                        <div class="flex flex-col justify-center items-center">
                          <div class="relative w-36 h-48 bg-white bg-opacity-10 rounded-lg p-2 transform rotate-3 shadow-lg">
                            <div class="absolute top-0 right-0 w-8 h-8 bg-blue-500 rounded-full transform translate-x-2 -translate-y-2 flex items-center justify-center text-xs text-white font-bold">GSP</div>
                            <div class="h-6 w-24 bg-blue-200 rounded mb-2"></div>
                            <div class="h-3 w-full bg-blue-200 bg-opacity-40 rounded mb-1"></div>
                            <div class="h-3 w-full bg-blue-200 bg-opacity-40 rounded mb-1"></div>
                            <div class="h-3 w-3/4 bg-blue-200 bg-opacity-40 rounded mb-3"></div>
                            <div class="h-20 w-full bg-blue-200 bg-opacity-20 rounded flex items-center justify-center">
                              <div class="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div class="h-4 w-24 mx-auto mt-2 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div v-else class="relative z-10 h-full flex">
                        <div class="w-2/5 flex flex-col justify-center items-center">
                          <div :class="slide.iconClass" class="rounded-full p-3 mb-4 shadow-lg">
                            <component :is="slide.icon" class="w-8 h-8 text-white" />
                          </div>
                          <h3 class="text-xl font-bold text-white mb-2 text-center">{{ slide.title }}</h3>
                        </div>
                        <div class="w-3/5 flex flex-col justify-center p-2">
                          <p class="text-gray-100 text-sm mb-2">{{ slide.description }}</p>
                          
                          <!-- 聊天消息模拟 -->
                          <div class="bg-teal-800 bg-opacity-50 rounded-lg p-2 mb-2 max-w-xs ml-auto">
                            <p class="text-xs text-white">储存区温度超出规定范围，如何处理？</p>
                          </div>
                          <div class="bg-teal-600 bg-opacity-50 rounded-lg p-2 max-w-xs">
                            <p class="text-xs text-white">根据GSP规范，应立即记录温度异常，隔离受影响药品，评估影响并上报...</p>
                            <div class="flex items-center mt-1">
                              <div class="w-1 h-1 bg-white rounded-full opacity-70 mr-1 animate-pulse"></div>
                              <div class="w-1 h-1 bg-white rounded-full opacity-70 mr-1 animate-pulse" style="animation-delay: 0.2s"></div>
                              <div class="w-1 h-1 bg-white rounded-full opacity-70 animate-pulse" style="animation-delay: 0.4s"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- AI交互效果示意 -->
                <div class="mt-4 bg-gray-800 rounded-lg p-3">
                  <div class="flex items-start mb-3">
                    <div class="bg-purple-600 rounded-full p-2 mr-2">
                      <BotIcon class="w-4 h-4 text-white" />
                    </div>
                    <div class="bg-gray-700 rounded-lg p-2 text-xs text-gray-300">
                      检查发现1个严重缺陷项，5个主要缺陷项。缺陷项整改建议报告生成...
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="bg-gray-700 rounded-lg p-2 flex-1">
                      <input type="text" placeholder="请输入缺陷问题..." class="bg-transparent text-gray-300 text-xs w-full outline-none" />
                    </div>
                    <button class="ml-2 bg-purple-600 rounded-full p-2">
                      <SendIcon class="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                
                <!-- 轮播控制器 - 移至图框下方 -->
                <div class="carousel-controls flex justify-center space-x-3 mt-4">
                  <button v-for="(slide, index) in carouselSlides" 
                          :key="index" 
                          @click="setActiveSlide(index)"
                          class="transition-all duration-300 relative focus:outline-none group">
                    <div class="w-12 h-1 rounded-full"
                         :class="currentSlide === index ? [slide.btnActiveClass, 'h-2'] : 'bg-gray-600'"></div>
                    <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {{ slide.title }}
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 装饰元素 -->
            <div class="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
            <div class="absolute -top-6 -left-6 w-48 h-48 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
          </div>
        </div>
        
        <!-- 合作伙伴信息 -->
        <div class="mt-20 text-center">
          <div class="relative mb-8 text-center">
            <h3 class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 font-bold text-lg uppercase tracking-wider animate-pulse">
              ✨ 各类企业从中受益 ✨
            </h3>
            <div class="absolute -bottom-2 left-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent transform -translate-x-1/2"></div>
          </div>
          <div class="flex flex-wrap justify-center items-center gap-6">
            <div class="h-12 px-6 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 backdrop-blur rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 cursor-pointer border border-purple-500/30 group">
              <span class="mr-2 text-purple-200 group-hover:text-white transition-colors">🏢</span>
              医药公司
            </div>
            <div class="h-12 px-6 bg-gradient-to-r from-indigo-600/40 to-blue-600/40 backdrop-blur rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 cursor-pointer border border-indigo-500/30 group">
              <span class="mr-2 text-indigo-200 group-hover:text-white transition-colors">🏪</span>
              连锁药房
            </div>
            <div class="h-12 px-6 bg-gradient-to-r from-blue-600/40 to-cyan-600/40 backdrop-blur rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-500/30 group">
              <span class="mr-2 text-blue-200 group-hover:text-white transition-colors">🏛️</span>
              医药集团
            </div>
            <div class="h-12 px-6 bg-gradient-to-r from-cyan-600/40 to-teal-600/40 backdrop-blur rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 cursor-pointer border border-cyan-500/30 group">
              <span class="mr-2 text-cyan-200 group-hover:text-white transition-colors">🛒</span>
              医药电商
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Framework Support部分 -->
    <div class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">AI赋能医药数智化转型</span>
        </h2>
        <p class="text-center text-gray-600 mb-12">行业领先，端到端智能解决方案</p>
        
        <!-- 图示技术流程 -->
        <div class="relative mx-auto mb-16">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 relative">
            <!-- 流程图背景连接线 -->
            <div class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transform -translate-y-1/2 z-0"></div>
            
            <!-- 流程节点 -->
            <div class="relative z-10 w-full md:w-1/4 flex flex-col items-center">
              <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-4 border-2 border-purple-500">
                <DatabaseIcon class="w-7 h-7 text-purple-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">完整合规数据库</h3>
              <p class="text-gray-600 text-center text-sm">基于最新GSP法规构建<br/>完整行业知识体系</p>
            </div>
            
            <div class="relative z-10 w-full md:w-1/4 flex flex-col items-center">
              <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-4 border-2 border-purple-500">
                <BrainCircuitIcon class="w-7 h-7 text-purple-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">大模型技术训练</h3>
              <p class="text-gray-600 text-center text-sm">DeepSeek大模型<br/>医药行业专项训练</p>
            </div>
            
            <div class="relative z-10 w-full md:w-1/4 flex flex-col items-center">
              <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-4 border-2 border-purple-500">
                <SearchCodeIcon class="w-7 h-7 text-purple-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">GSP合规智能</h3>
              <p class="text-gray-600 text-center text-sm">现场AI专家指导<br/>智能识别缺陷、生成整改方案</p>
            </div>
            
            <div class="relative z-10 w-full md:w-1/4 flex flex-col items-center">
              <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-4 border-2 border-purple-500">
                <UsersIcon class="w-7 h-7 text-purple-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">专家级咨询</h3>
              <p class="text-gray-600 text-center text-sm">随时随地提供<br/>智能专家专业解答</p>
            </div>
          </div>
        </div>
        
        <!-- 主要功能展示 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105">
            <div class="h-48 bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <ShieldCheckIcon class="w-16 h-16 text-white opacity-80" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-800">智能缺陷识别</h3>
              <p class="text-gray-600 mb-4">
                基于最新GSP法规，AI智能识别缺陷及潜在风险点问题，帮助提前预防和管控。
              </p>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  缺陷等级识别
                </li>
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  合规风险评估与分级
                </li>
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  GSP检查要点全覆盖
                </li>
              </ul>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105">
            <div class="h-48 bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
              <FileTextIcon class="w-16 h-16 text-white opacity-80" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-800">智能报告生成</h3>
              <p class="text-gray-600 mb-4">
                一键生成专业的GSP合规整改报告、节省人力成本，确保报告质量符合监管要求。
              </p>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  整改报告智能撰写
                </li>
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  整改方案定制建议
                </li>
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  报告多样化可扩展
                </li>
              </ul>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105">
            <div class="h-48 bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <BotIcon class="w-16 h-16 text-white opacity-80" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-800">专家级随身顾问</h3>
              <p class="text-gray-600 mb-4">
                7x24小时随时随地在线咨询，为您解答难题、用药指导、销售策略等问题，犹如医药行业专家随身携带。
              </p>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  专业问题即问即答
                </li>
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  条款解读精准权威
                </li>
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  多场景业务咨询支持
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features部分 -->
    <div class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 标题区域 -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-bold mb-4">数智医药 · 合规无忧</h2>
          <p class="text-gray-600">
            DeepSeek大模型赋能医药，让您的企业管理更高效、更专业、更智能，进入AI医药时代。
          </p>
        </div>

        <!-- 主要特点网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 特点1：智能条款解读 -->
          <div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200 transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg mr-4">
                <BookOpenTextIcon class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold">智能条款解读</h3>
            </div>
            <p class="text-gray-600 mb-4">
              基于DeepSeek大模型对GSP法规深度理解、AI专家库能力、智能解读GSP条款，提供权威的解读、管理应用、现场检查指导。
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>实时跟踪最新法规变化</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>精确解读合规要点</span>
              </li>
            </ul>
          </div>
          
          <!-- 特点2：智能风险识别 -->
          <div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200 transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg mr-4">
                <AlertCircleIcon class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold">智能缺陷风险识别</h3>
            </div>
            <p class="text-gray-600 mb-4">
              通过AI分析，识别潜在的缺陷风险点，严重级别分类展示。
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>严重、主要、一般缺陷分级</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>现场预警、即时指导纠正、防患于未然</span>
              </li>
            </ul>
          </div>
          
          <!-- 特点3：报告自动生成 -->
          <div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200 transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg mr-4">
                <ClipboardEditIcon class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold">报告自动生成</h3>
            </div>
            <p class="text-gray-600 mb-4">
              一键生成专业的整改方案报告，指导提高工作效率，确保整改质量。
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>整改报告专业化撰写</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>多种报告模板可选</span>
              </li>
            </ul>
          </div>
          
          <!-- 特点4：AI辅助决策 -->
          <div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200 transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg mr-4">
                <LightbulbIcon class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold">AI辅助决策</h3>
            </div>
            <p class="text-gray-600 mb-4">
              基于AI分析数据，为企业提供战略性的管理建议，帮助管理层做出更明智的决策。
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>数据驱动合规决策</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>合规投入优化建议</span>
              </li>
            </ul>
          </div>
          
          <!-- 特点5：专家级咨询 -->
          <div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200 transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg mr-4">
                <HeadphonesIcon class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold">专家级咨询</h3>
            </div>
            <p class="text-gray-600 mb-4">
              拥有AI助手随时随地为您解答GSP问题、医药销售策略、识病用药等专业问题，就像专家随身携带。
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>7x24小时在线咨询</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>专业问题现场解答</span>
              </li>
            </ul>
          </div>
          
          <!-- 特点6：便捷部署 -->
          <div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200 transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg mr-4">
                <RocketIcon class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold">部署即刻体验</h3>
            </div>
            <p class="text-gray-600 mb-4">
              支持公有云、私有云、混合云等多种部署方式，满足不同规模企业需求。
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>无需复杂IT基础设施</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>快速上手，即刻体验</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
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
  SendIcon,
  CheckIcon,
  DatabaseIcon,
  SearchCodeIcon,
  UsersIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClipboardEditIcon,
  LightbulbIcon,
  HeadphonesIcon,
  BookOpenTextIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  MessageCircleIcon,
  ChevronDownIcon
} from 'lucide-vue-next'

// 轮播图数据
const carouselSlides = [
  {
    title: "条款智能识别",
    description: "AI智能识别缺陷项，进行等级评估和提示",
    icon: ShieldCheckIcon,
    iconClass: "bg-gradient-to-r from-purple-600 to-indigo-600",
    bgClass: "bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900",
    decorClass: "bg-purple-500 rounded-full blur-xl",
    decor2Class: "bg-indigo-500 rounded-full blur-xl",
    btnActiveClass: "bg-gradient-to-r from-purple-500 to-indigo-500"
  },
  {
    title: "报告生成",
    description: "根据缼陷问题，一键生成整改报告，提供详细的缺陷项分析和整改方案建议，助力合规管理",
    icon: FileTextIcon,
    iconClass: "bg-gradient-to-r from-blue-600 to-cyan-600",
    bgClass: "bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900",
    decorClass: "bg-blue-500 rounded-full blur-xl",
    decor2Class: "bg-cyan-500 rounded-full blur-xl",
    btnActiveClass: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
  {
    title: "专家级别服务",
    description: "7×24小时智能顾问，基于医药行业知识库，为企业提供专业行业咨询和解决方案",
    icon: BrainCircuitIcon,
    iconClass: "bg-gradient-to-r from-teal-600 to-emerald-600",
    bgClass: "bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900",
    decorClass: "bg-teal-500 rounded-full blur-xl",
    decor2Class: "bg-emerald-500 rounded-full blur-xl",
    btnActiveClass: "bg-gradient-to-r from-teal-500 to-emerald-500"
  }
];

// 当前显示的轮播图
const currentSlide = ref(0);
let carouselTimer = null;

// 自动轮播功能
const startCarousel = () => {
  carouselTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselSlides.length;
  }, 5000);
};

// 设置当前轮播图
const setActiveSlide = (index) => {
  // 清除当前定时器
  if (carouselTimer) {
    clearInterval(carouselTimer);
  }
  // 设置新的轮播图
  currentSlide.value = index;
  // 重新开始轮播
  startCarousel();
};

// 组件挂载时启动轮播
onMounted(() => {
  startCarousel();
});

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (carouselTimer) {
    clearInterval(carouselTimer);
  }
});

// 框架数据
const frameworks = [
  { name: '虚拟机', logo: '/vm-logo.svg' },
  { name: 'OpenAI', logo: '/openai-logo.svg' },
  { name: 'K8S', logo: '/k8s-logo.svg' },
  { name: 'DogCloud', logo: '/dogcloud-logo.svg' },
  { name: '腾讯云', logo: '/tencent-logo.svg' },  
  { name: '微信支付宝', logo: '/wechat-logo.svg' }
]
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* 背景图案 */
.bg-grid-pattern {
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.bg-circuit-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.03)' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* 轮播图动画 */
.carousel-slide {
  animation-duration: 0.7s;
  animation-fill-mode: both;
}

@keyframes fadeEffect {
  from { opacity: 0.4; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideInLeft {
  from { transform: translateX(-40px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(40px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInUp {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.slide-left {
  animation-name: slideInLeft;
}

.slide-right {
  animation-name: slideInRight;
}

.slide-up {
  animation-name: slideInUp;
}

.carousel-controls button:hover .w-12 {
  transform: scaleY(1.5);
}

/* 自定义类 */
.h-68 {
  height: 17rem;
}
</style> 