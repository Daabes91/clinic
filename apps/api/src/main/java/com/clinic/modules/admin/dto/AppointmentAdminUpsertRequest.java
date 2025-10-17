package com.clinic.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AppointmentAdminUpsertRequest(
        @NotNull Long patientId,
        @NotNull Long doctorId,
        @NotNull Long serviceId,
        @NotBlank String scheduledAt,
        @NotBlank String bookingMode,
        String notes
) {
}
