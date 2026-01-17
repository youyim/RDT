package com.rdt.config.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rdt.auth.component.JwtProvider;
import com.rdt.config.model.dto.MainSystemCreateRequest;
import com.rdt.config.model.dto.MainSystemResponse;
import com.rdt.config.model.dto.MainSystemUpdateRequest;
import com.rdt.config.service.MainSystemService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(MainSystemController.class)
class MainSystemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MainSystemService mainSystemService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "ADMIN")
    void createMainSystem_Success() throws Exception {
        MainSystemCreateRequest request = MainSystemCreateRequest.builder()
                .code("SYS001")
                .name("Test System")
                .build();

        when(mainSystemService.createMainSystem(any(MainSystemCreateRequest.class)))
                .thenReturn(1L);

        mockMvc.perform(post("/api/v1/main-systems")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").value(1L));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getMainSystem_Success() throws Exception {
        MainSystemResponse response = MainSystemResponse.builder()
                .id(1L)
                .code("SYS001")
                .name("Test System")
                .build();

        when(mainSystemService.getMainSystem(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/main-systems/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.code").value("SYS001"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getMainSystemList_Success() throws Exception {
        Page<MainSystemResponse> page = new Page<>(1, 10);
        page.setRecords(List.of(
                MainSystemResponse.builder()
                        .id(1L)
                        .code("SYS001")
                        .name("System 1")
                        .build(),
                MainSystemResponse.builder()
                        .id(2L)
                        .code("SYS002")
                        .name("System 2")
                        .build()));
        page.setTotal(2);

        when(mainSystemService.getMainSystemList(anyString(), anyInt(), anyInt()))
                .thenReturn(page);

        mockMvc.perform(get("/api/v1/main-systems")
                        .param("keyword", "test")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.records").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateMainSystem_Success() throws Exception {
        MainSystemUpdateRequest request =
                MainSystemUpdateRequest.builder().name("Updated System").build();

        doNothing().when(mainSystemService).updateMainSystem(anyLong(), any(MainSystemUpdateRequest.class));

        mockMvc.perform(put("/api/v1/main-systems/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteMainSystem_Success() throws Exception {
        doNothing().when(mainSystemService).deleteMainSystem(1L);

        mockMvc.perform(delete("/api/v1/main-systems/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
