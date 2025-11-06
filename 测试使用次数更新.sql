-- 测试使用次数更新查询脚本
-- 用于诊断使用次数不更新的问题

-- 1. 查询特定用户和数智人的使用记录
-- 请替换以下参数：
--   user_id: 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
--   bot_id: 'b768aaf4-a8f9-481a-9896-18c40d68335d' (识病用药助手的UUID)

-- 查询当前月份的所有使用记录
SELECT 
  id,
  user_id,
  bot_id,
  conversation_count,
  token_count,
  period_start,
  period_end,
  created_at,
  updated_at
FROM usage_metrics
WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
  AND period_start = date_trunc('month', CURRENT_DATE)::DATE
  AND period_end = (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE
ORDER BY 
  CASE WHEN bot_id IS NULL THEN 0 ELSE 1 END,
  updated_at DESC;

-- 2. 查询特定数智人（识病用药助手）的使用记录
SELECT 
  um.id,
  um.user_id,
  um.bot_id,
  b.name as bot_name,
  um.conversation_count,
  um.token_count,
  um.period_start,
  um.period_end,
  um.created_at,
  um.updated_at
FROM usage_metrics um
LEFT JOIN bots b ON um.bot_id = b.id
WHERE um.user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
  AND um.bot_id = 'b768aaf4-a8f9-481a-9896-18c40d68335d'
  AND um.period_start = date_trunc('month', CURRENT_DATE)::DATE
  AND um.period_end = (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

-- 3. 查询用户的配额设置
SELECT 
  uq.id,
  uq.user_id,
  uq.bot_id,
  b.name as bot_name,
  uq.max_conversations,
  uq.max_tokens,
  uq.created_at,
  uq.updated_at
FROM user_quotas uq
LEFT JOIN bots b ON uq.bot_id = b.id
WHERE uq.user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
ORDER BY 
  CASE WHEN uq.bot_id IS NULL THEN 0 ELSE 1 END;

-- 4. 统计所有数智人的使用次数总和（用于验证全局统计）
SELECT 
  COALESCE(SUM(conversation_count), 0) as total_conversations,
  COALESCE(SUM(token_count), 0) as total_tokens,
  COUNT(*) as bot_count
FROM usage_metrics
WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
  AND bot_id IS NOT NULL
  AND period_start = date_trunc('month', CURRENT_DATE)::DATE
  AND period_end = (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

-- 5. 查询最近的使用记录更新（检查是否有新记录）
SELECT 
  um.bot_id,
  b.name as bot_name,
  um.conversation_count,
  um.updated_at,
  NOW() - um.updated_at as time_since_update
FROM usage_metrics um
LEFT JOIN bots b ON um.bot_id = b.id
WHERE um.user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
  AND um.period_start = date_trunc('month', CURRENT_DATE)::DATE
  AND um.period_end = (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE
ORDER BY um.updated_at DESC
LIMIT 10;

-- 6. 验证 check_and_record_conversation_usage 函数是否正常工作
-- 注意：这个查询会尝试调用函数，但不会实际增加使用次数（因为会先检查配额）
-- 如果要测试，请使用实际存在的用户ID和botID
/*
SELECT check_and_record_conversation_usage(
  'd8cb8076-eac4-4f56-ad73-4a54d03f9920'::uuid,
  'b768aaf4-a8f9-481a-9896-18c40d68335d'::uuid
);
*/

