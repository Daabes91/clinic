package com.clinic.modules.core.appointment;

import com.clinic.modules.core.doctor.DoctorEntity;
import com.clinic.modules.core.patient.PatientEntity;
import com.clinic.modules.core.service.ClinicServiceEntity;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "appointments")
public class AppointmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

    @ManyToOne(optional = false)
    @JoinColumn(name = "doctor_id")
    private DoctorEntity doctor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "service_id")
    private ClinicServiceEntity service;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AppointmentStatus status;

    @Column
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected AppointmentEntity() {
    }

    public AppointmentEntity(PatientEntity patient,
                             DoctorEntity doctor,
                             ClinicServiceEntity service,
                             Instant scheduledAt,
                             AppointmentStatus status,
                             String notes) {
        this.patient = patient;
        this.doctor = doctor;
        this.service = service;
        this.scheduledAt = scheduledAt;
        this.status = status;
        this.notes = notes;
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public PatientEntity getPatient() {
        return patient;
    }

    public DoctorEntity getDoctor() {
        return doctor;
    }

    public ClinicServiceEntity getService() {
        return service;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void updateDetails(PatientEntity patient,
                              DoctorEntity doctor,
                              ClinicServiceEntity service,
                              Instant scheduledAt,
                              String notes) {
        this.patient = patient;
        this.doctor = doctor;
        this.service = service;
        this.scheduledAt = scheduledAt;
        this.notes = notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AppointmentEntity that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
