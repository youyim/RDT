package com.rdt.auth.model.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String avatar;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginTime;
}
