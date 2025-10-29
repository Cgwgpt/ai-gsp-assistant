<template>
  <div class="min-h-screen bg-white">
    <!-- 导航栏 -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- 品牌标识 -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 bg-purple-600 bg-opacity-20 rounded-full flex items-center justify-center">
                <span class="text-purple-400 font-bold">AI</span>
              </div>
            </div>
            <div class="ml-2">
              <span class="text-white font-bold text-lg">AI GSP</span>
              <span class="text-purple-400 text-xs ml-1">医药合规专家</span>
            </div>
          </div>
          
          <!-- 移动端菜单按钮 -->
          <div class="md:hidden">
            <button
              type="button"
              class="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              @click="toggleMobileMenu"
            >
              <span class="sr-only">打开菜单</span>
              <MenuIcon v-if="!isMobileMenuOpen" class="h-6 w-6" />
              <XIcon v-else class="h-6 w-6" />
            </button>
          </div>
          
          <!-- 导航菜单-桌面版 -->
          <nav class="hidden md:flex md:items-center md:space-x-10">
            <a 
              v-for="(item, index) in navigationItems" 
              :key="index"
              :href="item.href" 
              class="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {{ item.name }}
            </a>
          </nav>
          
          <!-- 右侧操作区 -->
          <div class="hidden md:flex items-center space-x-4">
            <a href="#" class="text-sm text-gray-300 hover:text-white transition-colors">
              登录
            </a>
            <a href="#" class="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              立即体验
            </a>
          </div>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div v-show="isMobileMenuOpen" class="md:hidden bg-gray-800 shadow-lg">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a 
            v-for="(item, index) in navigationItems" 
            :key="index"
            :href="item.href" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            {{ item.name }}
          </a>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-700">
          <div class="flex items-center justify-between px-5">
            <a href="#" class="text-sm text-gray-300 hover:text-white transition-colors">
              登录
            </a>
            <a href="#" class="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              立即体验
            </a>
          </div>
        </div>
      </div>
    </header>

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
              <br />GSP合规全流程解决方案
            </h1>
            
            <p class="text-gray-300 text-lg mb-8 leading-relaxed">
              基于DeepSeek大模型打造的医药行业垂直应用，提供智能合规检查、自动生成整改报告、
              专业咨询顾问和全天候合规助手，让GSP合规管理更简单、更高效、更专业。
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
                  <h3 class="font-medium text-purple-300">智能合规检查</h3>
                  <p class="text-sm text-gray-400">自动筛查GSP违规风险点</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3">
                  <FileTextIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">自动整改报告</h3>
                  <p class="text-sm text-gray-400">一键生成专业整改方案</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3">
                  <BrainCircuitIcon class="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 class="font-medium text-purple-300">垂直领域知识</h3>
                  <p class="text-sm text-gray-400">医药行业专属大模型</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 bg-purple-500 bg-opacity-20 p-2 rounded-lg mr-3">
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
              
              <!-- 屏幕内容 -->
              <div class="p-4 bg-gray-950">
                <div 
                  class="rounded-lg shadow-lg w-full h-48 bg-gray-800 flex items-center justify-center"
                >
                  <div class="text-gray-400 text-lg">AI GSP 智能分析平台</div>
                </div>
                
                <!-- AI交互效果示意 -->
                <div class="mt-4 bg-gray-800 rounded-lg p-3">
                  <div class="flex items-start mb-3">
                    <div class="bg-purple-600 rounded-full p-2 mr-2">
                      <BotIcon class="w-4 h-4 text-white" />
                    </div>
                    <div class="bg-gray-700 rounded-lg p-2 text-xs text-gray-300">
                      我已检测到3个严重缺陷项，7个主要缺陷项。正在生成整改建议报告...
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="bg-gray-700 rounded-lg p-2 flex-1">
                      <input type="text" placeholder="请输入您的GSP合规问题..." class="bg-transparent text-gray-300 text-xs w-full outline-none" />
                    </div>
                    <button class="ml-2 bg-purple-600 rounded-full p-2">
                      <SendIcon class="w-4 h-4 text-white" />
                    </button>
                  </div>
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
          <p class="text-purple-300 font-medium mb-8 text-sm uppercase tracking-wider">各类企业从中受益</p>
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
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">AI赋能医药GSP合规全流程</span>
        </h2>
        <p class="text-center text-gray-600 mb-12">领先医药行业数字化转型，提供端到端智能合规解决方案</p>
        
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
              <h3 class="text-lg font-semibold text-gray-800 mb-2">GSP合规数据库</h3>
              <p class="text-gray-600 text-center text-sm">基于最新GSP法规构建<br/>完整知识体系</p>
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
              <h3 class="text-lg font-semibold text-gray-800 mb-2">智能检查分析</h3>
              <p class="text-gray-600 text-center text-sm">自动识别风险点<br/>智能生成整改方案</p>
            </div>
            
            <div class="relative z-10 w-full md:w-1/4 flex flex-col items-center">
              <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-4 border-2 border-purple-500">
                <UsersIcon class="w-7 h-7 text-purple-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">专家级咨询</h3>
              <p class="text-gray-600 text-center text-sm">随时随地提供<br/>专业GSP合规建议</p>
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
              <h3 class="text-xl font-bold mb-3 text-gray-800">风险智能检测</h3>
              <p class="text-gray-600 mb-4">
                基于2023年最新GSP法规，AI自动扫描企业运营情况，精准识别潜在风险点和合规问题，帮助提前预防和管控。
              </p>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  严重缺陷自动预警
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
                一键生成专业的GSP合规整改报告、自查报告和合规文档，节省人力成本，确保报告质量符合监管要求。
              </p>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  整改报告自动撰写
                </li>
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  合规方案定制建议
                </li>
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  报告模板多样化选择
                </li>
              </ul>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105">
            <div class="h-48 bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <BotIcon class="w-16 h-16 text-white opacity-80" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-800">专家随身顾问</h3>
              <p class="text-gray-600 mb-4">
                7x24小时随时随地在线咨询，为您解答GSP合规难题、用药指导、销售策略等问题，犹如医药GSP专家随身携带。
              </p>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  专业问题即问即答
                </li>
                <li class="flex items-center">
                  <CheckCircleIcon class="w-4 h-4 text-green-500 mr-2" />
                  法规解读精准权威
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
            DeepSeek大模型赋能医药GSP合规管理，让您的企业合规管理更高效、更专业、更智能
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
              基于DeepSeek大模型对GSP法规进行深度理解，自动解读GSP条款，提供权威的解释和应用指导。
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
              <h3 class="text-xl font-semibold">智能风险识别</h3>
            </div>
            <p class="text-gray-600 mb-4">
              系统通过AI分析企业运营数据，自动识别潜在的GSP合规风险点，并按照严重级别分类展示。
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>严重、主要、一般缺陷分级</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>早期预警，防患于未然</span>
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
              一键生成专业的GSP合规报告和整改方案，节省人力成本，提高工作效率，确保报告质量。
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
              基于AI分析的合规数据，为企业提供战略性的合规管理建议，帮助管理层做出更明智的决策。
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
              拥有AI助手随时随地为您解答GSP合规问题、医药销售策略、识病用药等专业问题，就像专家随身携带。
            </p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>7x24小时在线咨询</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>专业问题精准解答</span>
              </li>
            </ul>
          </div>
          
          <!-- 特点6：便捷部署 -->
          <div class="bg-white rounded-lg p-8 shadow-lg border border-gray-200 transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-lg mr-4">
                <RocketIcon class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold">便捷部署</h3>
            </div>
            <p class="text-gray-600 mb-4">
              十分钟完成DeepSeek大模型部署，支持公有云、私有云、混合云等多种部署方式，满足不同规模企业需求。
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

    <!-- FAQ部分 -->
    <div class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4">常见问题</h2>
        <p class="text-center text-gray-600 mb-12">关于AI赋能GSP合规解决方案的常见问题解答</p>
        
        <div class="max-w-3xl mx-auto space-y-6">
          <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow-md">
            <button 
              class="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              @click="toggleFaq(index)"
            >
              <span class="font-medium text-gray-800">{{ faq.question }}</span>
              <div class="bg-purple-100 rounded-full p-1 transition-transform duration-300"
                   :class="{ 'rotate-180': openFaq === index }">
                <ChevronDownIcon class="w-5 h-5 text-purple-600" />
              </div>
            </button>
            <div 
              v-show="openFaq === index" 
              class="px-6 py-4 border-t border-gray-100 text-gray-600 bg-gray-50"
            >
              <p class="leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
        
        <!-- 底部咨询区域 -->
        <div class="mt-12 text-center">
          <p class="text-gray-600 mb-4">还有其他问题？立即联系我们获取更多信息</p>
          <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center mx-auto">
            <MessageCircleIcon class="w-5 h-5 mr-2" />
            立即咨询
          </button>
        </div>
      </div>
    </div>

    <!-- Footer部分 -->
    <footer class="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <!-- 公司介绍 -->
          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center mb-6">
              <div class="h-8 w-8 bg-purple-600 bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                <span class="text-purple-400 font-bold">AI</span>
              </div>
              <h3 class="text-xl font-bold text-white">AI GSP</h3>
            </div>
            <p class="text-sm leading-relaxed">
              基于DeepSeek大模型打造的医药行业专属AI数智人解决方案，让管理更智能、更高效、更专业。
            </p>
            <div class="mt-6 flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <div class="w-5 h-5 text-gray-400">FB</div>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <div class="w-5 h-5 text-gray-400">TW</div>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <div class="w-5 h-5 text-gray-400">LI</div>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <div class="w-5 h-5 text-gray-400">WC</div>
              </a>
            </div>
          </div>
          
          <!-- 解决方案 -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">数智人场景</h3>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">GSP智能检查</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">合规报告生成</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">AI专家顾问</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">用药指导AI</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">销售策略助手</a>
              </li>
            </ul>
          </div>
          
          <!-- 资源 -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">资源</h3>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">GSP法规库</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">部署文档</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">API文档</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">案例研究</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">合规白皮书</a>
              </li>
            </ul>
          </div>
          
          <!-- 联系我们 -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">联系我们</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <MapPinIcon class="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-gray-400">北京市海淀区中关村科技园区</span>
              </li>
              <li class="flex items-start">
                <PhoneIcon class="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-gray-400">400-8888-8888</span>
              </li>
              <li class="flex items-start">
                <MailIcon class="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-gray-400">chenguowengpt@qq.com</span>
              </li>
            </ul>
            
            <div class="mt-6">
              <h4 class="text-sm font-medium text-white mb-2">订阅我们的新闻</h4>
              <div class="flex">
                <input 
                  type="email" 
                  placeholder="您的邮箱" 
                  class="bg-gray-800 text-sm text-white rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button class="bg-purple-600 hover:bg-purple-700 rounded-r-lg px-4 py-2 text-white">
                  <SendIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部版权信息 -->
        <div class="border-t border-gray-800 pt-8 mt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-xs text-gray-500">
              &copy; 2024 AI GSP. 保留所有权利。基于DeepSeek大模型技术驱动。
            </p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">隐私政策</a>
              <a href="#" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">服务条款</a>
              <a href="#" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">合规声明</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  MenuIcon, 
  XIcon, 
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
  ServerIcon,
  ShieldIcon,
  RefreshCwIcon,
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

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 导航菜单项
const navigationItems = [
  { name: '首页', href: '#' },
  { name: '解决方案', href: '#' },
  { name: '功能特性', href: '#' },
  { name: '部署方式', href: '#' },
  { name: '客户案例', href: '#' },
  { name: '关于我们', href: '#' }
]

