package com.rdt.config.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.common.Result;
import com.rdt.config.model.dto.MainSystemCreateRequest;
import com.rdt.config.model.dto.MainSystemResponse;
import com.rdt.config.model.dto.MainSystemUpdateRequest;
import com.rdt.config.service.MainSystemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/main-systems")
@RequiredArgsConstructor
@Tag(name = "Main System Management")
@Validated
public class MainSystemController {

    private final MainSystemService mainSystemService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create Main System")
    public Result<Long> createMainSystem(@RequestBody @Valid MainSystemCreateRequest request) {
        return Result.success(mainSystemService.createMainSystem(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get Main System Details")
    public Result<MainSystemResponse> getMainSystem(@PathVariable Long id) {
        return Result.success(mainSystemService.getMainSystem(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get Main System List")
    public Result<Page<MainSystemResponse>> getMainSystemList(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.success(mainSystemService.getMainSystemList(keyword, page, size));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update Main System")
    public Result<Void> updateMainSystem(@PathVariable Long id, @RequestBody @Valid MainSystemUpdateRequest request) {
        mainSystemService.updateMainSystem(id, request);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete Main System")
    public Result<Void> deleteMainSystem(@PathVariable Long id) {
        mainSystemService.deleteMainSystem(id);
        return Result.success();
    }
}
