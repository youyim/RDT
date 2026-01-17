package com.rdt.auth.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.auth.i18n.UserMessages;
import com.rdt.auth.model.dto.CreateUserReq;
import com.rdt.auth.model.dto.UpdateUserReq;
import com.rdt.auth.model.dto.UserDto;
import com.rdt.auth.service.UserService;
import com.rdt.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 用户管理控制器
 */
@Tag(name = "User Management", description = "APIs for managing system users.")
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Validated
@Slf4j
public class UserController {

    private static final int CODE_USER_NOT_FOUND = 10_002;
    private static final int CODE_INTERNAL_ERROR = 500;

    private final UserService userService;

    @Operation(summary = "Get Users", description = "Get paginated list of users.")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Result<Page<UserDto>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {

        return Result.success(userService.getUsers(page, size, keyword));
    }

    @Operation(summary = "Get User", description = "Get user details by ID.")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public Result<UserDto> getUser(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        if (user == null) {
            return Result.error(CODE_USER_NOT_FOUND, UserMessages.USER_NOT_FOUND);
        }
        return Result.success(user);
    }

    @Operation(summary = "Create User", description = "Create a new user.")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Result<Void> createUser(@RequestBody @Valid CreateUserReq req) {
        userService.createUser(req);
        return Result.success();
    }

    @Operation(summary = "Update User", description = "Update user details.")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Result<Void> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserReq req) {
        userService.updateUser(id, req);
        return Result.success();
    }

    @Operation(summary = "Delete User", description = "Soft delete a user.")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        if (userService.softDeleteUser(id)) {
            return Result.success();
        } else {
            return Result.error(CODE_INTERNAL_ERROR, "Failed to delete user");
        }
    }

    @Operation(summary = "Reset Password", description = "Reset user password (Mock).")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reset-password")
    public Result<Void> resetPassword(@PathVariable Long id) {
        if (userService.mockResetPassword(id)) {
            return Result.success();
        } else {
            return Result.error(CODE_INTERNAL_ERROR, "Failed to reset password");
        }
    }
}
