package com.clinic.modules.admin.service;

import com.clinic.modules.admin.dto.AppointmentAdminDetailResponse;
import com.clinic.modules.admin.dto.AppointmentAdminUpsertRequest;
import com.clinic.modules.admin.dto.AppointmentResponse;
import com.clinic.modules.core.appointment.AppointmentEntity;
import com.clinic.modules.core.appointment.AppointmentMode;
import com.clinic.modules.core.appointment.AppointmentRepository;
import com.clinic.modules.core.appointment.AppointmentStatus;
import com.clinic.modules.core.doctor.DoctorEntity;
import com.clinic.modules.core.doctor.DoctorRepository;
import com.clinic.modules.core.patient.PatientEntity;
import com.clinic.modules.core.patient.PatientRepository;
import com.clinic.modules.core.service.ClinicServiceEntity;
import com.clinic.modules.core.service.ClinicServiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final ClinicServiceRepository serviceRepository;

    private static final long SLOT_DURATION_SECONDS = 30 * 60;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository,
                              ClinicServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional(readOnly = true)
    public Page<AppointmentResponse> fetchAppointments(String filter, Long doctorId, Long patientId, ZoneId zoneId, Pageable pageable) {
        List<AppointmentEntity> allAppointments;

        if ("upcoming".equalsIgnoreCase(filter)) {
            Instant now = Instant.now();
            allAppointments = appointmentRepository.findUpcomingAfter(now);
        } else {
            Instant start = Instant.now();
            Instant end = start.plusSeconds(7 * 24 * 60 * 60);
            allAppointments = appointmentRepository.findByScheduledBetween(start, end);
        }

        // Apply doctor filter if provided
        if (doctorId != null) {
            allAppointments = allAppointments.stream()
                    .filter(appointment -> appointment.getDoctor() != null && appointment.getDoctor().getId().equals(doctorId))
                    .toList();
        }

        // Apply patient filter if provided
        if (patientId != null) {
            allAppointments = allAppointments.stream()
                    .filter(appointment -> appointment.getPatient() != null && appointment.getPatient().getId().equals(patientId))
                    .toList();
        }

        // Convert to DTOs
        List<AppointmentResponse> allDtos = allAppointments.stream()
                .map(entity -> toDto(entity, zoneId))
                .toList();

        // Apply pagination manually
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), allDtos.size());

        List<AppointmentResponse> pageContent = start >= allDtos.size()
            ? List.of()
            : allDtos.subList(start, end);

        return new PageImpl<>(pageContent, pageable, allDtos.size());
    }

    private AppointmentResponse toDto(AppointmentEntity entity, ZoneId zoneId) {
        OffsetDateTime scheduledAt = OffsetDateTime.ofInstant(entity.getScheduledAt(), zoneId);
        String patientName = Optional.ofNullable(entity.getPatient())
                .map(patient -> patient.getFirstName() + " " + patient.getLastName())
                .orElse("Unknown patient");
        String doctorName = Optional.ofNullable(entity.getDoctor())
                .map(doctor -> doctor.getFullName())
                .orElse("Assigned soon");
        String serviceName = Optional.ofNullable(entity.getService())
                .map(service -> service.getNameEn())
                .orElse("General consultation");
        return new AppointmentResponse(
                entity.getId(),
                patientName,
                doctorName,
                serviceName,
                scheduledAt,
                entity.getStatus().name(),
                entity.getBookingMode().name()
        );
    }

    @Transactional(readOnly = true)
    public AppointmentAdminDetailResponse getAppointment(Long id) {
        AppointmentEntity appointment = getAppointmentOrThrow(id);
        return toDetailResponse(appointment);
    }

    @Transactional
    public AppointmentAdminDetailResponse createAppointment(AppointmentAdminUpsertRequest request) {
        PatientEntity patient = getPatient(request.patientId());
        DoctorEntity doctor = getDoctor(request.doctorId());
        ClinicServiceEntity service = getService(request.serviceId());
        ensureDoctorProvidesService(doctor, service);

        Instant scheduledAt = parseScheduledAt(request.scheduledAt());
        ensureSlotAvailable(doctor.getId(), scheduledAt, null);

        AppointmentMode bookingMode = parseBookingMode(request.bookingMode());

        AppointmentEntity appointment = new AppointmentEntity(
                patient,
                doctor,
                service,
                scheduledAt,
                AppointmentStatus.SCHEDULED,
                bookingMode,
                normalize(request.notes())
        );

        AppointmentEntity saved = appointmentRepository.save(appointment);
        return toDetailResponse(saved);
    }

    @Transactional
    public AppointmentAdminDetailResponse updateAppointment(Long id, AppointmentAdminUpsertRequest request) {
        AppointmentEntity appointment = getAppointmentOrThrow(id);

        PatientEntity patient = getPatient(request.patientId());
        DoctorEntity doctor = getDoctor(request.doctorId());
        ClinicServiceEntity service = getService(request.serviceId());
        ensureDoctorProvidesService(doctor, service);

        Instant scheduledAt = parseScheduledAt(request.scheduledAt());
        ensureSlotAvailable(doctor.getId(), scheduledAt, appointment.getId());

        AppointmentMode bookingMode = parseBookingMode(request.bookingMode());

        appointment.updateDetails(
                patient,
                doctor,
                service,
                scheduledAt,
                bookingMode,
                normalize(request.notes())
        );

        return toDetailResponse(appointment);
    }

    @Transactional
    public void deleteAppointment(Long id) {
        AppointmentEntity appointment = getAppointmentOrThrow(id);
        appointmentRepository.delete(appointment);
    }

    @Transactional
    public AppointmentAdminDetailResponse approveAppointment(Long id, String notes) {
        AppointmentEntity appointment = getAppointmentOrThrow(id);
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cancelled appointments cannot be approved");
        }
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Completed appointments cannot be modified");
        }
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        if (notes != null) {
            appointment.updateDetails(
                    appointment.getPatient(),
                    appointment.getDoctor(),
                    appointment.getService(),
                    appointment.getScheduledAt(),
                    appointment.getBookingMode(),
                    normalize(notes)
            );
        }
        return toDetailResponse(appointment);
    }

    @Transactional
    public AppointmentAdminDetailResponse declineAppointment(Long id, String notes) {
        AppointmentEntity appointment = getAppointmentOrThrow(id);
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Completed appointments cannot be cancelled");
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
        if (notes != null) {
            appointment.updateDetails(
                    appointment.getPatient(),
                    appointment.getDoctor(),
                    appointment.getService(),
                    appointment.getScheduledAt(),
                    appointment.getBookingMode(),
                    normalize(notes)
            );
        }
        return toDetailResponse(appointment);
    }

    private AppointmentEntity getAppointmentOrThrow(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
    }

    private PatientEntity getPatient(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
    }

    private DoctorEntity getDoctor(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));
    }

    private ClinicServiceEntity getService(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }

    private void ensureDoctorProvidesService(DoctorEntity doctor, ClinicServiceEntity service) {
        Set<ClinicServiceEntity> services = doctor.getServices();
        if (services == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor does not provide the selected service");
        }
        boolean provides = services.stream().anyMatch(s -> s.getId().equals(service.getId()));
        if (!provides) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor does not provide the selected service");
        }
    }

    private Instant parseScheduledAt(String input) {
        if (input == null || input.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Scheduled time is required");
        }
        try {
            return Instant.parse(input);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid scheduled time", ex);
        }
    }

    private void ensureSlotAvailable(Long doctorId, Instant scheduledAt, Long excludeAppointmentId) {
        Instant slotEnd = scheduledAt.plusSeconds(SLOT_DURATION_SECONDS);
        boolean conflict;
        if (excludeAppointmentId == null) {
            conflict = appointmentRepository.existsActiveByDoctorAndScheduledBetween(doctorId, scheduledAt, slotEnd);
        } else {
            conflict = appointmentRepository.existsActiveByDoctorAndScheduledBetweenExcluding(doctorId, scheduledAt, slotEnd, excludeAppointmentId);
        }
        if (conflict) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Doctor already has an appointment during this time");
        }
    }

    private AppointmentAdminDetailResponse toDetailResponse(AppointmentEntity entity) {
        AppointmentAdminDetailResponse.Reference patientRef = Optional.ofNullable(entity.getPatient())
                .map(patient -> new AppointmentAdminDetailResponse.Reference(
                        patient.getId(),
                        (patient.getFirstName() + " " + patient.getLastName()).trim()
                ))
                .orElse(null);

        AppointmentAdminDetailResponse.Reference doctorRef = Optional.ofNullable(entity.getDoctor())
                .map(doctor -> new AppointmentAdminDetailResponse.Reference(
                        doctor.getId(),
                        doctor.getFullName()
                ))
                .orElse(null);

        AppointmentAdminDetailResponse.Reference serviceRef = Optional.ofNullable(entity.getService())
                .map(service -> new AppointmentAdminDetailResponse.Reference(
                        service.getId(),
                        Optional.ofNullable(service.getNameEn()).orElse(service.getSlug())
                ))
                .orElse(null);

        String scheduled = Optional.ofNullable(entity.getScheduledAt())
                .map(Instant::toString)
                .orElse(null);
        String created = Optional.ofNullable(entity.getCreatedAt())
                .map(Instant::toString)
                .orElse(null);

        return new AppointmentAdminDetailResponse(
                entity.getId(),
                patientRef,
                doctorRef,
                serviceRef,
                entity.getStatus().name(),
                entity.getBookingMode().name(),
                scheduled,
                created,
                entity.getNotes()
        );
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private AppointmentMode parseBookingMode(String input) {
        try {
            return AppointmentMode.from(input);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }
}
