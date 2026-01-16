package com.rdt.auth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.rdt.auth.component.JwtProvider;
import com.rdt.auth.model.dto.LoginReq;
import com.rdt.auth.model.dto.LoginResp;
import com.rdt.auth.model.entity.SysUser;
import com.rdt.auth.repository.UserRepository;
import com.rdt.auth.service.AuthService;
import com.rdt.common.exception.BusinessException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    // Error Codes
    private static final int ERR_USER_OR_PASS = 11_001;
    private static final int ERR_ACCOUNT_LOCKED = 11_004;
    private static final int ERR_ACCOUNT_DISABLED = 11_005;

    // Policy Constants
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_TIME_MINUTES = 30;
    private static final long TOKEN_EXPIRE_SECONDS = 7200L;

    // Status Constants
    private static final int STATUS_DISABLED = 0;
    private static final int STATUS_NORMAL = 1;
    private static final int STATUS_LOCKED = 2;

    @Override
    public LoginResp login(LoginReq req) {
        // 1. Check User
        SysUser user =
                userRepository.selectOne(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, req.getUsername()));

        if (user == null) {
            throw new BusinessException(ERR_USER_OR_PASS, "Invalid username or password");
        }

        checkUserStatus(user);
        verifyPassword(req.getPassword(), user);

        // 4. Login Success
        return processLoginSuccess(user);
    }

    private void checkUserStatus(SysUser user) {
        if (user.getStatus() == STATUS_DISABLED) {
            throw new BusinessException(ERR_ACCOUNT_DISABLED, "Account is disabled");
        }

        if (user.getStatus() == STATUS_LOCKED) {
            if (user.getLockExpireTime() != null && user.getLockExpireTime().isAfter(LocalDateTime.now())) {
                throw new BusinessException(ERR_ACCOUNT_LOCKED, "Account is locked, please try again later");
            }
            // Auto unlock if expired
            user.setStatus(STATUS_NORMAL);
            user.setFailedAttempts(0);
            user.setLockExpireTime(null);
        }
    }

    private void verifyPassword(String rawPassword, SysUser user) {
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            int attempts = (user.getFailedAttempts() == null ? 0 : user.getFailedAttempts()) + 1;
            user.setFailedAttempts(attempts);
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setStatus(STATUS_LOCKED);
                user.setLockExpireTime(LocalDateTime.now().plusMinutes(LOCK_TIME_MINUTES));
                userRepository.updateById(user);
                throw new BusinessException(ERR_ACCOUNT_LOCKED, "Account locked due to too many failed attempts");
            }
            userRepository.updateById(user);
            throw new BusinessException(ERR_USER_OR_PASS, "Invalid username or password");
        }
    }

    private LoginResp processLoginSuccess(SysUser user) {
        user.setFailedAttempts(0);
        user.setLockExpireTime(null);
        user.setLastLoginTime(LocalDateTime.now());
        userRepository.updateById(user);

        // 5. Generate Token
        String token = jwtProvider.generateToken(user.getUsername());

        return LoginResp.builder()
                .token(token)
                .expiresIn(TOKEN_EXPIRE_SECONDS) // 2h from JwtProvider
                .user(LoginResp.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .status(user.getStatus())
                        .build())
                .build();
    }

    @Override
    public void logout() {
        // Implementation needed
    }
}
