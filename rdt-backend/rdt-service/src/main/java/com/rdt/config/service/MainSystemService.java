package com.rdt.config.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.config.model.dto.MainSystemCreateRequest;
import com.rdt.config.model.dto.MainSystemResponse;
import com.rdt.config.model.dto.MainSystemUpdateRequest;

public interface MainSystemService {
    Long createMainSystem(MainSystemCreateRequest request);

    MainSystemResponse getMainSystem(Long id);

    Page<MainSystemResponse> getMainSystemList(String keyword, int page, int size);

    void updateMainSystem(Long id, MainSystemUpdateRequest request);
    // specific update dto

    void deleteMainSystem(Long id);
}
