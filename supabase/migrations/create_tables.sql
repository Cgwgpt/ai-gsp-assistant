-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建数智人表
CREATE TABLE IF NOT EXISTS bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coze_bot_id TEXT NOT NULL,
  name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_bots_user_id ON bots(user_id);
CREATE INDEX IF NOT EXISTS idx_bots_coze_bot_id ON bots(coze_bot_id);

-- 创建对话表
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_bot_id ON conversations(bot_id);

-- 创建消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- 为bots表启用RLS
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的或公开的数智人
CREATE POLICY "用户可查看自己的或公开的数智人" ON bots
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

-- 创建策略：用户只能修改自己的数智人
CREATE POLICY "用户只能修改自己的数智人" ON bots
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建策略：用户只能删除自己的数智人
CREATE POLICY "用户只能删除自己的数智人" ON bots
  FOR DELETE USING (auth.uid() = user_id);

-- 创建策略：用户可以创建数智人
CREATE POLICY "用户可以创建数智人" ON bots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 为conversations表启用RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的对话
CREATE POLICY "用户只能查看自己的对话" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

-- 创建策略：用户只能创建自己的对话
CREATE POLICY "用户只能创建自己的对话" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能修改自己的对话
CREATE POLICY "用户只能修改自己的对话" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建策略：用户只能删除自己的对话
CREATE POLICY "用户只能删除自己的对话" ON conversations
  FOR DELETE USING (auth.uid() = user_id);

-- 为messages表启用RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己对话中的消息
CREATE POLICY "用户只能查看自己对话中的消息" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

-- 创建策略：用户只能添加消息到自己的对话
CREATE POLICY "用户只能添加消息到自己的对话" ON messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

-- 创建策略：用户只能修改自己对话中的消息
CREATE POLICY "用户只能修改自己对话中的消息" ON messages
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

-- 创建策略：用户只能删除自己对话中的消息
CREATE POLICY "用户只能删除自己对话中的消息" ON messages
  FOR DELETE USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  ); 