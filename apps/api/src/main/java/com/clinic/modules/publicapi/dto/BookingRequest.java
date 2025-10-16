package com.clinic.modules.publicapi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record BookingRequest(
        @NotBlank String serviceSlug,
        Long doctorId,
        @NotBlank String slot,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
        @NotBlank String phone,
        String notes
) {
}
