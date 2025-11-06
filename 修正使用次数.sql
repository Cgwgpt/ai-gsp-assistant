-- 修正使用次数脚本
-- 用于检查和修正识病用药助手的使用次数

-- 1. 查看识病用药助手的所有使用记录（所有周期）
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
ORDER BY um.updated_at DESC;

-- 2. 查看当前周期的记录
SELECT 
  um.*,
  b.name as bot_name
FROM usage_metrics um
LEFT JOIN bots b ON um.bot_id = b.id
WHERE um.user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
  AND um.bot_id = 'b768aaf4-a8f9-481a-9896-18c40d68335d'
  AND um.period_start = date_trunc('month', CURRENT_DATE)::DATE
  AND um.period_end = (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

-- 3. 如果需要手动修正为17次（请谨慎使用）
-- 注意：只有在确认数据确实应该是17次时才执行此更新
/*
UPDATE usage_metrics
SET 
  conversation_count = 17,
  updated_at = NOW()
WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
  AND bot_id = 'b768aaf4-a8f9-481a-9896-18c40d68335d'
  AND period_start = date_trunc('month', CURRENT_DATE)::DATE
  AND period_end = (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

-- 4. 更新全局统计（修正后需要同步更新）
WITH bot_totals AS (
  SELECT COALESCE(SUM(conversation_count), 0) as total_conversations
  FROM usage_metrics
  WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
    AND bot_id IS NOT NULL
    AND period_start = date_trunc('month', CURRENT_DATE)::DATE
    AND period_end = (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE
)
UPDATE usage_metrics
SET 
  conversation_count = (SELECT total_conversations FROM bot_totals),
  updated_at = NOW()
WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
  AND bot_id IS NULL
  AND period_start = date_trunc('month', CURRENT_DATE)::DATE
  AND period_end = (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
*/

-- 5. 检查是否有重复记录或异常记录
SELECT 
  user_id,
  bot_id,
  period_start,
  period_end,
  COUNT(*) as record_count,
  SUM(conversation_count) as total_count,
  array_agg(id) as record_ids
FROM usage_metrics
WHERE user_id = 'd8cb8076-eac4-4f56-ad73-4a54d03f9920'
  AND bot_id = 'b768aaf4-a8f9-481a-9896-18c40d68335d'
GROUP BY user_id, bot_id, period_start, period_end
HAVING COUNT(*) > 1 OR SUM(conversation_count) != MAX(conversation_count);

