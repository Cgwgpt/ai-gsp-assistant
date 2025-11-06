-- 配额检查函数快速测试脚本
-- 在 Supabase SQL 编辑器中运行此脚本

-- 步骤 1: 检查函数是否已正确部署
SELECT 
  proname as function_name,
  prosecdef as is_security_definer,
  CASE 
    WHEN prosecdef THEN '✅ 已设置 SECURITY DEFINER'
    ELSE '❌ 未设置 SECURITY DEFINER'
  END as status
FROM pg_proc 
WHERE proname = 'check_user_conversation_quota';

-- 步骤 2: 查看函数定义（确认逻辑）
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'check_user_conversation_quota';

-- 步骤 3: 测试函数（需要替换实际的用户ID和botID）
-- 先获取一个测试用户ID和botID
-- SELECT id FROM auth.users LIMIT 1;
-- SELECT id FROM bots LIMIT 1;

-- 测试函数调用（替换为实际的ID）
-- SELECT check_user_conversation_quota(
--   '替换为实际用户ID'::UUID,
--   '替换为实际botID'::UUID
-- ) as function_result;

-- 步骤 4: 检查数据完整性
-- 查看配额设置
SELECT 
  uq.id,
  uq.user_id,
  uq.bot_id,
  uq.max_conversations,
  uq.max_tokens,
  um.conversation_count,
  um.token_count,
  um.period_start,
  um.period_end,
  CASE 
    WHEN uq.max_conversations = -1 THEN '无限制'
    WHEN um.conversation_count IS NULL THEN '0/' || uq.max_conversations::text
    WHEN um.conversation_count >= uq.max_conversations THEN 
      '❌ ' || um.conversation_count::text || '/' || uq.max_conversations::text
    ELSE 
      '✅ ' || um.conversation_count::text || '/' || uq.max_conversations::text
  END as quota_status
FROM user_quotas uq
LEFT JOIN usage_metrics um ON 
  um.user_id = uq.user_id 
  AND um.bot_id = uq.bot_id
  AND um.period_start = date_trunc('month', CURRENT_DATE)::DATE
  AND um.period_end = (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE
WHERE uq.max_conversations > 0  -- 只查看有限制的配额
ORDER BY uq.user_id, uq.bot_id NULLS LAST;

-- 步骤 5: 诊断特定用户（替换为实际用户ID）
-- 查看特定用户的所有配额和使用情况
/*
SELECT 
  '配额设置' as type,
  uq.bot_id,
  uq.max_conversations as quota_limit,
  NULL::INTEGER as current_usage
FROM user_quotas uq
WHERE uq.user_id = '替换为实际用户ID'::UUID

UNION ALL

SELECT 
  '使用量统计' as type,
  um.bot_id,
  NULL::INTEGER as quota_limit,
  um.conversation_count as current_usage
FROM usage_metrics um
WHERE um.user_id = '替换为实际用户ID'::UUID
  AND um.period_start = date_trunc('month', CURRENT_DATE)::DATE
ORDER BY bot_id NULLS LAST;
*/
