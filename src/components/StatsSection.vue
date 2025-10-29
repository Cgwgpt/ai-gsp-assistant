<template>
  <div class="bg-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 数据统计部分 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div class="text-center">
          <div class="text-4xl font-bold text-purple-600 mb-2">98%</div>
          <div class="text-gray-600 text-sm">合规风险识别率</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-purple-600 mb-2">75%</div>
          <div class="text-gray-600 text-sm">合规管理时间节省</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-purple-600 mb-2">97%</div>
          <div class="text-gray-600 text-sm">客户满意度</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-purple-600 mb-2">10分钟</div>
          <div class="text-gray-600 text-sm">快速部署时间</div>
        </div>
      </div>

      <!-- 客户评价部分 -->
      <div class="text-center mb-12">
        <h2 class="text-2xl font-bold mb-4">他们已经在使用我们的解决方案</h2>
        <p class="text-gray-600 max-w-3xl mx-auto">了解医药行业领先企业如何通过AI提升GSP合规管理水平</p>
      </div>

      <!-- 客户评价卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-gradient-to-br from-white to-purple-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
          <div class="absolute -top-4 -left-4 text-purple-100 opacity-30 text-9xl leading-none">"</div>
          <div class="flex items-center mb-6 relative z-10">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white mr-4 shadow-sm">张</div>
            <div>
              <h3 class="font-bold text-gray-800">张总监</h3>
              <p class="text-purple-600 text-sm">某大型连锁药店GSP质量负责人</p>
            </div>
          </div>
          <p class="text-gray-700 italic relative z-10">"deepseek大模型上线、垂直应用数智人落地。AI的赋能为我们节省了大量人力成本，特别是在日常检查和缺陷风险识别方面。系统能够快速识别潜在风险，大大提高了我们的合规管理效率。"</p>
          <div class="absolute bottom-2 right-2 text-purple-100 opacity-30 text-5xl leading-none">"</div>
        </div>

        <div class="bg-gradient-to-br from-white to-blue-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
          <div class="absolute -top-4 -left-4 text-blue-100 opacity-30 text-9xl leading-none">"</div>
          <div class="flex items-center mb-6 relative z-10">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white mr-4 shadow-sm">李</div>
            <div>
              <h3 class="font-bold text-gray-800">李经理</h3>
              <p class="text-blue-600 text-sm">医药批发企业GSP管理部</p>
            </div>
          </div>
          <p class="text-gray-700 italic relative z-10">"垂直应用模型数智人太实用了，随时随地回答GSP专业问题，指导我们的GSP日常工作实施及检查，效率大为提高。整改报告自动分析生成功能，也极大促进我们的整改工作。"</p>
          <div class="absolute bottom-2 right-2 text-blue-100 opacity-30 text-5xl leading-none">"</div>
        </div>

        <div class="bg-gradient-to-br from-white to-teal-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
          <div class="absolute -top-4 -left-4 text-teal-100 opacity-30 text-9xl leading-none">"</div>
          <div class="flex items-center mb-6 relative z-10">
            <div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white mr-4 shadow-sm">王</div>
            <div>
              <h3 class="font-bold text-gray-800">王店长</h3>
              <p class="text-teal-600 text-sm">区域连锁药店负责人</p>
            </div>
          </div>
          <p class="text-gray-700 italic relative z-10">"AI系统提供的专业服务帮助我们解决了很多合规难题。尤其是通过数据分析提供的销售策略建议，让我们的销售额提升了15%以上。专业的服务和支持让我们能够更专注于业务发展。"</p>
          <div class="absolute bottom-2 right-2 text-teal-100 opacity-30 text-5xl leading-none">"</div>
        </div>

        <div class="bg-gradient-to-br from-white to-pink-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
          <div class="absolute -top-4 -left-4 text-pink-100 opacity-30 text-9xl leading-none">"</div>
          <div class="flex items-center mb-6 relative z-10">
            <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center text-white mr-4 shadow-sm">赵</div>
            <div>
              <h3 class="font-bold text-gray-800">赵总</h3>
              <p class="text-pink-600 text-sm">某连锁药店运营负责人</p>
            </div>
          </div>
          <p class="text-gray-700 italic relative z-10">"引入这套系统后，我们的合规管理效率显著提升。AI提供的专业销售策略帮助我们精准定位客户需求，提高了客户转化率。最令人满意的是，我们的运营效益提高了近20%，投资回报率远超预期。"</p>
          <div class="absolute bottom-2 right-2 text-pink-100 opacity-30 text-5xl leading-none">"</div>
        </div>

        <div class="bg-gradient-to-br from-white to-indigo-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
          <div class="absolute -top-4 -left-4 text-indigo-100 opacity-30 text-9xl leading-none">"</div>
          <div class="flex items-center mb-6 relative z-10">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white mr-4 shadow-sm">刘</div>
            <div>
              <h3 class="font-bold text-gray-800">刘药师</h3>
              <p class="text-indigo-600 text-sm">社区药店专业服务负责人</p>
            </div>
          </div>
          <p class="text-gray-700 italic relative z-10">"有了AI辅助专业用药咨询服务,数智人识病用药助手帮助提升了我们的专业形象，吸引了更多优质客户。即时提供的专业销售策略建议帮助我们优化了商品结构，药品和医疗器械及保健品关联销售增长25%，专业价值得到充分体现。"</p>
          <div class="absolute bottom-2 right-2 text-indigo-100 opacity-30 text-5xl leading-none">"</div>
        </div>

        <div class="bg-gradient-to-br from-white to-amber-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
          <div class="absolute -top-4 -left-4 text-amber-100 opacity-30 text-9xl leading-none">"</div>
          <div class="flex items-center mb-6 relative z-10">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white mr-4 shadow-sm">陈</div>
            <div>
              <h3 class="font-bold text-gray-800">陈经理</h3>
              <p class="text-amber-600 text-sm">某医药集团合规管理部主管</p>
            </div>
          </div>
          <p class="text-gray-700 italic relative z-10">"系统提供deepseek、数智人的专业服务让我们在GSP检查中表现出色。智能合规管理工具使我们的工作流程更加高效，风险管控更加精准。销售团队拥有了AI系统的专家库和建议，提高了专业销售能力，公司整体效益显著提升。"</p>
          <div class="absolute bottom-2 right-2 text-amber-100 opacity-30 text-5xl leading-none">"</div>
        </div>
      </div>

      <!-- 底部CTA -->
      <div class="mt-16 bg-purple-600 text-white rounded-xl p-8 text-center">
        <h2 class="text-2xl font-bold mb-2">让AI为您的医药企业扬帆起航</h2>
        <p class="mb-6">AI赋能管理，提升合规水平，降低风险，节省成本，助力业务拓展</p>
        <div class="flex justify-center space-x-4">
          <a href="#" class="bg-white text-purple-600 px-6 py-2 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            联系我们
          </a>
          <a href="#" class="border border-white px-6 py-2 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
            预约演示
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 无需额外的逻辑
</script> 