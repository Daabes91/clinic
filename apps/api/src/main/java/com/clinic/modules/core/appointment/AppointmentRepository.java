package com.clinic.modules.core.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {

    long countByScheduledAtBetween(Instant start, Instant end);

    long countByStatusAndScheduledAtBetween(AppointmentStatus status, Instant start, Instant end);

    @Query("""
            select case when count(a) > 0 then true else false end
            from AppointmentEntity a
            where a.doctor.id = :doctorId
              and a.status <> com.clinic.modules.core.appointment.AppointmentStatus.CANCELLED
              and a.scheduledAt >= :start
              and a.scheduledAt < :end
            """)
    boolean existsActiveByDoctorAndScheduledBetween(@Param("doctorId") Long doctorId,
                                                     @Param("start") Instant start,
                                                     @Param("end") Instant end);

    @Query("""
            select case when count(a) > 0 then true else false end
            from AppointmentEntity a
            where a.doctor.id = :doctorId
              and a.id <> :appointmentId
              and a.status <> com.clinic.modules.core.appointment.AppointmentStatus.CANCELLED
              and a.scheduledAt >= :start
              and a.scheduledAt < :end
            """)
    boolean existsActiveByDoctorAndScheduledBetweenExcluding(@Param("doctorId") Long doctorId,
                                                             @Param("start") Instant start,
                                                             @Param("end") Instant end,
                                                             @Param("appointmentId") Long appointmentId);

    boolean existsByPatientId(Long patientId);

    @Query("""
            select a from AppointmentEntity a
            where a.scheduledAt >= :after
            order by a.scheduledAt asc
            """)
    List<AppointmentEntity> findUpcomingAfter(@Param("after") Instant after);

    @Query("""
            select a from AppointmentEntity a
            where a.scheduledAt between :start and :end
            order by a.scheduledAt asc
            """)
    List<AppointmentEntity> findByScheduledBetween(@Param("start") Instant start, @Param("end") Instant end);

    @Query("""
            select coalesce(count(a), 0) from AppointmentEntity a
            where a.status = com.clinic.modules.core.appointment.AppointmentStatus.COMPLETED
              and a.scheduledAt between :start and :end
            """)
    long countCompletedBetween(@Param("start") Instant start, @Param("end") Instant end);
}
