package com.clinic.modules.admin.staff.repository;

import com.clinic.modules.admin.staff.model.StaffUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffUserRepository extends JpaRepository<StaffUser, Long> {
    Optional<StaffUser> findByEmailIgnoreCase(String email);
}
