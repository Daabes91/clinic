package com.clinic.modules.admin.auth.controller;

import com.clinic.modules.admin.auth.dto.AuthTokensResponse;
import com.clinic.modules.admin.auth.dto.LogoutRequest;
import com.clinic.modules.admin.auth.dto.RefreshTokenRequest;
import com.clinic.modules.admin.auth.dto.StaffLoginRequest;
import com.clinic.modules.admin.auth.dto.StaffProfileResponse;
import com.clinic.modules.admin.staff.model.StaffUser;
import com.clinic.modules.admin.auth.service.StaffAuthService;
import com.clinic.modules.admin.staff.repository.StaffUserRepository;
import com.clinic.security.JwtPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final StaffAuthService staffAuthService;
    private final StaffUserRepository staffUserRepository;

    public AdminAuthController(StaffAuthService staffAuthService,
                               StaffUserRepository staffUserRepository) {
        this.staffAuthService = staffAuthService;
        this.staffUserRepository = staffUserRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthTokensResponse> login(@Valid @RequestBody StaffLoginRequest request) {
        return ResponseEntity.ok(staffAuthService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthTokensResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(staffAuthService.refresh(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request) {
        staffAuthService.logout(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<StaffProfileResponse> profile(Authentication authentication) {
        var principal = (JwtPrincipal) authentication.getPrincipal();
        StaffUser staffUser = staffUserRepository.findById(Long.valueOf(principal.subject()))
                .orElseThrow(() -> new IllegalStateException("Staff user not found"));

        return ResponseEntity.ok(new StaffProfileResponse(
                staffUser.getId(),
                staffUser.getEmail(),
                staffUser.getFullName(),
                staffUser.getRole().name()
        ));
    }
}
