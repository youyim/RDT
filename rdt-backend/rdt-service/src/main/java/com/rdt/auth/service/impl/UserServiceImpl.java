package com.rdt.auth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.auth.i18n.UserMessages;
import com.rdt.auth.mapper.UserMapper;
import com.rdt.auth.model.dto.CreateUserReq;
import com.rdt.auth.model.dto.UpdateUserReq;
import com.rdt.auth.model.dto.UserDto;
import com.rdt.auth.model.entity.SysUser;
import com.rdt.auth.service.UserService;
import com.rdt.common.exception.BusinessException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createUser(CreateUserReq req) {
        // Check if username exists
        if (userMapper.selectCount(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, req.getUsername())) > 0) {
            throw BusinessException.badRequest(UserMessages.USERNAME_ALREADY_EXISTS);
        }

        SysUser user = new SysUser();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        // Encrypt password
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setStatus(1); // Default active
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        if (userMapper.insert(user) <= 0) {
            throw BusinessException.serverError(UserMessages.CREATE_FAILED);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUser(Long id, UpdateUserReq req) {
        SysUser existingUser = userMapper.selectById(id);
        if (existingUser == null) {
            throw BusinessException.notFound(UserMessages.USER_NOT_FOUND);
        }

        // Update fields
        if (req.getEmail() != null) {
            existingUser.setEmail(req.getEmail());
        }
        if (req.getAvatar() != null) {
            existingUser.setAvatar(req.getAvatar());
        }
        existingUser.setUpdatedAt(LocalDateTime.now());

        if (userMapper.updateById(existingUser) <= 0) {
            throw BusinessException.serverError(UserMessages.UPDATE_FAILED);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean softDeleteUser(Long id) {
        SysUser existingUser = userMapper.selectById(id);
        if (existingUser == null) {
            throw BusinessException.notFound(UserMessages.USER_NOT_FOUND);
        }
        // Assuming MyBatis Plus handles soft delete via @TableLogic if configured or we
        // rely on deleteById
        // which will update the deleted_at field.
        return userMapper.deleteById(id) > 0;
    }

    @Override
    public boolean mockResetPassword(Long id) {
        SysUser user = userMapper.selectById(id);
        if (user == null) {
            throw BusinessException.notFound(UserMessages.USER_NOT_FOUND);
        }
        log.info("Mock reset password email sent to {}", user.getEmail());
        return true;
    }

    @Override
    public UserDto getUserById(Long id) {
        SysUser user = userMapper.selectById(id);
        if (user == null) {
            return null;
        }
        UserDto dto = new UserDto();
        BeanUtils.copyProperties(user, dto);
        return dto;
    }

    @Override
    public Page<UserDto> getUsers(int page, int size, String keyword) {
        Page<SysUser> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(SysUser::getUsername, keyword).or().like(SysUser::getEmail, keyword);
        }
        wrapper.orderByDesc(SysUser::getCreatedAt);
        Page<SysUser> userPage = userMapper.selectPage(pageParam, wrapper);

        Page<UserDto> resultPage = new Page<>(userPage.getCurrent(), userPage.getSize(), userPage.getTotal());
        List<UserDto> dtoList = userPage.getRecords().stream()
                .map(user -> {
                    UserDto dto = new UserDto();
                    if (user != null) {
                        BeanUtils.copyProperties(user, dto);
                    }
                    return dto;
                })
                .toList();
        resultPage.setRecords(dtoList);
        return resultPage;
    }
}
