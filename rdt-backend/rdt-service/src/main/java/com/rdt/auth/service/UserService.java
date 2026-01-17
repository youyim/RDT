package com.rdt.auth.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.auth.model.dto.CreateUserReq;
import com.rdt.auth.model.dto.UpdateUserReq;
import com.rdt.auth.model.dto.UserDto;

public interface UserService {

    /**
     * Create a new user
     *
     * @param req create user request
     */
    void createUser(CreateUserReq req);

    /**
     * Update user info
     *
     * @param id  user id
     * @param req update user request
     */
    void updateUser(Long id, UpdateUserReq req);

    /**
     * Soft delete user (archive)
     *
     * @param id user id
     * @return true if success
     */
    boolean softDeleteUser(Long id);

    /**
     * Mock reset password
     *
     * @param id user id
     * @return true if success
     */
    boolean mockResetPassword(Long id);

    /**
     * Get user by ID
     *
     * @param id user id
     * @return user dto
     */
    UserDto getUserById(Long id);

    /**
     * Page query users
     *
     * @param page    current page
     * @param size    page size
     * @param keyword search keyword
     * @return page result
     */
    Page<UserDto> getUsers(int page, int size, String keyword);
}
