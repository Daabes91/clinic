package com.clinic.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record DoctorUpsertRequest(
        @NotBlank @Size(max = 160) String fullName,
        @Size(max = 120) String specialty,
        String bio,
        List<@Size(max = 10) String> locales,
        List<Long> serviceIds
) {
}
