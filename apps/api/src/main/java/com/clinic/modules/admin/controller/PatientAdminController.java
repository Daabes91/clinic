package com.clinic.modules.admin.controller;

import com.clinic.api.ApiResponse;
import com.clinic.api.ApiResponseFactory;
import com.clinic.modules.admin.dto.PatientAdminResponse;
import com.clinic.modules.admin.dto.PatientUpsertRequest;
import com.clinic.modules.admin.service.PatientAdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/patients")
public class PatientAdminController {

    private final PatientAdminService patientAdminService;

    public PatientAdminController(PatientAdminService patientAdminService) {
        this.patientAdminService = patientAdminService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientAdminResponse>>> listPatients() {
        List<PatientAdminResponse> patients = patientAdminService.listPatients();
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "PATIENTS_LISTED",
                        "Patients fetched successfully.",
                        patients,
                        Map.of("count", patients.size()),
                        null
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientAdminResponse>> getPatient(@PathVariable Long id) {
        PatientAdminResponse response = patientAdminService.getPatient(id);
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "PATIENT_RETRIEVED",
                        "Patient fetched successfully.",
                        response
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PatientAdminResponse>> createPatient(@Valid @RequestBody PatientUpsertRequest request) {
        PatientAdminResponse response = patientAdminService.createPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponseFactory.success(
                        "PATIENT_CREATED",
                        "Patient created successfully.",
                        response
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientAdminResponse>> updatePatient(@PathVariable Long id,
                                                                           @Valid @RequestBody PatientUpsertRequest request) {
        PatientAdminResponse response = patientAdminService.updatePatient(id, request);
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "PATIENT_UPDATED",
                        "Patient updated successfully.",
                        response
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id) {
        patientAdminService.deletePatient(id);
        return ResponseEntity.ok(
                ApiResponseFactory.success(
                        "PATIENT_DELETED",
                        "Patient deleted successfully."
                )
        );
    }
}
