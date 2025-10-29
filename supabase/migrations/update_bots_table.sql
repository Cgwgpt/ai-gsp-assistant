-- 修改bots表的user_id字段，使其允许为null
ALTER TABLE bots
ALTER COLUMN user_id DROP NOT NULL; 