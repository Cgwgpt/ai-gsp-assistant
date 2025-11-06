// 配额检查诊断脚本
// 使用方法：在浏览器控制台中粘贴并运行此脚本

(async function diagnoseQuotaCheck() {
  console.log('🔍 开始配额检查诊断...\n');
  
  try {
    // 1. 检查必要的模块是否可用
    console.log('1️⃣ 检查环境...');
    const { useSupabase } = await import('/src/composables/useSupabase.js');
    const { usageService } = await import('/src/services/usageService.js');
    const { botService } = await import('/src/services/botService.js');
    const { useChatStore } = await import('/src/stores/chat.js');
    
    const { user, supabase } = useSupabase();
    
    if (!user.value) {
      console.error('❌ 用户未登录');
      return;
    }
    
    console.log('✅ 环境检查通过');
    console.log('   用户ID:', user.value.id);
    
    // 2. 获取数智人信息
    console.log('\n2️⃣ 获取数智人信息...');
    const { data: bots } = await botService.getBots();
    
    if (!bots || bots.length === 0) {
      console.error('❌ 无法获取数智人列表');
      return;
    }
    
    console.log('✅ 找到', bots.length, '个数智人');
    
    // 使用第一个数智人进行测试（或者您可以选择特定的）
    const testBot = bots[0];
    console.log('   测试数智人:', {
      id: testBot.id,
      coze_bot_id: testBot.coze_bot_id,
      name: testBot.name || '未命名'
    });
    
    // 3. 检查配额设置
    console.log('\n3️⃣ 检查配额设置...');
    const { data: quotaData, error: quotaError } = await supabase
      .from('user_quotas')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('bot_id', testBot.id)
      .single();
    
    if (quotaError && quotaError.code !== 'PGRST116') {
      console.error('❌ 获取配额失败:', quotaError);
    } else if (quotaData) {
      console.log('✅ 配额设置:', {
        max_conversations: quotaData.max_conversations,
        max_tokens: quotaData.max_tokens
      });
    } else {
      // 检查全局配额
      const { data: globalQuota } = await supabase
        .from('user_quotas')
        .select('*')
        .eq('user_id', user.value.id)
        .is('bot_id', null)
        .single();
      
      if (globalQuota) {
        console.log('✅ 全局配额设置:', {
          max_conversations: globalQuota.max_conversations,
          max_tokens: globalQuota.max_tokens
        });
      } else {
        console.warn('⚠️ 未找到配额设置（使用默认值：无限制）');
      }
    }
    
    // 4. 检查使用量统计
    console.log('\n4️⃣ 检查使用量统计...');
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    const currentMonthEnd = new Date(currentMonthStart);
    currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
    currentMonthEnd.setDate(0);
    
    const { data: usageData, error: usageError } = await supabase
      .from('usage_metrics')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('bot_id', testBot.id)
      .eq('period_start', currentMonthStart.toISOString().split('T')[0])
      .eq('period_end', currentMonthEnd.toISOString().split('T')[0])
      .single();
    
    if (usageError && usageError.code !== 'PGRST116') {
      console.error('❌ 获取使用量失败:', usageError);
    } else if (usageData) {
      console.log('✅ 使用量统计:', {
        conversation_count: usageData.conversation_count,
        token_count: usageData.token_count,
        period_start: usageData.period_start,
        period_end: usageData.period_end
      });
    } else {
      console.warn('⚠️ 未找到使用量统计（当前使用量为0）');
    }
    
    // 5. 直接测试数据库函数
    console.log('\n5️⃣ 测试数据库函数 check_user_conversation_quota...');
    const { data: functionResult, error: functionError } = await supabase
      .rpc('check_user_conversation_quota', {
        p_user_id: user.value.id,
        p_bot_id: testBot.id
      });
    
    console.log('函数调用结果:', {
      data: functionResult,
      error: functionError,
      dataType: typeof functionResult,
      isTrue: functionResult === true,
      isFalse: functionResult === false,
      isNull: functionResult === null,
      isUndefined: functionResult === undefined
    });
    
    if (functionError) {
      console.error('❌ 函数调用失败:', functionError);
      console.error('   错误代码:', functionError.code);
      console.error('   错误消息:', functionError.message);
      console.error('   错误详情:', functionError.details);
      console.error('   提示:', functionError.hint);
    } else {
      if (functionResult === true) {
        console.log('✅ 函数返回 true（允许发送消息）');
      } else if (functionResult === false) {
        console.log('❌ 函数返回 false（应该禁止发送消息）');
      } else {
        console.warn('⚠️ 函数返回了意外的值:', functionResult);
      }
    }
    
    // 6. 测试配额检查服务
    console.log('\n6️⃣ 测试配额检查服务...');
    const checkResult = await usageService.checkConversationQuota(user.value.id, testBot.id);
    
    console.log('配额检查服务结果:', checkResult);
    
    if (checkResult.error) {
      console.error('❌ 配额检查服务返回错误:', checkResult.error);
    } else {
      if (checkResult.allowed) {
        console.log('✅ 配额检查服务返回 allowed: true（允许发送消息）');
      } else {
        console.log('❌ 配额检查服务返回 allowed: false（应该禁止发送消息）');
      }
    }
    
    // 7. 总结
    console.log('\n📊 诊断总结:');
    console.log('='.repeat(50));
    
    const quota = quotaData?.max_conversations ?? -1;
    const usage = usageData?.conversation_count ?? 0;
    
    console.log('配额限制:', quota === -1 ? '无限制' : quota);
    console.log('当前使用量:', usage);
    
    if (quota !== -1) {
      if (usage >= quota) {
        console.log('状态: ❌ 已超过配额限制');
        console.log('预期行为: 应该禁止发送消息');
      } else {
        console.log('状态: ✅ 未超过配额限制');
        console.log('预期行为: 允许发送消息');
      }
    }
    
    console.log('\n数据库函数返回:', functionResult === true ? '✅ true（允许）' : functionResult === false ? '❌ false（禁止）' : '⚠️ ' + functionResult);
    console.log('配额检查服务返回:', checkResult.allowed ? '✅ allowed: true' : '❌ allowed: false');
    
    if (quota !== -1 && usage >= quota && (functionResult !== false || !checkResult.allowed)) {
      console.log('\n⚠️ 发现问题:');
      if (functionResult !== false) {
        console.log('   - 数据库函数应该返回 false，但返回了:', functionResult);
      }
      if (checkResult.allowed !== false) {
        console.log('   - 配额检查服务应该返回 allowed: false，但返回了:', checkResult.allowed);
      }
    }
    
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ 诊断过程出错:', error);
    console.error('错误堆栈:', error.stack);
  }
})();

// 额外的辅助函数：监控配额检查
function monitorQuotaCheck() {
  const originalLog = console.log;
  const quotaLogs = [];
  
  console.log = function(...args) {
    const message = args.join(' ');
    if (message.includes('[配额检查]') || message.includes('[消息发送]') || message.includes('配额')) {
      quotaLogs.push({
        timestamp: new Date().toISOString(),
        message: message,
        args: args
      });
    }
    originalLog.apply(console, args);
  };
  
  console.log('🔍 已启动配额检查监控...');
  console.log('发送消息后，运行 getQuotaLogs() 查看所有配额相关的日志');
  
  window.getQuotaLogs = function() {
    console.log('\n📋 配额检查日志记录:');
    console.log('='.repeat(50));
    quotaLogs.forEach((log, index) => {
      console.log(`[${index + 1}] ${log.timestamp}`);
      console.log(`    ${log.message}`);
    });
    console.log('='.repeat(50));
    return quotaLogs;
  };
  
  window.clearQuotaLogs = function() {
    quotaLogs.length = 0;
    console.log('✅ 已清除配额检查日志');
  };
}

// 运行监控
monitorQuotaCheck();
