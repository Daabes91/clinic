package com.clinic.modules.admin.dto;

import java.time.Instant;
import java.util.List;

public record DoctorAdminResponse(
        Long id,
        String fullName,
        String specialty,
        String bio,
        List<String> locales,
        List<ServiceReference> services,
        Instant createdAt
) {
    public record ServiceReference(Long id, String slug, String nameEn) {
    }
}
