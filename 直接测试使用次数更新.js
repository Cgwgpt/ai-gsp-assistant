// 直接测试使用次数更新
// 在浏览器控制台中运行此脚本

(async function testUsageUpdate() {
  console.log('🧪 ========== 开始测试使用次数更新 ==========')
  
  // 获取当前用户和 Supabase 客户端
  const { useSupabase } = await import('/src/composables/useSupabase.js')
  const { supabase, user } = useSupabase()
  
  if (!user.value) {
    console.error('❌ 用户未登录')
    return
  }
  
  const userId = user.value.id
  console.log('✅ 用户ID:', userId)
  
  // 1. 获取数智人列表
  console.log('\n📋 步骤1: 获取数智人列表...')
  const { data: bots, error: botsError } = await supabase
    .from('bots')
    .select('id, name, coze_bot_id')
    .eq('is_public', true)
  
  if (botsError) {
    console.error('❌ 获取数智人列表失败:', botsError)
    return
  }
  
  console.log(`✅ 找到 ${bots.length} 个数智人`)
  
  // 找到"识病用药助手"
  const targetBot = bots.find(bot => bot.name === '识病用药助手' || bot.name.includes('识病用药'))
  if (!targetBot) {
    console.error('❌ 未找到"识病用药助手"')
    console.log('可用的数智人:', bots.map(b => b.name))
    return
  }
  
  console.log('✅ 找到目标数智人:')
  console.log('  - 名称:', targetBot.name)
  console.log('  - UUID:', targetBot.id)
  console.log('  - Coze Bot ID:', targetBot.coze_bot_id)
  
  // 2. 计算当前月份
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const periodStart = monthStart.toISOString().split('T')[0]
  const periodEnd = monthEnd.toISOString().split('T')[0]
  
  console.log('\n📅 步骤2: 查询周期')
  console.log('  - 周期开始:', periodStart)
  console.log('  - 周期结束:', periodEnd)
  
  // 3. 直接查询数据库中的使用记录
  console.log('\n🔍 步骤3: 查询数据库中的使用记录...')
  const { data: usageData, error: usageError } = await supabase
    .from('usage_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('bot_id', targetBot.id)
    .eq('period_start', periodStart)
    .eq('period_end', periodEnd)
    .maybeSingle()
  
  if (usageError) {
    console.error('❌ 查询使用记录失败:', usageError)
    return
  }
  
  if (usageData) {
    console.log('✅ 数据库中的使用记录:')
    console.log('  - conversation_count:', usageData.conversation_count)
    console.log('  - token_count:', usageData.token_count)
    console.log('  - updated_at:', usageData.updated_at)
    console.log('  - 完整记录:', usageData)
  } else {
    console.log('⚠️ 未找到使用记录（可能为0次）')
  }
  
  // 4. 查询配额设置
  console.log('\n⚙️ 步骤4: 查询配额设置...')
  const { data: quotaData, error: quotaError } = await supabase
    .from('user_quotas')
    .select('*')
    .eq('user_id', userId)
    .or(`bot_id.eq.${targetBot.id},bot_id.is.null`)
    .order('bot_id', { ascending: false }) // NULL 在后
  
  if (quotaError) {
    console.error('❌ 查询配额失败:', quotaError)
    return
  }
  
  console.log('✅ 配额设置:')
  quotaData.forEach(quota => {
    console.log(`  - ${quota.bot_id ? '特定数智人配额' : '全局配额'}:`, {
      max_conversations: quota.max_conversations,
      max_tokens: quota.max_tokens,
      bot_id: quota.bot_id
    })
  })
  
  // 5. 使用服务层查询（对比）
  console.log('\n🔄 步骤5: 使用服务层查询（对比）...')
  const { usageService } = await import('/services/usageService.js')
  const { data: serviceData, error: serviceError } = await usageService.getUserUsageStatus(userId, targetBot.id)
  
  if (serviceError) {
    console.error('❌ 服务层查询失败:', serviceError)
    return
  }
  
  if (serviceData) {
    console.log('✅ 服务层返回的数据:')
    console.log('  - conversation_count:', serviceData.usage?.conversation_count)
    console.log('  - max_conversations:', serviceData.quota?.max_conversations)
    console.log('  - conversationPercent:', serviceData.conversationPercent + '%')
    console.log('  - 完整数据:', serviceData)
  }
  
  // 6. 对比结果
  console.log('\n📊 步骤6: 对比结果...')
  const dbCount = usageData?.conversation_count || 0
  const serviceCount = serviceData?.usage?.conversation_count || 0
  
  console.log('  - 数据库直接查询:', dbCount)
  console.log('  - 服务层查询:', serviceCount)
  
  if (dbCount !== serviceCount) {
    console.error('❌ 数据不一致！数据库:', dbCount, '服务层:', serviceCount)
    console.log('可能的原因:')
    console.log('  1. bot_id 不匹配')
    console.log('  2. period_start/period_end 格式问题')
    console.log('  3. 查询时机问题')
  } else {
    console.log('✅ 数据一致')
  }
  
  // 7. 查询所有数智人的使用记录（用于验证）
  console.log('\n📋 步骤7: 查询所有数智人的使用记录...')
  const { data: allUsage, error: allError } = await supabase
    .from('usage_metrics')
    .select('*, bots(name)')
    .eq('user_id', userId)
    .not('bot_id', 'is', null)
    .eq('period_start', periodStart)
    .eq('period_end', periodEnd)
  
  if (!allError && allUsage) {
    console.log(`✅ 找到 ${allUsage.length} 个数智人的使用记录:`)
    allUsage.forEach(usage => {
      console.log(`  - ${usage.bots?.name || usage.bot_id}: ${usage.conversation_count} 次`)
    })
    
    const total = allUsage.reduce((sum, u) => sum + (u.conversation_count || 0), 0)
    console.log(`  - 总计: ${total} 次`)
  }
  
  console.log('\n🧪 ========== 测试完成 ==========')
})()

