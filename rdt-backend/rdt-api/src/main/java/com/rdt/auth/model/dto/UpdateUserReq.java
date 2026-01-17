package com.rdt.auth.model.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserReq {
    @Email(message = "Email format is incorrect")
    private String email;

    private String avatar;
}
