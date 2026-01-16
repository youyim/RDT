package com.rdt.auth.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.rdt.auth.component.JwtProvider;
import com.rdt.auth.model.dto.LoginReq;
import com.rdt.auth.model.dto.LoginResp;
import com.rdt.auth.model.entity.SysUser;
import com.rdt.auth.repository.UserRepository;
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
        assertThrows(RuntimeException.class, () -> authService.login(req));
    }
}
