package com.rdt.config.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.common.exception.BusinessException;
import com.rdt.config.mapper.MainSystemMapper;
import com.rdt.config.mapper.SubSystemMapper;
import com.rdt.config.model.dto.MainSystemCreateRequest;
import com.rdt.config.model.dto.MainSystemResponse;
import com.rdt.config.model.dto.MainSystemUpdateRequest;
import com.rdt.config.model.entity.MainSystemEntity;
import com.rdt.config.model.entity.SubSystemEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MainSystemServiceImpl implements MainSystemService {
    private static final int ERR_CODE_EXISTS = 10_002;
    private static final int ERR_SYSTEM_NOT_FOUND = 10_003;

    private final MainSystemMapper mainSystemMapper;
    private final SubSystemMapper subSystemMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createMainSystem(MainSystemCreateRequest request) {
        if (checkCodeExists(request.getCode(), null)) {
            throw new BusinessException(ERR_CODE_EXISTS, "System code already exists");
        }

        MainSystemEntity entity = MainSystemEntity.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .owner(request.getOwner())
                .status(1)
                .build();

        mainSystemMapper.insert(entity);
        return entity.getId();
    }

    @Override
    public MainSystemResponse getMainSystem(Long id) {
        MainSystemEntity entity = mainSystemMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException(ERR_SYSTEM_NOT_FOUND, "Main System not found");
        }
        return convertToResponse(entity);
    }

    @Override
    public Page<MainSystemResponse> getMainSystemList(String keyword, int page, int size) {
        Page<MainSystemEntity> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<MainSystemEntity> queryWrapper = new LambdaQueryWrapper<>();

        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.and(
                    w -> w.like(MainSystemEntity::getName, keyword).or().like(MainSystemEntity::getCode, keyword));
        }

        queryWrapper.orderByDesc(MainSystemEntity::getCreatedAt);

        Page<MainSystemEntity> resultPage = mainSystemMapper.selectPage(pageParam, queryWrapper);
        List<MainSystemResponse> records =
                resultPage.getRecords().stream().map(this::convertToResponse).toList();

        Page<MainSystemResponse> responsePage = new Page<>(page, size);
        responsePage.setRecords(records);
        responsePage.setTotal(resultPage.getTotal());

        return responsePage;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateMainSystem(Long id, MainSystemUpdateRequest request) {
        MainSystemEntity entity = mainSystemMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException(ERR_SYSTEM_NOT_FOUND, "Main System not found");
        }

        if (checkCodeExists(request.getCode(), id)) {
            throw new BusinessException(ERR_CODE_EXISTS, "System code already exists");
        }

        entity.setName(request.getName());
        entity.setCode(request.getCode());
        entity.setDescription(request.getDescription());
        entity.setOwner(request.getOwner());
        entity.setStatus(request.getStatus());

        mainSystemMapper.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteMainSystem(Long id) {
        LambdaQueryWrapper<SubSystemEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SubSystemEntity::getMainSystemId, id);
        if (subSystemMapper.selectCount(queryWrapper) > 0) {
            throw new BusinessException(ERR_CODE_EXISTS, "Cannot delete Main System with existing Sub Systems");
        }

        mainSystemMapper.deleteById(id);
    }

    private boolean checkCodeExists(String code, Long excludeId) {
        LambdaQueryWrapper<MainSystemEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(MainSystemEntity::getCode, code);
        if (excludeId != null) {
            queryWrapper.ne(MainSystemEntity::getId, excludeId);
        }
        return mainSystemMapper.selectCount(queryWrapper) > 0;
    }

    private MainSystemResponse convertToResponse(MainSystemEntity entity) {
        return MainSystemResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .owner(entity.getOwner())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
