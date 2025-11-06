-- 启用 usage_metrics 表的实时功能
-- 这是 Supabase Realtime 功能必需的

-- 1. 启用实时发布（如果尚未启用）
-- 注意：这需要在 Supabase Dashboard 中手动启用，或者在 SQL Editor 中执行
-- 但通常 Supabase 会自动为所有表启用实时功能

-- 2. 如果需要手动启用，可以使用以下命令（取决于 Supabase 版本）
-- 对于 Supabase，通常通过 Dashboard 启用：
-- Database > Replication > 找到 usage_metrics 表 > 启用

-- 3. 检查实时功能是否已启用
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
  AND tablename = 'usage_metrics';

-- 如果上面的查询返回空结果，说明需要启用实时功能
-- 启用方法（PostgreSQL 14+）：
-- ALTER PUBLICATION supabase_realtime ADD TABLE usage_metrics;

-- 注意：在 Supabase Cloud 中，这通常通过 Dashboard 完成
-- 路径：Database > Replication > 找到 usage_metrics 表 > 点击启用

