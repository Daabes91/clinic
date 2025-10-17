package com.clinic.config;

import com.clinic.security.AdminIpFilter;
import com.clinic.security.PatientJwtAuthenticationFilter;
import com.clinic.security.RateLimitingFilter;
import com.clinic.security.StaffJwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final StaffJwtAuthenticationFilter staffJwtAuthenticationFilter;
    private final PatientJwtAuthenticationFilter patientJwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;
    private final RateLimitingFilter rateLimitingFilter;
    private final AdminIpFilter adminIpFilter;

    public SecurityConfig(
            StaffJwtAuthenticationFilter staffJwtAuthenticationFilter,
            PatientJwtAuthenticationFilter patientJwtAuthenticationFilter,
            CorsConfigurationSource corsConfigurationSource,
            RateLimitingFilter rateLimitingFilter,
            AdminIpFilter adminIpFilter
    ) {
        this.staffJwtAuthenticationFilter = staffJwtAuthenticationFilter;
        this.patientJwtAuthenticationFilter = patientJwtAuthenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
        this.rateLimitingFilter = rateLimitingFilter;
        this.adminIpFilter = adminIpFilter;
    }

    @Bean
    @Order(1)
    public SecurityFilterChain adminApiSecurity(HttpSecurity http) throws Exception {
        http.securityMatcher("/api/admin/**")
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'"))
                        .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER))
                        .xssProtection(Customizer.withDefaults())
                        .frameOptions(frame -> frame.deny())
                        .permissionsPolicy(policy -> policy.policy("camera=(), microphone=(), geolocation=()")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/admin/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/admin/auth/logout").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/admin/auth/refresh").permitAll()
                        .anyRequest().hasAnyRole("ADMIN", "RECEPTIONIST", "DOCTOR"))
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(adminIpFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(staffJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain publicApiSecurity(HttpSecurity http) throws Exception {
        http.securityMatcher("/api/public/**")
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'"))
                        .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER))
                        .xssProtection(Customizer.withDefaults())
                        .frameOptions(frame -> frame.deny()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/public/services/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/public/doctors/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/public/availability").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/public/bookings").permitAll()
                        .requestMatchers("/api/public/auth/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(patientJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .anonymous(Customizer.withDefaults());

        return http.build();
    }
}
