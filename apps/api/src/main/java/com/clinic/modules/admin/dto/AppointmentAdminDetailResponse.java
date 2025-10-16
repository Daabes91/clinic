package com.clinic.modules.admin.dto;

public record AppointmentAdminDetailResponse(
        Long id,
        Reference patient,
        Reference doctor,
        Reference service,
        String status,
        String scheduledAt,
        String createdAt,
        String notes
) {
    public record Reference(Long id, String name) {
    }
}
