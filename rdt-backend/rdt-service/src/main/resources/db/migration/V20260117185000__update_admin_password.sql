-- Update admin password to '123456'
-- Hash: $2a$10$gev1dwI4UUnUgKcHm4CY7O/ktcD0N/PQuvQJWtJX6SyS74N2MP7xu
UPDATE sys_user 
SET password = '$2a$10$gev1dwI4UUnUgKcHm4CY7O/ktcD0N/PQuvQJWtJX6SyS74N2MP7xu' 
WHERE username = 'admin';
