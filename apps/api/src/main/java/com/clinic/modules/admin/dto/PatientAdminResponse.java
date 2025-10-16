package com.clinic.modules.admin.dto;

import java.time.Instant;

public record PatientAdminResponse(
        Long id,
        String externalId,
        String firstName,
        String lastName,
        String email,
        String phone,
        Instant createdAt
) {
}
