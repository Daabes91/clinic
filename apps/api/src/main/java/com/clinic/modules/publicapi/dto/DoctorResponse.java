package com.clinic.modules.publicapi.dto;

import java.util.List;

public record DoctorResponse(
        Long id,
        String name,
        String specialty,
        List<String> languages
) {
}
