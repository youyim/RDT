package com.rdt.config.model.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Sub System Update Request DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubSystemUpdateRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long mainSystemId;
    private String name;
    private String code;
    private String description;
    private String gitUrl;
    private String owner;
    private Integer status;
}
