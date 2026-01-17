package com.rdt.config.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.common.exception.BusinessException;
import com.rdt.config.mapper.MainSystemMapper;
import com.rdt.config.mapper.SubSystemMapper;
import com.rdt.config.model.dto.MainSystemCreateRequest;
import com.rdt.config.model.dto.MainSystemUpdateRequest;
import com.rdt.config.model.entity.MainSystemEntity;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MainSystemServiceTest {

    @Mock
    private MainSystemMapper mainSystemMapper;

    @Mock
    private SubSystemMapper subSystemMapper;

    @InjectMocks
    private MainSystemServiceImpl mainSystemService;

    @Test
    @DisplayName("Create Main System - Success")
    void createMainSystem_Success() {
        MainSystemCreateRequest request = MainSystemCreateRequest.builder()
                .name("Finance System")
                .code("FIN_SYS")
                .owner("admin")
                .description("Finance Description")
                .build();

        when(mainSystemMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L);
        when(mainSystemMapper.insert(any(MainSystemEntity.class))).thenAnswer(invocation -> {
            MainSystemEntity entity = invocation.getArgument(0);
            entity.setId(10L);
            return 1;
        });

        Long id = mainSystemService.createMainSystem(request);

        assertEquals(10L, id);
        verify(mainSystemMapper).insert(any(MainSystemEntity.class));
    }

    @Test
    @DisplayName("Create Main System - Failure: Duplicate Code")
    void createMainSystem_Failure_DuplicateCode() {
        MainSystemCreateRequest request = MainSystemCreateRequest.builder()
                .name("Finance System")
                .code("FIN_SYS")
                .build();

        when(mainSystemMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(1L);

        assertThrows(BusinessException.class, () -> mainSystemService.createMainSystem(request));
        verify(mainSystemMapper, never()).insert(any(MainSystemEntity.class));
    }

    @Test
    @DisplayName("Get Main System - Success")
    void getMainSystem_Success() {
        MainSystemEntity entity = MainSystemEntity.builder()
                .id(1L)
                .name("Test System")
                .code("TEST")
                .build();
        when(mainSystemMapper.selectById(1L)).thenReturn(entity);

        var response = mainSystemService.getMainSystem(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test System", response.getName());
    }

    @Test
    @DisplayName("Get Main System - Not Found")
    void getMainSystem_NotFound() {
        when(mainSystemMapper.selectById(1L)).thenReturn(null);
        assertThrows(BusinessException.class, () -> mainSystemService.getMainSystem(1L));
    }

    @Test
    @DisplayName("Get Main System List - Success")
    void getMainSystemList_Success() {
        Page<MainSystemEntity> pageResult = new Page<>();
        pageResult.setRecords(List.of(
                MainSystemEntity.builder().id(1L).name("Sys1").code("S1").build(),
                MainSystemEntity.builder().id(2L).name("Sys2").code("S2").build()));
        pageResult.setTotal(2);

        when(mainSystemMapper.selectPage(any(Page.class), any(LambdaQueryWrapper.class)))
                .thenReturn(pageResult);

        var result = mainSystemService.getMainSystemList("Sys", 1, 10);

        assertEquals(2, result.getTotal());
        assertEquals(2, result.getRecords().size());
        assertEquals("Sys1", result.getRecords().get(0).getName());
    }

    @Test
    @DisplayName("Update Main System - Success")
    void updateMainSystem_Success() {
        MainSystemUpdateRequest request = MainSystemUpdateRequest.builder()
                .name("Updated Name")
                .code("UPDATED")
                .build();
        MainSystemEntity entity = MainSystemEntity.builder().id(1L).code("OLD").build();

        when(mainSystemMapper.selectById(1L)).thenReturn(entity);
        when(mainSystemMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L); // No duplicate code

        mainSystemService.updateMainSystem(1L, request);

        verify(mainSystemMapper).updateById(any(MainSystemEntity.class));
        assertEquals("Updated Name", entity.getName());
    }

    @Test
    @DisplayName("Update Main System - Not Found")
    void updateMainSystem_NotFound() {
        MainSystemUpdateRequest request = MainSystemUpdateRequest.builder().build();
        when(mainSystemMapper.selectById(1L)).thenReturn(null);
        assertThrows(BusinessException.class, () -> mainSystemService.updateMainSystem(1L, request));
    }

    @Test
    @DisplayName("Delete Main System - Success")
    void deleteMainSystem_Success() {
        when(subSystemMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L);
        mainSystemService.deleteMainSystem(1L);
        verify(mainSystemMapper).deleteById(1L);
    }

    @Test
    @DisplayName("Delete Main System - Failure: Has Sub Systems")
    void deleteMainSystem_Failure_HasChildren() {
        when(subSystemMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(1L);
        assertThrows(BusinessException.class, () -> mainSystemService.deleteMainSystem(1L));
        verify(mainSystemMapper, never()).deleteById(anyLong());
    }
}
