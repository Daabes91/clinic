package com.clinic.modules.admin.service;

import com.clinic.modules.admin.dto.DashboardSummaryResponse;
import com.clinic.modules.core.appointment.AppointmentRepository;
import com.clinic.modules.core.appointment.AppointmentStatus;
import com.clinic.modules.core.patient.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;

@Service
public class DashboardService {

    private static final double AVERAGE_REVENUE_PER_APPOINTMENT = 450.0;

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public DashboardService(AppointmentRepository appointmentRepository,
                            PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(ZoneId zoneId) {
        LocalDate today = LocalDate.now(zoneId);
        Instant startOfToday = today.atStartOfDay(zoneId).toInstant();
        Instant endOfToday = today.plusDays(1).atStartOfDay(zoneId).toInstant();

        long appointmentsToday = appointmentRepository.countByScheduledAtBetween(startOfToday, endOfToday);
        long pendingConfirmations = appointmentRepository.countByStatusAndScheduledAtBetween(
                AppointmentStatus.SCHEDULED, startOfToday, endOfToday);

        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        Instant startOfMonth = firstDayOfMonth.atStartOfDay(zoneId).toInstant();
        long completedThisMonth = appointmentRepository.countCompletedBetween(startOfMonth, endOfToday);
        double revenueEstimate = completedThisMonth * AVERAGE_REVENUE_PER_APPOINTMENT;

        Instant sevenDaysAgo = today.minusDays(7).atStartOfDay(zoneId).toInstant();
        long newPatients = patientRepository.countByCreatedAtAfter(sevenDaysAgo);

        return new DashboardSummaryResponse(
                appointmentsToday,
                pendingConfirmations,
                revenueEstimate,
                newPatients
        );
    }
}
