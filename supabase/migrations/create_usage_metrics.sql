-- 创建用户用量配额表
CREATE TABLE IF NOT EXISTS user_quotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  max_conversations INTEGER DEFAULT -1, -- -1 表示无限制
  max_tokens INTEGER DEFAULT -1, -- -1 表示无限制
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 确保一个用户对一个数智人只有一个配额记录，如果bot_id为null则表示全局配额
  UNIQUE(user_id, bot_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_quotas_user_id ON user_quotas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quotas_bot_id ON user_quotas(bot_id);

-- 创建用量统计表
CREATE TABLE IF NOT EXISTS usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  conversation_count INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  period_start DATE NOT NULL, -- 统计周期开始日期
  period_end DATE NOT NULL, -- 统计周期结束日期
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 确保用户在特定周期内对特定数智人只有一条记录
  UNIQUE(user_id, bot_id, period_start, period_end)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_usage_metrics_user_id ON usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_bot_id ON usage_metrics(bot_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_period ON usage_metrics(period_start, period_end);

-- 启用RLS
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

-- 管理员可以管理所有配额和查看所有用量统计
CREATE POLICY "管理员可以管理所有配额" ON user_quotas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "管理员可以查看所有用量统计" ON usage_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 用户可以查看自己的配额
CREATE POLICY "用户可以查看自己的配额" ON user_quotas
  FOR SELECT USING (user_id = auth.uid());

-- 用户可以查看自己的用量统计
CREATE POLICY "用户可以查看自己的用量统计" ON usage_metrics
  FOR SELECT USING (user_id = auth.uid());

-- 创建函数: 检查用户是否超出对话限制
CREATE OR REPLACE FUNCTION check_user_conversation_quota(
  p_user_id UUID,
  p_bot_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_quota INTEGER;
  v_current_count INTEGER;
  v_current_month_start DATE;
  v_current_month_end DATE;
BEGIN
  -- 获取当前月份的起止日期
  v_current_month_start := date_trunc('month', CURRENT_DATE)::DATE;
  v_current_month_end := (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- 获取用户针对特定数智人的配额
  SELECT max_conversations INTO v_quota
  FROM user_quotas
  WHERE user_id = p_user_id AND bot_id = p_bot_id;
  
  -- 如果没有找到特定配额，检查全局配额
  IF v_quota IS NULL THEN
    SELECT max_conversations INTO v_quota
    FROM user_quotas
    WHERE user_id = p_user_id AND bot_id IS NULL;
  END IF;
  
  -- 如果配额为-1或null，表示无限制
  IF v_quota IS NULL OR v_quota = -1 THEN
    RETURN TRUE;
  END IF;
  
  -- 获取当前使用量（修正：只查询特定数智人的使用量）
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
  
  -- 检查是否超额
  RETURN v_current_count < v_quota;
END;
$$ LANGUAGE plpgsql; 