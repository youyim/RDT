package com.rdt.config.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.common.exception.BusinessException;
import com.rdt.config.mapper.MainSystemMapper;
import com.rdt.config.mapper.SubSystemMapper;
import com.rdt.config.model.dto.SubSystemCreateRequest;
import com.rdt.config.model.dto.SubSystemResponse;
import com.rdt.config.model.dto.SubSystemUpdateRequest;
import com.rdt.config.model.entity.MainSystemEntity;
import com.rdt.config.model.entity.SubSystemEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubSystemServiceImpl implements SubSystemService {

    private static final int ERR_CODE_EXISTS = 10_002;
    private static final int ERR_MAIN_SYSTEM_NOT_FOUND = 10_003;
    private static final int ERR_SUB_SYSTEM_NOT_FOUND = 10_004;

    private final SubSystemMapper subSystemMapper;
    private final MainSystemMapper mainSystemMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createSubSystem(SubSystemCreateRequest request) {
        // Validate Main System
        MainSystemEntity mainSystem = mainSystemMapper.selectById(request.getMainSystemId());
        if (mainSystem == null) {
            throw new BusinessException(ERR_MAIN_SYSTEM_NOT_FOUND, "Main System not found");
        }

        // Validate Code Uniqueness
        if (checkCodeExists(request.getCode(), null)) {
            throw new BusinessException(ERR_CODE_EXISTS, "System code already exists");
        }

        SubSystemEntity entity = SubSystemEntity.builder()
                .mainSystemId(request.getMainSystemId())
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .gitUrl(request.getGitUrl())
                .owner(request.getOwner())
                .status(1)
                .build();

        subSystemMapper.insert(entity);
        return entity.getId();
    }

    @Override
    public SubSystemResponse getSubSystem(Long id) {
        SubSystemEntity entity = subSystemMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException(ERR_SUB_SYSTEM_NOT_FOUND, "Sub System not found");
        }
        return convertToResponse(entity);
    }

    @Override
    public Page<SubSystemResponse> getSubSystemList(Long mainSystemId, String keyword, int page, int size) {
        final Page<SubSystemEntity> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<SubSystemEntity> queryWrapper = new LambdaQueryWrapper<>();

        if (mainSystemId != null) {
            queryWrapper.eq(SubSystemEntity::getMainSystemId, mainSystemId);
        }

        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.and(
                    w -> w.like(SubSystemEntity::getName, keyword).or().like(SubSystemEntity::getCode, keyword));
        }

        queryWrapper.orderByDesc(SubSystemEntity::getCreatedAt);
        Page<SubSystemEntity> resultPage = subSystemMapper.selectPage(pageParam, queryWrapper);

        List<SubSystemResponse> records =
                resultPage.getRecords().stream().map(this::convertToResponse).toList();

        Page<SubSystemResponse> responsePage = new Page<>(page, size);
        responsePage.setRecords(records);
        responsePage.setTotal(resultPage.getTotal());

        return responsePage;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateSubSystem(Long id, SubSystemUpdateRequest request) {
        SubSystemEntity entity = subSystemMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException(ERR_SUB_SYSTEM_NOT_FOUND, "Sub System not found");
        }

        // Validate Main System if changed (though typically not allowed to change
        // parent freely, let's assume allowed)
        if (!entity.getMainSystemId().equals(request.getMainSystemId())) {
            MainSystemEntity mainSystem = mainSystemMapper.selectById(request.getMainSystemId());
            if (mainSystem == null) {
                throw new BusinessException(ERR_MAIN_SYSTEM_NOT_FOUND, "Main System not found");
            }
            entity.setMainSystemId(request.getMainSystemId());
        }

        if (checkCodeExists(request.getCode(), id)) {
            throw new BusinessException(ERR_CODE_EXISTS, "System code already exists");
        }

        entity.setName(request.getName());
        entity.setCode(request.getCode());
        entity.setDescription(request.getDescription());
        entity.setGitUrl(request.getGitUrl());
        entity.setOwner(request.getOwner());
        entity.setStatus(request.getStatus());

        subSystemMapper.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteSubSystem(Long id) {
        subSystemMapper.deleteById(id);
    }

    private boolean checkCodeExists(String code, Long excludeId) {
        LambdaQueryWrapper<SubSystemEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SubSystemEntity::getCode, code);
        if (excludeId != null) {
            queryWrapper.ne(SubSystemEntity::getId, excludeId);
        }
        return subSystemMapper.selectCount(queryWrapper) > 0;
    }

    private SubSystemResponse convertToResponse(SubSystemEntity entity) {
        // Optimally we should batch fetch main system names, but for simple list/get
        // it's okay to fetch individual or assume caller has context.
        // For now, let's fetch main system request to populate name.
        MainSystemEntity mainSystem = mainSystemMapper.selectById(entity.getMainSystemId());

        return SubSystemResponse.builder()
                .id(entity.getId())
                .mainSystemId(entity.getMainSystemId())
                .mainSystemName(mainSystem != null ? mainSystem.getName() : "Unknown")
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .gitUrl(entity.getGitUrl())
                .owner(entity.getOwner())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
