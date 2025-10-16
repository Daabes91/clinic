package com.clinic.modules.admin.dto;

import java.time.OffsetDateTime;

public record AppointmentResponse(
        Long id,
        String patientName,
        String doctorName,
        String serviceName,
        OffsetDateTime scheduledAt,
        String status
) {
}
