package com.rdt.config.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rdt.config.model.dto.SubSystemCreateRequest;
import com.rdt.config.model.dto.SubSystemResponse;
import com.rdt.config.model.dto.SubSystemUpdateRequest;

public interface SubSystemService {
    Long createSubSystem(SubSystemCreateRequest request);

    SubSystemResponse getSubSystem(Long id);

    Page<SubSystemResponse> getSubSystemList(Long mainSystemId, String keyword, int page, int size);

    void updateSubSystem(Long id, SubSystemUpdateRequest request);

    void deleteSubSystem(Long id);
}
