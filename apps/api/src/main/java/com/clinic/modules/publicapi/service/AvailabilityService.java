package com.clinic.modules.publicapi.service;

import com.clinic.modules.core.appointment.AppointmentRepository;
import com.clinic.modules.core.doctor.DoctorAvailabilityEntity;
import com.clinic.modules.core.doctor.DoctorAvailabilityRepository;
import com.clinic.modules.core.doctor.DoctorEntity;
import com.clinic.modules.core.doctor.DoctorRepository;
import com.clinic.modules.core.service.ClinicServiceEntity;
import com.clinic.modules.core.service.ClinicServiceRepository;
import com.clinic.modules.publicapi.dto.AvailabilityRequest;
import com.clinic.modules.publicapi.dto.AvailabilitySlotResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityService {

    private final DoctorRepository doctorRepository;
    private final ClinicServiceRepository serviceRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorAvailabilityRepository availabilityRepository;

    public AvailabilityService(DoctorRepository doctorRepository,
                               ClinicServiceRepository serviceRepository,
                               AppointmentRepository appointmentRepository,
                               DoctorAvailabilityRepository availabilityRepository) {
        this.doctorRepository = doctorRepository;
        this.serviceRepository = serviceRepository;
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
    }

    @Transactional(readOnly = true)
    public List<AvailabilitySlotResponse> computeAvailability(AvailabilityRequest request) {
        ClinicServiceEntity service = serviceRepository.findBySlug(request.serviceSlug())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        List<DoctorEntity> doctors;
        if (request.doctorId() != null) {
            DoctorEntity doctor = doctorRepository.findById(request.doctorId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));
            if (!doctor.getServices().contains(service)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor does not provide the requested service");
            }
            doctors = List.of(doctor);
        } else {
            doctors = doctorRepository.findAllByServiceSlug(service.getSlug());
        }

        LocalDate requestedDate = parseDateOrDefault(request.date());
        List<AvailabilitySlotResponse> slots = new ArrayList<>();

        for (DoctorEntity doctor : doctors) {
            slots.addAll(generateSlotsForDoctor(doctor, requestedDate));
        }

        return slots;
    }

    private List<AvailabilitySlotResponse> generateSlotsForDoctor(DoctorEntity doctor, LocalDate date) {
        List<DoctorAvailabilityEntity> specificAvailabilities = availabilityRepository.findByDoctorIdAndSpecificDate(doctor.getId(), date);
        List<DoctorAvailabilityEntity> weeklyAvailabilities = availabilityRepository.findByDoctorIdAndRecurringWeeklyTrueAndDayOfWeek(
                doctor.getId(),
                date.getDayOfWeek()
        );

        if (specificAvailabilities.isEmpty() && weeklyAvailabilities.isEmpty()) {
            return List.of();
        }

        List<AvailabilitySlotResponse> slots = new ArrayList<>();
        LocalDate today = LocalDate.now();
        Instant now = Instant.now();

        for (DoctorAvailabilityEntity availability : specificAvailabilities) {
            slots.addAll(generateSlotsFromAvailability(doctor, availability, availability.getSpecificDate(), today, now));
        }

        for (DoctorAvailabilityEntity availability : weeklyAvailabilities) {
            slots.addAll(generateSlotsFromAvailability(doctor, availability, date, today, now));
        }

        return slots;
    }

    private List<AvailabilitySlotResponse> generateSlotsFromAvailability(DoctorEntity doctor,
                                                                         DoctorAvailabilityEntity availability,
                                                                         LocalDate targetDate,
                                                                         LocalDate today,
                                                                         Instant nowInstant) {
        if (targetDate == null) {
            return List.of();
        }

        List<AvailabilitySlotResponse> slots = new ArrayList<>();
        LocalDateTime windowStart = LocalDateTime.of(targetDate, availability.getStartTime());
        LocalDateTime windowEnd = LocalDateTime.of(targetDate, availability.getEndTime());

        LocalDateTime pointer = windowStart;
        ZoneOffset offset = ZoneOffset.UTC;

        while (pointer.isBefore(windowEnd)) {
            LocalDateTime slotEnd = pointer.plusMinutes(30);
            if (slotEnd.isAfter(windowEnd.plusNanos(1))) {
                break;
            }

            Instant slotStartInstant = pointer.toInstant(offset);
            Instant slotEndInstant = slotEnd.toInstant(offset);

            if (targetDate.equals(today) && slotStartInstant.isBefore(nowInstant)) {
                pointer = pointer.plusMinutes(30);
                continue;
            }

            boolean conflict = appointmentRepository.existsActiveByDoctorAndScheduledBetween(
                    doctor.getId(),
                    slotStartInstant,
                    slotEndInstant
            );

            if (!conflict) {
                slots.add(new AvailabilitySlotResponse(
                        doctor.getId(),
                        doctor.getFullName(),
                        slotStartInstant.toString(),
                        slotEndInstant.toString()
                ));
            }

            pointer = pointer.plusMinutes(30);
        }

        return slots;
    }

    private LocalDate parseDateOrDefault(String raw) {
        if (raw == null || raw.isBlank()) {
            return LocalDate.now();
        }
        return LocalDate.parse(raw);
    }
}
