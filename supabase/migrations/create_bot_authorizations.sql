-- 创建数智人授权表
CREATE TABLE IF NOT EXISTS bot_authorizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 确保一个用户对一个数智人只有一个授权记录
  UNIQUE(user_id, bot_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bot_authorizations_user_id ON bot_authorizations(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_authorizations_bot_id ON bot_authorizations(bot_id);

-- 启用RLS
ALTER TABLE bot_authorizations ENABLE ROW LEVEL SECURITY;

-- 管理员可以查看所有授权记录
CREATE POLICY "管理员可以查看所有授权记录" ON bot_authorizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 用户可以查看自己的授权记录
CREATE POLICY "用户可以查看自己的授权记录" ON bot_authorizations
  FOR SELECT USING (user_id = auth.uid());

-- 管理员可以管理所有授权记录
CREATE POLICY "管理员可以管理所有授权记录" ON bot_authorizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  ); 