package com.rdt.config.model.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Sub System Response DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubSystemResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long mainSystemId;
    private String mainSystemName;
    private String name;
    private String code;
    private String description;
    private String gitUrl;
    private String owner;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
