package com.clinic.modules.admin.controller;

import com.clinic.api.ApiResponse;
import com.clinic.api.ApiResponseFactory;
import com.clinic.modules.admin.dto.AppointmentAdminDetailResponse;
import com.clinic.modules.admin.dto.AppointmentAdminUpsertRequest;
import com.clinic.modules.admin.dto.AppointmentDecisionRequest;
import com.clinic.modules.admin.dto.AppointmentResponse;
import com.clinic.modules.admin.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/appointments")
public class AppointmentAdminController {

    private final AppointmentService appointmentService;

    public AppointmentAdminController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> listAppointments(
            @RequestParam(name = "filter", required = false) String filter) {
        List<AppointmentResponse> appointments = appointmentService.fetchAppointments(filter, ZoneId.systemDefault());
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "APPOINTMENTS_LISTED",
                        "Appointments fetched successfully.",
                        appointments,
                        Map.of("count", appointments.size(), "filter", filter == null ? "default" : filter),
                        null
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentAdminDetailResponse>> getAppointment(@PathVariable Long id) {
        AppointmentAdminDetailResponse response = appointmentService.getAppointment(id);
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "APPOINTMENT_RETRIEVED",
                        "Appointment fetched successfully.",
                        response
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentAdminDetailResponse>> createAppointment(
            @Valid @RequestBody AppointmentAdminUpsertRequest request) {
        AppointmentAdminDetailResponse response = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponseFactory.success(
                        "APPOINTMENT_CREATED",
                        "Appointment created successfully.",
                        response,
                        Map.of("status", response.status()),
                        Map.of("self", "/api/admin/appointments/" + response.id())
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentAdminDetailResponse>> updateAppointment(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentAdminUpsertRequest request) {
        AppointmentAdminDetailResponse response = appointmentService.updateAppointment(id, request);
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "APPOINTMENT_UPDATED",
                        "Appointment updated successfully.",
                        response
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "APPOINTMENT_DELETED",
                        "Appointment deleted successfully."
                )
        );
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<AppointmentAdminDetailResponse>> approveAppointment(
            @PathVariable Long id,
            @RequestBody(required = false) AppointmentDecisionRequest request) {
        AppointmentAdminDetailResponse response = appointmentService.approveAppointment(id, request != null ? request.notes() : null);
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "APPOINTMENT_APPROVED",
                        "Appointment approved.",
                        response
                )
        );
    }

    @PostMapping("/{id}/decline")
    public ResponseEntity<ApiResponse<AppointmentAdminDetailResponse>> declineAppointment(
            @PathVariable Long id,
            @RequestBody(required = false) AppointmentDecisionRequest request) {
        AppointmentAdminDetailResponse response = appointmentService.declineAppointment(id, request != null ? request.notes() : null);
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "APPOINTMENT_DECLINED",
                        "Appointment declined.",
                        response
                )
        );
    }
}
