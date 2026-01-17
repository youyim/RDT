-- 为 sys_user 表添加 avatar 字段
-- 检查 avatar 字段是否存在
SELECT COUNT(1) INTO @col_exists 
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
  AND table_name = 'sys_user' 
  AND column_name = 'avatar';

SET @sql_add_col = IF(@col_exists = 0, 
    'ALTER TABLE sys_user ADD COLUMN avatar VARCHAR(255) DEFAULT NULL COMMENT ''用户头像'' AFTER email', 
    'SELECT "Column avatar already exists"');

PREPARE stmt_add_col FROM @sql_add_col;
EXECUTE stmt_add_col;
DEALLOCATE PREPARE stmt_add_col;

-- 添加邮箱索引（如果尚未存在）
SELECT COUNT(1) INTO @index_exists 
FROM information_schema.statistics 
WHERE table_schema = DATABASE() 
  AND table_name = 'sys_user' 
  AND index_name = 'idx_user_email';

SET @sql_add_idx = IF(@index_exists = 0, 
    'ALTER TABLE sys_user ADD INDEX idx_user_email (email)', 
    'SELECT "Index idx_user_email already exists"');

PREPARE stmt_add_idx FROM @sql_add_idx;
EXECUTE stmt_add_idx;
DEALLOCATE PREPARE stmt_add_idx;
