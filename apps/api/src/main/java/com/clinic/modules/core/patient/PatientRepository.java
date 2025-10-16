package com.clinic.modules.core.patient;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<PatientEntity, Long> {

    Optional<PatientEntity> findByEmailIgnoreCase(String email);

    long countByCreatedAtAfter(Instant threshold);
}
