package com.clinic.modules.core.doctor;

import com.clinic.modules.core.service.ClinicServiceEntity;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "doctors")
public class DoctorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 160)
    private String fullName;

    @Column(length = 120)
    private String specialty;

    @Column
    private String bio;

    /**
     * Comma separated ISO language codes (e.g. "en,ar").
     */
    @Column(name = "locale", length = 32)
    private String localeCodes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @ManyToMany
    @JoinTable(
            name = "doctor_services",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<ClinicServiceEntity> services = new HashSet<>();

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DoctorAvailabilityEntity> availabilities = new HashSet<>();

    protected DoctorEntity() {
    }

    public DoctorEntity(String fullName, String specialty, String bio, String localeCodes) {
        this.fullName = fullName;
        this.specialty = specialty;
        this.bio = bio;
        this.localeCodes = localeCodes;
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getSpecialty() {
        return specialty;
    }

    public String getBio() {
        return bio;
    }

    public String getLocaleCodes() {
        return localeCodes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Set<ClinicServiceEntity> getServices() {
        return services;
    }

    public Set<DoctorAvailabilityEntity> getAvailabilities() {
        return availabilities;
    }

    public void updateDetails(String fullName, String specialty, String bio, String localeCodes) {
        this.fullName = fullName;
        this.specialty = specialty;
        this.bio = bio;
        this.localeCodes = localeCodes;
    }

    public void assignServices(Set<ClinicServiceEntity> services) {
        this.services.clear();
        if (services != null) {
            this.services.addAll(services);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DoctorEntity doctor)) return false;
        return Objects.equals(id, doctor.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
