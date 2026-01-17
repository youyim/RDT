package com.rdt.auth.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.auth.mapper.UserMapper;
import com.rdt.auth.model.dto.CreateUserReq;
import com.rdt.auth.model.dto.UpdateUserReq;
import com.rdt.auth.model.dto.UserDto;
import com.rdt.auth.model.entity.SysUser;
import com.rdt.common.exception.BusinessException;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    @DisplayName("createUser: should throw exception when username exists")
    public void createUser_Fail_DuplicateUsername() {
        // Given
        CreateUserReq req = new CreateUserReq();
        req.setUsername("existing");

        when(userMapper.selectCount(any())).thenReturn(1L);

        // When & Then
        assertThrows(BusinessException.class, () -> userService.createUser(req));
        verify(userMapper, never()).insert(any());
    }

    @Test
    @DisplayName("createUser: should succeed when username is unique")
    public void createUser_Success() {
        // Given
        CreateUserReq req = new CreateUserReq();
        req.setUsername("newuser");
        req.setPassword("password");
        req.setEmail("test@example.com");

        when(userMapper.selectCount(any())).thenReturn(0L);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userMapper.insert(any(SysUser.class))).thenReturn(1);

        // When
        userService.createUser(req);

        // Then
        verify(passwordEncoder).encode("password");
        verify(userMapper).insert(any(SysUser.class));
    }

    @Test
    @DisplayName("updateUser: should succeed when user exists")
    public void updateUser_Success() {
        // Given
        Long id = 1L;
        UpdateUserReq req = new UpdateUserReq();
        req.setEmail("new@example.com");
        req.setAvatar("new-avatar.png");

        SysUser existingUser = new SysUser();
        existingUser.setId(id);
        existingUser.setUsername("user");

        when(userMapper.selectById(id)).thenReturn(existingUser);
        when(userMapper.updateById(any())).thenReturn(1);

        // When
        userService.updateUser(id, req);

        // Then
        assertEquals("new@example.com", existingUser.getEmail());
        assertEquals("new-avatar.png", existingUser.getAvatar());
        verify(userMapper).updateById(existingUser);
    }

    @Test
    @DisplayName("updateUser: should throw exception when user not found")
    public void updateUser_Fail_NotFound() {
        when(userMapper.selectById(anyLong())).thenReturn(null);
        assertThrows(BusinessException.class, () -> userService.updateUser(1L, new UpdateUserReq()));
    }

    @Test
    @DisplayName("softDeleteUser: should succeed when user exists")
    public void softDeleteUser_Success() {
        Long id = 1L;
        SysUser user = new SysUser();
        when(userMapper.selectById(id)).thenReturn(user);
        when(userMapper.deleteById(id)).thenReturn(1);

        assertTrue(userService.softDeleteUser(id));
    }

    @Test
    @DisplayName("mockResetPassword: should succeed when user exists")
    public void mockResetPassword_Success() {
        Long id = 1L;
        SysUser user = new SysUser();
        user.setEmail("test@example.com");
        when(userMapper.selectById(id)).thenReturn(user);

        assertTrue(userService.mockResetPassword(id));
    }

    @Test
    @DisplayName("getUserById: should return dto when user exists")
    public void getUserById_Success() {
        Long id = 1L;
        SysUser user = new SysUser();
        user.setId(id);
        user.setUsername("user");
        when(userMapper.selectById(id)).thenReturn(user);

        UserDto result = userService.getUserById(id);
        assertNotNull(result);
        assertEquals("user", result.getUsername());
    }

    @Test
    @DisplayName("getUsers: should return page of dtos")
    public void getUsers_Success() {
        // Given
        Page<SysUser> userPage = new Page<>(1, 10);
        SysUser user = new SysUser();
        user.setUsername("user");
        userPage.setRecords(List.of(user));
        userPage.setTotal(1);

        when(userMapper.selectPage(any(), any())).thenReturn(userPage);

        // When
        Page<UserDto> result = userService.getUsers(1, 10, "keyword");

        // Then
        assertNotNull(result);
        assertEquals(1, result.getRecords().size());
        assertEquals("user", result.getRecords().get(0).getUsername());
    }
}
