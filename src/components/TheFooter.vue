<template>
  <div>
    <!-- 添加的FAQ部分 -->
    <FaqSection :faqs="faqs" />
    
    <footer class="bg-gray-900 text-white py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <div>
            <!-- 优化的Logo部分 -->
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white text-xl font-bold">AI</span>
              </div>
              <span class="text-2xl font-bold tracking-tight">GSP-Assistant</span>
            </div>
            <p class="text-gray-400 mb-4">基于DeepSeek大模型打造的医药行业专属AI数智人解决方案，让管理更智能、更高效、更专业。</p>
            <!-- 优化的社交图标部分 -->
            <div class="flex space-x-4 mb-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.502 19.525C21.502 20.342 20.847 21 20.03 21H3.97C3.153 21 2.498 20.342 2.498 19.525V8.974c0-.127.103-.231.231-.231h18.542c.127 0 .231.103.231.231v10.552z" fill-rule="evenodd" clip-rule="evenodd"></path>
                  <path d="M12 12.81l-8.571-6.38V6.344c0-.817.655-1.475 1.472-1.475h14.156c.817 0 1.472.658 1.472 1.475v.104L12 12.811z" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <FooterSection 
            title="通用大模型"
            :links="[
              { text: 'deepseek R1满血版', url: '#' },
              { text: 'deepseek-R1-7B', url: '#' },
              { text: 'DeepSeek-R1-32B', url: '#' },
              { text: 'DeepSeek v3', url: '#' },
            ]"
          />
          
          <FooterSection 
            title="应用数智人"
            :links="[
              { text: 'GSP检查助手', url: '#' },
              { text: '整改报告助手', url: '#' },
              { text: '药店销售助手', url: '#' },
              { text: '识病用药助手', url: '#' },
             ]"
          />
          
          <div>
            <h3 class="font-semibold mb-3">联系我们</h3>
            <div class="space-y-2">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span class="text-gray-400 whitespace-nowrap">医界数智人工智能科技有限公司</span>
              </div>
              <div class="flex items-start">
                <svg class="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span class="text-gray-400">18959650938</span>
              </div>
              <div class="flex items-start">
                <svg class="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span class="text-gray-400">chenguowengpt@qq.com</span>
              </div>
            </div>
            
            <!-- 将隐私政策、服务条款、合规声明移至此处 -->
            <div class="mt-3">
              <div class="flex flex-wrap gap-3">
                <a href="#" class="text-gray-400 hover:text-white text-sm flex items-center">
                  <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  <span>隐私政策</span>
                </a>
                <a href="#" class="text-gray-400 hover:text-white text-sm flex items-center">
                  <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <span>服务条款</span>
                </a>
                <a href="#" class="text-gray-400 hover:text-white text-sm flex items-center">
                  <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                  <span>合规声明</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 优化的页脚底部部分 -->
        <div class="border-t border-gray-800 mt-8 pt-5">
          <div class="text-center">
            <p class="text-gray-400 text-sm">© 2025 Ai-GSP-Assistant. 医界数智人工智能科技有限公司 保留所有权利。基于DeepSeek大模型技术驱动。</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import FooterSection from './FooterSection.vue'
import FaqSection from './FaqSection.vue'

// FAQ数据
const faqs = [
  {
    question: "AI赋能如何帮助医药企业降低风险？",
    answer: "通过DeepSeek大模型AI技术，我们的系统能智能分析企业GSP管理现状，识别潜在风险点，提供针对性的整改方案。系统实时追踪最新法规变化，确保企业始终符合最新GSP要求，有效降低因合规问题带来的经营风险和监管处罚。"
  },
  {
    question: "平台部署需要多长时间？是否需要专业IT团队？",
    answer: "我们的系统设计以快速部署为理念，能快速完成基于DeepSeek大模型的AI医药管理平台的本地化部署。并提供SaaS在线即时服务，同时我们提供全方位的技术支持和培训，确保您的团队能快速掌握系统使用方法。"
  },
  {
    question: "AI如何帮助医药企业处理日常GSP实施和整改报告？",
    answer: "系统提供即时专家级服务，日常GSP工作有全天候AI专家监督指导，内置GSP检查项目库和合规性分析引擎，可智能GSP检查缺陷判定。当发现不合规项目时，AI会分析风险等级并提供专业的整改建议和措施，帮助药企高效完成整改。"
  },
  {
    question: "系统是否能提供医药专业咨询和实时问答服务？",
    answer: "是的，我们的AI解决方案集成了专业的医药行业知识库，能够7x24小时提供实时专业咨询。无论是药品储存条件、运输要求、GSP规范解读还是销售策略制定，AI都能给出专业、准确的答复和建议，就像随身携带一位医药行业专家顾问。"
  },
  {
    question: "数据安全和隐私如何保障？",
    answer: "系统采用数据脱敏和加密技术，确保企业敏感数据安全。支持私有化部署，所有数据存储在企业内部服务器，不上传至外部云端。同时，我们遵循医药行业数据合规要求，符合相关数据保护法规，为客户提供最高级别的数据安全保障。"
  },
  {
    question: "如何确保AI建议的专业性和权威性？",
    answer: "我们的系统基于DeepSeek大模型专门针对医药GSP领域进行了深度训练，融合了最新的GSP法规、医药专业知识和行业最佳实践。系统定期更新知识库，确保建议始终符合最新监管要求。此外，我们还邀请了医药GSP领域专家对系统进行指导和评估，确保AI建议的专业性和权威性。"
  }
]
</script> 