package com.rdt.auth.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rdt.auth.model.dto.LoginReq;
import com.rdt.auth.model.dto.LoginResp;
import com.rdt.auth.service.AuthService;
import com.rdt.common.exception.BusinessException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void login_Success() throws Exception {
        LoginReq req = new LoginReq();
        req.setUsername("admin");
        req.setPassword("123456");

        LoginResp resp = LoginResp.builder().token("mock-token").build();

        when(authService.login(any(LoginReq.class))).thenReturn(resp);

        mockMvc.perform(post("/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.token").value("mock-token"));
    }

    @Test
    @WithMockUser
    void login_Failure() throws Exception {
        LoginReq req = new LoginReq();
        req.setUsername("admin");
        req.setPassword("wrong");

        when(authService.login(any(LoginReq.class))).thenThrow(new BusinessException(11001, "Invalid password"));

        mockMvc.perform(post("/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk()) // ControllerAdvice handles BusinessException usually
                .andExpect(jsonPath("$.code").value(11001));
    }

    @Test
    @WithMockUser
    void logout_Success() throws Exception {
        mockMvc.perform(post("/auth/logout").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
