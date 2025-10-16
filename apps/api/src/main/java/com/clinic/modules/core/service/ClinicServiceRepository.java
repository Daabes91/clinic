package com.clinic.modules.core.service;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClinicServiceRepository extends JpaRepository<ClinicServiceEntity, Long> {

    Optional<ClinicServiceEntity> findBySlug(String slug);
}
