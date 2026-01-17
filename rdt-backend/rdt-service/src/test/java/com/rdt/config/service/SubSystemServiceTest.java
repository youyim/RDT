package com.rdt.config.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.common.exception.BusinessException;
import com.rdt.config.mapper.MainSystemMapper;
import com.rdt.config.mapper.SubSystemMapper;
import com.rdt.config.model.dto.SubSystemCreateRequest;
import com.rdt.config.model.dto.SubSystemUpdateRequest;
import com.rdt.config.model.entity.MainSystemEntity;
import com.rdt.config.model.entity.SubSystemEntity;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SubSystemServiceTest {

    @Mock
    private SubSystemMapper subSystemMapper;

    @Mock
    private MainSystemMapper mainSystemMapper;

    @InjectMocks
    private SubSystemServiceImpl subSystemService;

    @Test
    @DisplayName("Create Sub System - Success")
    void createSubSystem_Success() {
        SubSystemCreateRequest request = SubSystemCreateRequest.builder()
                .mainSystemId(1L)
                .name("Backend")
                .code("BACKEND")
                .gitUrl("git@...")
                .build();

        // Mock Main System Exists
        when(mainSystemMapper.selectById(1L)).thenReturn(new MainSystemEntity());
        when(subSystemMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L);
        when(subSystemMapper.insert(any(SubSystemEntity.class))).thenAnswer(invocation -> {
            ((SubSystemEntity) invocation.getArgument(0)).setId(10L);
            return 1;
        });

        Long id = subSystemService.createSubSystem(request);

        assertEquals(10L, id);
    }

    @Test
    @DisplayName("Create Sub System - Fail: Main System Not Found")
    void createSubSystem_Fail_NoMainSystem() {
        SubSystemCreateRequest request =
                SubSystemCreateRequest.builder().mainSystemId(999L).build();

        when(mainSystemMapper.selectById(999L)).thenReturn(null);

        assertThrows(BusinessException.class, () -> subSystemService.createSubSystem(request));
    }

    @Test
    @DisplayName("Get Sub System - Success")
    void getSubSystem_Success() {
        SubSystemEntity entity =
                SubSystemEntity.builder().id(1L).mainSystemId(10L).name("Sub").build();
        when(subSystemMapper.selectById(1L)).thenReturn(entity);
        when(mainSystemMapper.selectById(10L))
                .thenReturn(MainSystemEntity.builder().name("Main").build());

        var response = subSystemService.getSubSystem(1L);

        assertEquals(1L, response.getId());
        assertEquals("Sub", response.getName());
        assertEquals("Main", response.getMainSystemName());
    }

    @Test
    @DisplayName("Get Sub System - Not Found")
    void getSubSystem_NotFound() {
        when(subSystemMapper.selectById(1L)).thenReturn(null);
        assertThrows(BusinessException.class, () -> subSystemService.getSubSystem(1L));
    }

    @Test
    @DisplayName("Get Sub System List - Success")
    void getSubSystemList_Success() {
        Page<SubSystemEntity> pageResult = new Page<>();
        SubSystemEntity sub1 =
                SubSystemEntity.builder().id(1L).mainSystemId(10L).name("Sub1").build();
        pageResult.setRecords(List.of(sub1));
        pageResult.setTotal(1);

        when(subSystemMapper.selectPage(any(Page.class), any(LambdaQueryWrapper.class)))
                .thenReturn(pageResult);
        when(mainSystemMapper.selectById(10L))
                .thenReturn(MainSystemEntity.builder().name("Main").build());

        var result = subSystemService.getSubSystemList(10L, "Sub", 1, 10);

        assertEquals(1, result.getTotal());
        assertEquals("Sub1", result.getRecords().get(0).getName());
    }

    @Test
    @DisplayName("Update Sub System - Success")
    void updateSubSystem_Success() {
        SubSystemUpdateRequest request = SubSystemUpdateRequest.builder()
                .mainSystemId(10L) // Same main system
                .name("Updated")
                .code("UPD")
                .build();
        SubSystemEntity entity =
                SubSystemEntity.builder().id(1L).mainSystemId(10L).code("OLD").build();

        when(subSystemMapper.selectById(1L)).thenReturn(entity);
        when(subSystemMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L);

        subSystemService.updateSubSystem(1L, request);

        verify(subSystemMapper).updateById(entity);
        assertEquals("Updated", entity.getName());
    }

    @Test
    @DisplayName("Update Sub System - Change Main System")
    void updateSubSystem_ChangeMainSystem() {
        SubSystemUpdateRequest request = SubSystemUpdateRequest.builder()
                .mainSystemId(20L) // Changed main system
                .name("Updated")
                .code("UPD")
                .build();
        SubSystemEntity entity =
                SubSystemEntity.builder().id(1L).mainSystemId(10L).code("OLD").build();

        when(subSystemMapper.selectById(1L)).thenReturn(entity);
        when(mainSystemMapper.selectById(20L)).thenReturn(new MainSystemEntity());
        when(subSystemMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L);

        subSystemService.updateSubSystem(1L, request);

        assertEquals(20L, entity.getMainSystemId());
    }

    @Test
    @DisplayName("Delete Sub System - Success")
    void deleteSubSystem_Success() {
        subSystemService.deleteSubSystem(1L);
        verify(subSystemMapper).deleteById(1L);
    }
}
