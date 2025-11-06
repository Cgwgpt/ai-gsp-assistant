-- 创建范例表
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_bot_id ON prompts(bot_id);
CREATE INDEX IF NOT EXISTS idx_prompts_is_public ON prompts(is_public);

-- 为prompts表启用RLS
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户可以查看自己的范例或公开的范例
-- 逻辑：用户可以查看自己的范例，或者公开的范例（不论是否关联数智人）
CREATE POLICY "用户可以查看自己的或公开的范例" ON prompts
  FOR SELECT USING (
    auth.uid() = user_id OR is_public = true
  );

-- 创建策略：用户可以创建范例
CREATE POLICY "用户可以创建范例" ON prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能修改自己的范例
CREATE POLICY "用户只能修改自己的范例" ON prompts
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建策略：用户只能删除自己的范例
CREATE POLICY "用户只能删除自己的范例" ON prompts
  FOR DELETE USING (auth.uid() = user_id);

