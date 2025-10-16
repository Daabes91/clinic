package com.clinic.modules.core.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DoctorRepository extends JpaRepository<DoctorEntity, Long> {

    @Query("select distinct d from DoctorEntity d join d.services s where s.slug = :slug")
    List<DoctorEntity> findAllByServiceSlug(@Param("slug") String slug);
}
