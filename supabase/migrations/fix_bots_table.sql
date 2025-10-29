-- 修复bots表的user_id外键引用
-- 先移除当前的外键约束
ALTER TABLE bots DROP CONSTRAINT IF EXISTS bots_user_id_fkey;

-- 然后添加正确的外键约束，指向auth.users表
ALTER TABLE bots ADD CONSTRAINT bots_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 更新API密钥字段的注释，提醒正确的格式
COMMENT ON COLUMN bots.api_key IS 'Coze API密钥，必须以pat_开头';

-- 更新coze_bot_id字段的注释
COMMENT ON COLUMN bots.coze_bot_id IS 'Coze数智人ID，应为数字格式'; 