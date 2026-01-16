package com.rdt.auth.controller;

import com.rdt.auth.model.dto.LoginReq;
import com.rdt.auth.model.dto.LoginResp;
import com.rdt.auth.service.AuthService;
import com.rdt.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证控制器.
 */
@Tag(name = "Authentication", description = "APIs for user login, logout, and security.")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;

    /**
     * User login.
     *
     * @param req Login request
     * @return Login response
     */
    @Operation(summary = "Login", description = "Authenticate user and return JWT token.")
    @PreAuthorize("permitAll()")
    @PostMapping("/login")
    public Result<LoginResp> login(@RequestBody @Valid LoginReq req) {
        return Result.success(authService.login(req));
    }

    /**
     * User logout.
     *
     * @return Success result
     */
    @Operation(summary = "Logout", description = "Invalidate current token.")
    @PreAuthorize("permitAll()")
    @PostMapping("/logout")
    public Result<Void> logout() {
        // TODO: 完善登出逻辑 (如使 Token 进入黑名单)
        return Result.success();
    }
}
