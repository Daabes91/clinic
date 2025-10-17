package com.clinic.modules.publicapi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record BookingRequest(
        @NotBlank String serviceSlug,
        Long doctorId,
        @NotBlank String slot,
        String firstName,
        String lastName,
        @Email String email,
        @Pattern(regexp = "^\\+[1-9]\\d{7,14}$", message = "Phone number must include country code (e.g. +15551234567)") String phone,
        @NotBlank String bookingMode,
        String notes
) {
}