// 框架数据
const frameworks = [
  { name: '虚拟机', logo: '/vm-logo.svg' },
  { name: 'OpenAI', logo: '/openai-logo.svg' },
  { name: 'K8S', logo: '/k8s-logo.svg' },
  { name: 'DogCloud', logo: '/dogcloud-logo.svg' },
  { name: '腾讯云', logo: '/tencent-logo.svg' },  
  { name: '微信支付宝', logo: '/wechat-logo.svg' }
]

// FAQ数据
const faqs = [
  {
    question: "AI赋能GSP合规系统如何帮助医药企业降低合规风险？",
    answer: "通过DeepSeek大模型AI技术，我们的系统能自动分析企业GSP管理现状，识别潜在风险点，提供针对性的合规建议和整改方案。系统实时追踪最新法规变化，确保企业始终符合最新GSP要求，有效降低因合规问题带来的经营风险和监管处罚。"
  },
  {
    question: "平台部署需要多长时间？是否需要专业IT团队？",
    answer: "我们的系统设计以快速部署为理念，只需约10分钟即可完成DeepSeek大模型的部署。系统提供简便的图形界面操作，无需专业IT团队即可维护。同时我们提供全方位的技术支持和培训，确保您的团队能快速掌握系统使用方法。"
  },
  {
    question: "AI如何帮助医药企业处理日常GSP检查和整改报告？",
    answer: "系统内置GSP检查项目库和合规性分析引擎，可自动生成专业的GSP检查表单和自查报告。当发现不合规项目时，AI会分析风险等级并提供专业的整改建议和措施，帮助药企高效完成整改报告撰写，提高GSP管理水平。此外，系统会记录检查历史，实现全流程追溯管理。"
  },
  {
    question: "系统是否能提供医药专业咨询和实时问答服务？",
    answer: "是的，我们的AI解决方案集成了专业的医药GSP知识库，能够7x24小时提供实时专业咨询。无论是药品储存条件、运输要求、GSP规范解读还是销售策略制定，AI都能给出专业、准确的答复和建议，就像随身携带一位医药GSP专家顾问。"
  },
  {
    question: "数据安全和隐私如何保障？",
    answer: "系统采用严格的数据隔离和加密技术，确保企业敏感数据安全。支持私有化部署，所有数据存储在企业内部服务器，不上传至外部云端。同时，我们遵循医药行业数据合规要求，符合相关数据保护法规，为客户提供最高级别的数据安全保障。"
  },
  {
    question: "如何确保AI建议的专业性和权威性？",
    answer: "我们的系统基于DeepSeek大模型专门针对医药GSP领域进行了深度训练，融合了最新的GSP法规、医药专业知识和行业最佳实践。系统定期更新知识库，确保建议始终符合最新监管要求。此外，我们还邀请了医药GSP领域专家对系统进行指导和评估，确保AI建议的专业性和权威性。"
  }
]

// FAQ展开状态
const openFaq = ref(null)

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* 导航栏样式 */
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

/* 背景图案 */
.bg-grid-pattern {
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.bg-circuit-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.03)' fill-rule='evenodd'/%3E%3C/svg%3E");
}
</style> 