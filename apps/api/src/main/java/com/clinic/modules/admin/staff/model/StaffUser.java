package com.clinic.modules.admin.staff.model;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "staff_users")
public class StaffUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(name = "full_name", length = 160)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private StaffRole role = StaffRole.RECEPTIONIST;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "two_factor_secret", length = 64)
    private String twoFactorSecret;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private StaffStatus status = StaffStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected StaffUser() {
    }

    public StaffUser(String email, String fullName, StaffRole role, String passwordHash, StaffStatus status) {
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.passwordHash = passwordHash;
        this.status = status;
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public StaffRole getRole() {
        return role;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getTwoFactorSecret() {
        return twoFactorSecret;
    }

    public StaffStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public boolean isTwoFactorEnabled() {
        return twoFactorSecret != null && !twoFactorSecret.isBlank();
    }

    public void setTwoFactorSecret(String twoFactorSecret) {
        this.twoFactorSecret = twoFactorSecret;
    }

    public void setStatus(StaffStatus status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StaffUser staffUser)) return false;
        return Objects.equals(id, staffUser.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
