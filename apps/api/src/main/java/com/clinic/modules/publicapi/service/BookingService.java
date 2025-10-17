package com.clinic.modules.publicapi.service;

import com.clinic.modules.core.appointment.AppointmentEntity;
import com.clinic.modules.core.appointment.AppointmentMode;
import com.clinic.modules.core.appointment.AppointmentRepository;
import com.clinic.modules.core.appointment.AppointmentStatus;
import com.clinic.modules.core.doctor.DoctorAvailabilityEntity;
import com.clinic.modules.core.doctor.DoctorAvailabilityRepository;
import com.clinic.modules.core.doctor.DoctorEntity;
import com.clinic.modules.core.doctor.DoctorRepository;
import com.clinic.modules.core.patient.PatientContactUtils;
import com.clinic.modules.core.patient.PatientEntity;
import com.clinic.modules.core.patient.PatientRepository;
import com.clinic.modules.core.service.ClinicServiceEntity;
import com.clinic.modules.core.service.ClinicServiceRepository;
import com.clinic.modules.publicapi.dto.BookingRequest;
import com.clinic.modules.publicapi.dto.BookingResponse;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.util.List;
import java.util.Locale;

@Service
public class BookingService {

    private final ClinicServiceRepository serviceRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private static final long SLOT_DURATION_SECONDS = 30 * 60;

    public BookingService(ClinicServiceRepository serviceRepository,
                          DoctorRepository doctorRepository,
                          PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository,
                          DoctorAvailabilityRepository availabilityRepository) {
        this.serviceRepository = serviceRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long authenticatedPatientId) {
        ClinicServiceEntity service = serviceRepository.findBySlug(request.serviceSlug())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        DoctorEntity doctor = resolveDoctor(request, service);

        Instant slotStart;
        try {
            slotStart = Instant.parse(request.slot());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid slot timestamp", ex);
        }
        validateSlotAlignment(slotStart);
        Instant slotEnd = slotStart.plusSeconds(SLOT_DURATION_SECONDS);

        ensureSlotWithinAvailability(doctor, slotStart, slotEnd);

        boolean slotTaken = appointmentRepository.existsActiveByDoctorAndScheduledBetween(doctor.getId(), slotStart, slotEnd);
        if (slotTaken) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Selected slot is no longer available");
        }

        PatientEntity patient = resolvePatient(request, authenticatedPatientId);

        AppointmentMode bookingMode = parseBookingMode(request.bookingMode());

        AppointmentEntity appointment = new AppointmentEntity(
                patient,
                doctor,
                service,
                slotStart,
                AppointmentStatus.SCHEDULED,
                bookingMode,
                request.notes()
        );
        AppointmentEntity saved = appointmentRepository.save(appointment);

        return new BookingResponse(saved.getId().toString(), saved.getScheduledAt().toString());
    }

    private PatientEntity resolvePatient(BookingRequest request, Long authenticatedPatientId) {
        // If user is authenticated, use their patient record
        if (authenticatedPatientId != null) {
            return patientRepository.findById(authenticatedPatientId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Authenticated patient not found"));
        }

        // Guest booking - require patient details in request
        if (request.firstName() == null || request.firstName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "firstName is required for guest bookings");
        }
        if (request.lastName() == null || request.lastName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "lastName is required for guest bookings");
        }
        if (request.email() == null || request.email().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is required for guest bookings");
        }
        if (request.phone() == null || request.phone().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "phone is required for guest bookings");
        }

        String email = normalizeEmailOrThrow(request.email());
        String phone = normalizePhoneOrThrow(request.phone());
        String firstName = capitalize(request.firstName());
        String lastName = capitalize(request.lastName());

        PatientEntity patient = patientRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> patientRepository.save(new PatientEntity(
                        firstName,
                        lastName,
                        email,
                        phone
                )));

        // Update patient details if they've changed
        if (patient.getPhone() == null || !patient.getPhone().equals(phone)
                || !patient.getFirstName().equals(firstName) || !patient.getLastName().equals(lastName)) {
            patient.updateDetails(firstName, lastName, email, phone);
            patientRepository.save(patient);
        }

        return patient;
    }

    private DoctorEntity resolveDoctor(BookingRequest request, ClinicServiceEntity service) {
        if (request.doctorId() == null) {
            return doctorRepository.findAllByServiceSlug(service.getSlug()).stream()
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No doctor available for service"));
        }

        DoctorEntity doctor = doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));

        if (!doctor.getServices().contains(service)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor does not provide the requested service");
        }

        return doctor;
    }

    private void ensureSlotWithinAvailability(DoctorEntity doctor, Instant slotStart, Instant slotEnd) {
        LocalDateTime slotStartDateTime = LocalDateTime.ofInstant(slotStart, ZoneOffset.UTC);
        LocalDate slotDate = slotStartDateTime.toLocalDate();
        LocalTime slotStartTime = slotStartDateTime.toLocalTime();
        LocalTime slotEndTime = LocalDateTime.ofInstant(slotEnd, ZoneOffset.UTC).toLocalTime();

        List<DoctorAvailabilityEntity> oneTime = availabilityRepository.findByDoctorIdAndSpecificDate(doctor.getId(), slotDate);
        List<DoctorAvailabilityEntity> weekly = availabilityRepository.findByDoctorIdAndRecurringWeeklyTrueAndDayOfWeek(
                doctor.getId(),
                slotDate.getDayOfWeek()
        );

        boolean matches = oneTime.stream().anyMatch(a -> coversSlot(a, slotStartTime, slotEndTime))
                || weekly.stream().anyMatch(a -> coversSlot(a, slotStartTime, slotEndTime));

        if (!matches) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor is not available for the selected slot");
        }
    }

    private boolean coversSlot(DoctorAvailabilityEntity availability, LocalTime slotStartTime, LocalTime slotEndTime) {
        return !availability.getStartTime().isAfter(slotStartTime) && !availability.getEndTime().isBefore(slotEndTime);
    }

    private void validateSlotAlignment(Instant slotStart) {
        LocalDateTime dateTime = LocalDateTime.ofInstant(slotStart, ZoneOffset.UTC);
        if (dateTime.getMinute() % 30 != 0 || dateTime.getSecond() != 0 || dateTime.getNano() != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slots must start on the hour or half-hour");
        }
    }

    private String capitalize(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }
        String trimmed = value.trim().toLowerCase(Locale.ROOT);
        return Character.toUpperCase(trimmed.charAt(0)) + trimmed.substring(1);
    }

    private String normalizeEmailOrThrow(String email) {
        try {
            return PatientContactUtils.normalizeEmail(email);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    private String normalizePhoneOrThrow(String phone) {
        try {
            return PatientContactUtils.normalizePhone(phone);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    private AppointmentMode parseBookingMode(String mode) {
        try {
            return AppointmentMode.from(mode);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }
}
