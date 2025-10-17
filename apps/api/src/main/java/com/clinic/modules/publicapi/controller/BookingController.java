package com.clinic.modules.publicapi.controller;

import com.clinic.modules.publicapi.dto.BookingRequest;
import com.clinic.modules.publicapi.dto.BookingResponse;
import com.clinic.modules.publicapi.service.BookingService;
import com.clinic.security.JwtPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {

        Long authenticatedPatientId = null;
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof JwtPrincipal principal) {
            try {
                authenticatedPatientId = Long.parseLong(principal.subject());
            } catch (NumberFormatException ex) {
                // Invalid patient ID format, treat as guest
            }
        }

        return ResponseEntity.ok(bookingService.createBooking(request, authenticatedPatientId));
    }
}
