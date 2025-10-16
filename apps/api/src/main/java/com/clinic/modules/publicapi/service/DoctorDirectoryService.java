package com.clinic.modules.publicapi.service;

import com.clinic.modules.core.doctor.DoctorEntity;
import com.clinic.modules.core.doctor.DoctorRepository;
import com.clinic.modules.publicapi.dto.DoctorResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
public class DoctorDirectoryService {

    private final DoctorRepository doctorRepository;

    public DoctorDirectoryService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> listDoctors(String locale, String serviceSlug) {
        List<DoctorEntity> doctors = serviceSlug != null && !serviceSlug.isBlank()
                ? doctorRepository.findAllByServiceSlug(serviceSlug)
                : doctorRepository.findAll();

        Locale resolved = locale != null ? Locale.forLanguageTag(locale) : Locale.ENGLISH;

        return doctors.stream()
                .map(doctor -> new DoctorResponse(
                        doctor.getId(),
                        doctor.getFullName(),
                        doctor.getSpecialty(),
                        parseLanguages(doctor.getLocaleCodes(), resolved)
                ))
                .toList();
    }

    private List<String> parseLanguages(String localeCodes, Locale fallback) {
        if (localeCodes == null || localeCodes.isBlank()) {
            return List.of(fallback.getLanguage());
        }
        return Arrays.stream(localeCodes.split(","))
                .map(String::trim)
                .filter(code -> !code.isBlank())
                .toList();
    }
}
