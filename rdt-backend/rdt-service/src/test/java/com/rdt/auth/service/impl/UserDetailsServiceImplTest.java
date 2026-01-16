package com.rdt.auth.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.rdt.auth.model.entity.SysUser;
import com.rdt.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Load User Success: Should map SysUser to UserDetails")
    void loadUserByUsername_Success() {
        // Given
        SysUser user = SysUser.builder()
                .username("admin")
                .password("encodedPassword")
                .status(1) // STATUS_NORMAL
                .build();

        when(userRepository.selectOne(any())).thenReturn(user);

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername("admin");

        // Then
        assertNotNull(userDetails);
        assertEquals("admin", userDetails.getUsername());
        assertEquals("encodedPassword", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonLocked());
    }

    @Test
    @DisplayName("Load User Failure: Should throw UsernameNotFoundException")
    void loadUserByUsername_NotFound() {
        // Given
        when(userRepository.selectOne(any())).thenReturn(null);

        // When & Then
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("unknown"));
    }

    @Test
    @DisplayName("Load User Locked: UserDetails should reflect locked state")
    void loadUserByUsername_Locked() {
        // Given
        SysUser user = SysUser.builder()
                .username("lockedUser")
                .password("encodedPassword")
                .status(2) // STATUS_LOCKED
                .build();

        when(userRepository.selectOne(any())).thenReturn(user);

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername("lockedUser");

        // Then
        assertNotNull(userDetails);
        assertFalse(userDetails.isAccountNonLocked());
    }
}
