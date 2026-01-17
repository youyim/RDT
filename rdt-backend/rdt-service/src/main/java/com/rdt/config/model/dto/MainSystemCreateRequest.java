package com.rdt.config.model.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Main System Create Request DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MainSystemCreateRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private String code;
    private String description;
    private String owner;
    private Integer status;
}
