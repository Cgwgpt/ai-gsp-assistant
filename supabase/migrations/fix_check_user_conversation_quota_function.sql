-- 修复 check_user_conversation_quota 函数，添加 SECURITY DEFINER
-- 这样可以确保函数可以绕过 RLS 策略访问数据
-- 修复：根据配额类型（全局或特定数智人）检查对应的使用量
CREATE OR REPLACE FUNCTION check_user_conversation_quota(
  p_user_id UUID,
  p_bot_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quota INTEGER;
  v_quota_bot_id UUID;  -- 记录配额类型（NULL表示全局配额，非NULL表示特定数智人配额）
  v_current_count INTEGER;
  v_current_month_start DATE;
  v_current_month_end DATE;
BEGIN
  -- 获取当前月份的起止日期
  v_current_month_start := date_trunc('month', CURRENT_DATE)::DATE;
  v_current_month_end := (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- 获取用户针对特定数智人的配额
  SELECT max_conversations, bot_id INTO v_quota, v_quota_bot_id
  FROM user_quotas
  WHERE user_id = p_user_id AND bot_id = p_bot_id;
  
  -- 如果没有找到特定配额，检查全局配额
  IF v_quota IS NULL THEN
    SELECT max_conversations, bot_id INTO v_quota, v_quota_bot_id
    FROM user_quotas
    WHERE user_id = p_user_id AND bot_id IS NULL;
  END IF;
  
  -- 如果配额为-1或null，表示无限制
  IF v_quota IS NULL OR v_quota = -1 THEN
    RETURN TRUE;
  END IF;
  
  -- 根据配额类型决定检查范围：
  -- 1. 如果配额是全局配额（v_quota_bot_id IS NULL），则检查全局使用量（所有数智人的总和）
  -- 2. 如果配额是特定数智人配额（v_quota_bot_id IS NOT NULL），则检查该数智人的使用量
  IF v_quota_bot_id IS NULL THEN
    -- 全局配额：计算所有数智人的使用量总和
    SELECT COALESCE(SUM(conversation_count), 0) INTO v_current_count
    FROM usage_metrics
    WHERE user_id = p_user_id 
      AND bot_id IS NOT NULL  -- 只统计数智人的使用量，不包括全局记录
      AND period_start = v_current_month_start
      AND period_end = v_current_month_end;
  ELSE
    -- 特定数智人配额：只检查该数智人的使用量
    SELECT conversation_count INTO v_current_count
    FROM usage_metrics
    WHERE user_id = p_user_id 
      AND bot_id = p_bot_id
      AND period_start = v_current_month_start
      AND period_end = v_current_month_end;
    
    -- 如果没有统计记录，表示当前使用量为0
    IF v_current_count IS NULL THEN
      v_current_count := 0;
    END IF;
  END IF;
  
  -- 检查是否超额
  -- 明确返回布尔值：如果使用量小于配额，返回true（允许）；否则返回false（禁止）
  IF v_current_count < v_quota THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

-- 创建原子操作函数：检查配额并记录使用量（最简单直接的方法）
-- 在一个事务中完成检查和记录，避免竞态条件
CREATE OR REPLACE FUNCTION check_and_record_conversation_usage(
  p_user_id UUID,
  p_bot_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quota INTEGER;
  v_quota_bot_id UUID;
  v_current_count INTEGER;
  v_current_month_start DATE;
  v_current_month_end DATE;
  v_allowed BOOLEAN;
BEGIN
  -- 获取当前月份的起止日期
  v_current_month_start := date_trunc('month', CURRENT_DATE)::DATE;
  v_current_month_end := (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- 获取用户配额（优先特定数智人，后全局）
  SELECT max_conversations, bot_id INTO v_quota, v_quota_bot_id
  FROM user_quotas
  WHERE user_id = p_user_id AND bot_id = p_bot_id;
  
  IF v_quota IS NULL THEN
    SELECT max_conversations, bot_id INTO v_quota, v_quota_bot_id
    FROM user_quotas
    WHERE user_id = p_user_id AND bot_id IS NULL;
  END IF;
  
  -- 如果配额为-1或null，表示无限制，直接记录并返回true
  IF v_quota IS NULL OR v_quota = -1 THEN
    -- 记录使用量（无限制时直接记录）
    INSERT INTO usage_metrics (user_id, bot_id, conversation_count, token_count, period_start, period_end)
    VALUES (p_user_id, p_bot_id, 1, 0, v_current_month_start, v_current_month_end)
    ON CONFLICT (user_id, bot_id, period_start, period_end)
    DO UPDATE SET
      conversation_count = usage_metrics.conversation_count + 1,
      updated_at = NOW();
    
    -- 更新全局统计（使用 CTE 确保能读取到刚插入的数据）
    WITH bot_totals AS (
      SELECT COALESCE(SUM(conversation_count), 0) as total_conversations
      FROM usage_metrics
      WHERE user_id = p_user_id 
        AND bot_id IS NOT NULL
        AND period_start = v_current_month_start
        AND period_end = v_current_month_end
    )
    INSERT INTO usage_metrics (user_id, bot_id, conversation_count, token_count, period_start, period_end)
    SELECT 
      p_user_id,
      NULL,
      (SELECT total_conversations FROM bot_totals),
      0,
      v_current_month_start,
      v_current_month_end
    ON CONFLICT (user_id, bot_id, period_start, period_end)
    DO UPDATE SET
      conversation_count = (
        SELECT COALESCE(SUM(conversation_count), 0)
        FROM usage_metrics
        WHERE user_id = p_user_id 
          AND bot_id IS NOT NULL
          AND period_start = v_current_month_start
          AND period_end = v_current_month_end
      ),
      updated_at = NOW();
    
    RETURN TRUE;
  END IF;
  
  -- 检查当前使用量
  IF v_quota_bot_id IS NULL THEN
    -- 全局配额：计算所有数智人的使用量总和
    SELECT COALESCE(SUM(conversation_count), 0) INTO v_current_count
    FROM usage_metrics
    WHERE user_id = p_user_id 
      AND bot_id IS NOT NULL
      AND period_start = v_current_month_start
      AND period_end = v_current_month_end;
  ELSE
    -- 特定数智人配额：只检查该数智人的使用量
    SELECT COALESCE(conversation_count, 0) INTO v_current_count
    FROM usage_metrics
    WHERE user_id = p_user_id 
      AND bot_id = p_bot_id
      AND period_start = v_current_month_start
      AND period_end = v_current_month_end;
  END IF;
  
  -- 检查是否允许（使用量必须小于配额）
  v_allowed := v_current_count < v_quota;
  
  -- 如果允许，立即记录使用量（原子操作）
  IF v_allowed THEN
    -- 记录特定数智人的使用量
    INSERT INTO usage_metrics (user_id, bot_id, conversation_count, token_count, period_start, period_end)
    VALUES (p_user_id, p_bot_id, 1, 0, v_current_month_start, v_current_month_end)
    ON CONFLICT (user_id, bot_id, period_start, period_end)
    DO UPDATE SET
      conversation_count = usage_metrics.conversation_count + 1,
      updated_at = NOW();
    
    -- 更新全局统计（使用 CTE 确保能读取到刚插入的数据）
    WITH bot_totals AS (
      SELECT COALESCE(SUM(conversation_count), 0) as total_conversations
      FROM usage_metrics
      WHERE user_id = p_user_id 
        AND bot_id IS NOT NULL
        AND period_start = v_current_month_start
        AND period_end = v_current_month_end
    )
    INSERT INTO usage_metrics (user_id, bot_id, conversation_count, token_count, period_start, period_end)
    SELECT 
      p_user_id,
      NULL,
      (SELECT total_conversations FROM bot_totals),
      0,
      v_current_month_start,
      v_current_month_end
    ON CONFLICT (user_id, bot_id, period_start, period_end)
    DO UPDATE SET
      conversation_count = (
        SELECT COALESCE(SUM(conversation_count), 0)
        FROM usage_metrics
        WHERE user_id = p_user_id 
          AND bot_id IS NOT NULL
          AND period_start = v_current_month_start
          AND period_end = v_current_month_end
      ),
      updated_at = NOW();
  END IF;
  
  RETURN v_allowed;
END;
$$;
