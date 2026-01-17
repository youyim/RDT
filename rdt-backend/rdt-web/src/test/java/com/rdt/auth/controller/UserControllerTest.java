package com.rdt.auth.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rdt.auth.component.JwtProvider;
import com.rdt.auth.model.dto.CreateUserReq;
import com.rdt.auth.model.dto.UpdateUserReq;
import com.rdt.auth.model.dto.UserDto;
import com.rdt.auth.service.UserService;
import java.util.Collections;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(
            username = "admin",
            roles = {"ADMIN"})
    @DisplayName("createUser: should return success when valid request")
    public void createUser_Success() throws Exception {
        CreateUserReq req = new CreateUserReq();
        req.setUsername("newuser");
        req.setEmail("new@example.com");
        req.setPassword("password123");

        doNothing().when(userService).createUser(any(CreateUserReq.class));

        mockMvc.perform(post("/users")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @WithMockUser(
            username = "admin",
            roles = {"ADMIN"})
    @DisplayName("getUsers: should return paginated list")
    public void getUsers_Success() throws Exception {
        Page<UserDto> mockPage = new Page<>();
        mockPage.setRecords(Collections.singletonList(new UserDto()));
        mockPage.setTotal(1);

        when(userService.getUsers(anyInt(), anyInt(), any())).thenReturn(mockPage);

        mockMvc.perform(get("/users").param("page", "1").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.records").isArray());
    }

    @Test
    @WithMockUser(
            username = "admin",
            roles = {"ADMIN"})
    @DisplayName("updateUser: should return success")
    public void updateUser_Success() throws Exception {
        UpdateUserReq req = new UpdateUserReq();
        req.setEmail("updated@example.com");

        doNothing().when(userService).updateUser(anyLong(), any(UpdateUserReq.class));

        mockMvc.perform(put("/users/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @WithMockUser(
            username = "admin",
            roles = {"ADMIN"})
    @DisplayName("softDeleteUser: should return success")
    public void softDeleteUser_Success() throws Exception {
        when(userService.softDeleteUser(anyLong())).thenReturn(true);

        mockMvc.perform(delete("/users/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @WithMockUser(
            username = "admin",
            roles = {"ADMIN"})
    @DisplayName("resetPassword: should return success")
    public void resetPassword_Success() throws Exception {
        when(userService.mockResetPassword(anyLong())).thenReturn(true);

        mockMvc.perform(post("/users/1/reset-password").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
