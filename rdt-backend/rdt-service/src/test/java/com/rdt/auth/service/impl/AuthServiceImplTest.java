package com.rdt.auth.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.rdt.auth.component.JwtProvider;
import com.rdt.auth.model.dto.LoginReq;
import com.rdt.auth.model.dto.LoginResp;
import com.rdt.auth.model.entity.SysUser;
import com.rdt.auth.repository.UserRepository;
import com.rdt.common.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Login Success: Valid credentials should return token")
    void login_Success() {
        // Given
        LoginReq req = new LoginReq();
        req.setUsername("admin");
        req.setPassword("password");

        SysUser user = SysUser.builder()
                .id(1L)
                .username("admin")
                .password("encodedPassword")
                .status(1)
                .build();

        when(userRepository.selectOne(any())).thenReturn(user);
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtProvider.generateToken("admin")).thenReturn("mockToken");

        // When
        LoginResp resp = authService.login(req);

        // Then
        assertNotNull(resp);
        assertEquals("mockToken", resp.getToken());
        assertEquals(1L, resp.getUser().getId());
    }

    @Test
    @DisplayName("Login Failure: User not found should throw exception")
    void login_UserNotFound() {
        // Given
        LoginReq req = new LoginReq();
        req.setUsername("unknown");
        req.setPassword("password");

        when(userRepository.selectOne(any())).thenReturn(null);

        // When & Then (Expect RuntimeException for now, standard should be custom)
        assertThrows(BusinessException.class, () -> authService.login(req));
    }

    @Test
    @DisplayName("Login Failure: Disabled account should throw exception")
    void login_AccountDisabled() {
        // Given
        LoginReq req = new LoginReq();
        req.setUsername("disabledUser");
        req.setPassword("password");

        SysUser user = SysUser.builder()
                .username("disabledUser")
                .password("encodedPassword")
                .status(0) // STATUS_DISABLED
                .build();

        when(userRepository.selectOne(any())).thenReturn(user);

        // When & Then
        assertThrows(BusinessException.class, () -> authService.login(req));
    }

    @Test
    @DisplayName("Login Failure: Locked account should throw exception")
    void login_AccountLocked() {
        // Given
        LoginReq req = new LoginReq();
        req.setUsername("lockedUser");
        req.setPassword("password");

        SysUser user = SysUser.builder()
                .username("lockedUser")
                .password("encodedPassword")
                .status(2) // STATUS_LOCKED
                .lockExpireTime(java.time.LocalDateTime.now().plusMinutes(30))
                .build();

        when(userRepository.selectOne(any())).thenReturn(user);

        // When & Then
        assertThrows(BusinessException.class, () -> authService.login(req));
    }

    @Test
    @DisplayName("Login Failure: Locked account should auto-unlock if expired")
    void login_AccountLocked_Expired() {
        // Given
        LoginReq req = new LoginReq();
        req.setUsername("lockedUser");
        req.setPassword("password");

        SysUser user = SysUser.builder()
                .id(1L)
                .username("lockedUser")
                .password("encodedPassword")
                .status(2) // STATUS_LOCKED
                .lockExpireTime(java.time.LocalDateTime.now().minusMinutes(1)) // Expired
                .build();

        when(userRepository.selectOne(any())).thenReturn(user);
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtProvider.generateToken("lockedUser")).thenReturn("mockToken");

        // When
        LoginResp resp = authService.login(req);

        // Then
        assertNotNull(resp);
        assertEquals(1, user.getStatus()); // STATUS_NORMAL
        assertNull(user.getLockExpireTime());
    }

    @Test
    @DisplayName("Login Failure: Bad credentials should increment attempts")
    void login_BadCredentials() {
        // Given
        LoginReq req = new LoginReq();
        req.setUsername("user");
        req.setPassword("wrongPassword");

        SysUser user = SysUser.builder()
                .username("user")
                .password("encodedPassword")
                .status(1) // STATUS_NORMAL
                .failedAttempts(0)
                .build();

        when(userRepository.selectOne(any())).thenReturn(user);
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        // When & Then
        assertThrows(BusinessException.class, () -> authService.login(req));
        assertEquals(1, user.getFailedAttempts());
        verify(userRepository).updateById(user);
    }

    @Test
    @DisplayName("Login Failure: MAX attempts should lock account")
    void login_MaxFailedAttempts() {
        // Given
        LoginReq req = new LoginReq();
        req.setUsername("user");
        req.setPassword("wrongPassword");

        SysUser user = SysUser.builder()
                .username("user")
                .password("encodedPassword")
                .status(1) // STATUS_NORMAL
                .failedAttempts(4) // One more fail will reach 5
                .build();

        when(userRepository.selectOne(any())).thenReturn(user);
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        // When & Then
        assertThrows(BusinessException.class, () -> authService.login(req));
        assertEquals(5, user.getFailedAttempts());
        assertEquals(2, user.getStatus()); // STATUS_LOCKED
        assertNotNull(user.getLockExpireTime());
        verify(userRepository).updateById(user);
    }

    @Test
    @DisplayName("Generate Hash for 123456")
    void generateHash_ForManualUpdate() {
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        String hash = encoder.encode("123456");
        System.out.println("GENERATED_HASH_123456: " + hash);
    }
}
