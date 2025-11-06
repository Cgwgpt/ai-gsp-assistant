-- 检查使用统计实时更新
-- 这个脚本用于诊断和测试使用统计的实时更新功能

-- 1. 检查 usage_metrics 表是否存在实时功能
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE tablename = 'usage_metrics';

-- 2. 检查当前用户的使用统计记录
-- 请替换 YOUR_USER_ID 为实际的用户ID
-- SELECT * FROM usage_metrics 
-- WHERE user_id = 'YOUR_USER_ID'
-- ORDER BY updated_at DESC
-- LIMIT 10;

-- 3. 检查是否有最近的更新
SELECT 
  user_id,
  bot_id,
  conversation_count,
  token_count,
  period_start,
  period_end,
  updated_at,
  NOW() - updated_at as time_since_update
FROM usage_metrics
ORDER BY updated_at DESC
LIMIT 20;

-- 4. 检查全局统计是否正确
SELECT 
  user_id,
  bot_id,
  conversation_count,
  token_count,
  period_start,
  period_end,
  updated_at
FROM usage_metrics
WHERE bot_id IS NULL
ORDER BY updated_at DESC
LIMIT 10;

-- 5. 检查各数智人统计总和是否等于全局统计
WITH bot_totals AS (
  SELECT 
    user_id,
    period_start,
    period_end,
    SUM(conversation_count) as total_conversations,
    SUM(token_count) as total_tokens
  FROM usage_metrics
  WHERE bot_id IS NOT NULL
  GROUP BY user_id, period_start, period_end
),
global_stats AS (
  SELECT 
    user_id,
    period_start,
    period_end,
    conversation_count as global_conversations,
    token_count as global_tokens
  FROM usage_metrics
  WHERE bot_id IS NULL
)
SELECT 
  bt.user_id,
  bt.period_start,
  bt.period_end,
  bt.total_conversations,
  gs.global_conversations,
  bt.total_conversations - COALESCE(gs.global_conversations, 0) as conversation_diff,
  bt.total_tokens,
  gs.global_tokens,
  bt.total_tokens - COALESCE(gs.global_tokens, 0) as token_diff
FROM bot_totals bt
LEFT JOIN global_stats gs ON 
  bt.user_id = gs.user_id AND 
  bt.period_start = gs.period_start AND 
  bt.period_end = gs.period_end
WHERE bt.total_conversations != COALESCE(gs.global_conversations, 0)
   OR bt.total_tokens != COALESCE(gs.global_tokens, 0);

-- 6. 手动触发一次更新（测试用）
-- 请谨慎使用，这会增加对话次数
-- SELECT check_and_record_conversation_usage('YOUR_USER_ID', 'YOUR_BOT_ID');

