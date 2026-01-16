CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    status INT NOT NULL,
    failed_attempts INT DEFAULT 0,
    lock_expire_time TIMESTAMP,
    last_login_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_username ON sys_user(username);

-- Initial Data
INSERT INTO sys_user (id, username, password, status, failed_attempts) 
VALUES (1, 'admin', '$2a$10$7JB720yubVSZv5W8vNGkarOx8wFreAjMksEwerIAdW80tWg4h0e', 1, 0);
-- Password is '123456' (BCrypt)
