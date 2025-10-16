package com.clinic.modules.admin.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record StaffLoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password,
        String twoFactorCode
) {
}
