package com.rdt.config.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.common.Result;
import com.rdt.config.model.dto.SubSystemCreateRequest;
import com.rdt.config.model.dto.SubSystemResponse;
import com.rdt.config.model.dto.SubSystemUpdateRequest;
import com.rdt.config.service.SubSystemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sub-systems")
@RequiredArgsConstructor
@Tag(name = "Sub System Management")
@Validated
public class SubSystemController {

    private final SubSystemService subSystemService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create Sub System")
    public Result<Long> createSubSystem(@RequestBody @Valid SubSystemCreateRequest request) {
        return Result.success(subSystemService.createSubSystem(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get Sub System Details")
    public Result<SubSystemResponse> getSubSystem(@PathVariable Long id) {
        return Result.success(subSystemService.getSubSystem(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get Sub System List")
    public Result<Page<SubSystemResponse>> getSubSystemList(
            @RequestParam(required = false) Long mainSystemId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.success(subSystemService.getSubSystemList(mainSystemId, keyword, page, size));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update Sub System")
    public Result<Void> updateSubSystem(@PathVariable Long id, @RequestBody @Valid SubSystemUpdateRequest request) {
        subSystemService.updateSubSystem(id, request);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete Sub System")
    public Result<Void> deleteSubSystem(@PathVariable Long id) {
        subSystemService.deleteSubSystem(id);
        return Result.success();
    }
}
