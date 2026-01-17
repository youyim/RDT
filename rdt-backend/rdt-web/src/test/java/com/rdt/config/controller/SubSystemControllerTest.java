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
import com.rdt.config.model.dto.SubSystemCreateRequest;
import com.rdt.config.model.dto.SubSystemResponse;
import com.rdt.config.model.dto.SubSystemUpdateRequest;
import com.rdt.config.service.SubSystemService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(SubSystemController.class)
class SubSystemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SubSystemService subSystemService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "ADMIN")
    void createSubSystem_Success() throws Exception {
        SubSystemCreateRequest request = SubSystemCreateRequest.builder()
                .mainSystemId(1L)
                .code("SUB001")
                .name("Test SubSystem")
                .build();

        when(subSystemService.createSubSystem(any(SubSystemCreateRequest.class)))
                .thenReturn(1L);

        mockMvc.perform(post("/api/v1/sub-systems")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").value(1L));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getSubSystem_Success() throws Exception {
        SubSystemResponse response = SubSystemResponse.builder()
                .id(1L)
                .mainSystemId(1L)
                .code("SUB001")
                .name("Test SubSystem")
                .build();

        when(subSystemService.getSubSystem(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/sub-systems/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.code").value("SUB001"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getSubSystemList_Success() throws Exception {
        Page<SubSystemResponse> page = new Page<>(1, 10);
        page.setRecords(List.of(
                SubSystemResponse.builder()
                        .id(1L)
                        .mainSystemId(1L)
                        .code("SUB001")
                        .name("SubSystem 1")
                        .build(),
                SubSystemResponse.builder()
                        .id(2L)
                        .mainSystemId(1L)
                        .code("SUB002")
                        .name("SubSystem 2")
                        .build()));
        page.setTotal(2);

        when(subSystemService.getSubSystemList(anyLong(), anyString(), anyInt(), anyInt()))
                .thenReturn(page);

        mockMvc.perform(get("/api/v1/sub-systems")
                        .param("mainSystemId", "1")
                        .param("keyword", "test")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.records").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSubSystem_Success() throws Exception {
        SubSystemUpdateRequest request =
                SubSystemUpdateRequest.builder().name("Updated SubSystem").build();

        doNothing().when(subSystemService).updateSubSystem(anyLong(), any(SubSystemUpdateRequest.class));

        mockMvc.perform(put("/api/v1/sub-systems/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteSubSystem_Success() throws Exception {
        doNothing().when(subSystemService).deleteSubSystem(1L);

        mockMvc.perform(delete("/api/v1/sub-systems/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
