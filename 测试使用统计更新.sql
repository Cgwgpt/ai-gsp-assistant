-- 测试使用统计更新
-- 用于诊断使用次数没有更新的问题

-- 1. 检查数据库函数是否存在
SELECT 
  proname as function_name,
  prosecdef as is_security_definer,
  CASE 
    WHEN prosecdef = true THEN '✅ 已设置 SECURITY DEFINER'
    ELSE '❌ 未设置 SECURITY DEFINER'
  END as status
FROM pg_proc 
WHERE proname = 'check_and_record_conversation_usage';

-- 2. 查看函数定义
SELECT pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'check_and_record_conversation_usage';

-- 3. 检查当前使用量（替换为实际的用户ID和botID）
-- 替换 'your-user-id' 和 'your-bot-id' 为实际值
SELECT 
  '特定数智人使用量' as type,
  conversation_count,
  token_count,
  period_start,
  period_end,
  updated_at
FROM usage_metrics
WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'::UUID
  AND bot_id = 'b768aaf4-a8f9-481a-9896-18c40d68335d'::UUID
  AND period_start = date_trunc('month', CURRENT_DATE)::DATE
ORDER BY updated_at DESC
LIMIT 1;

-- 4. 检查全局使用量
SELECT 
  '全局使用量' as type,
  conversation_count,
  token_count,
  period_start,
  period_end,
  updated_at
FROM usage_metrics
WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'::UUID
  AND bot_id IS NULL
  AND period_start = date_trunc('month', CURRENT_DATE)::DATE
ORDER BY updated_at DESC
LIMIT 1;

-- 5. 检查所有数智人的使用量总和（应该等于全局使用量）
SELECT 
  '所有数智人总和' as type,
  COALESCE(SUM(conversation_count), 0) as total_conversations,
  COALESCE(SUM(token_count), 0) as total_tokens
FROM usage_metrics
WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'::UUID
  AND bot_id IS NOT NULL
  AND period_start = date_trunc('month', CURRENT_DATE)::DATE;

-- 6. 测试函数调用（替换为实际的用户ID和botID）
-- 注意：这会实际记录使用量，请谨慎使用
-- SELECT check_and_record_conversation_usage(
--   'd8cb8076-eac4-4f56-ad73-4a54d03f9920'::UUID,
--   'b768aaf4-a8f9-481a-9896-18c40d68335d'::UUID
-- ) as function_result;

-- 7. 检查用户配额设置
SELECT 
  bot_id,
  max_conversations,
  max_tokens,
  created_at,
  updated_at
FROM user_quotas
WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'::UUID
ORDER BY 
  CASE WHEN bot_id IS NULL THEN 0 ELSE 1 END,
  created_at DESC;

