package com.clinic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    private final SecurityProperties securityProperties;

    public CorsConfig(SecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration publicCors = baseCorsConfiguration();
        applyOrigins(publicCors, securityProperties.cors().publicOrigins());

        CorsConfiguration adminCors = baseCorsConfiguration();
        applyOrigins(adminCors, securityProperties.cors().adminOrigins());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/public/**", publicCors);
        source.registerCorsConfiguration("/api/admin/**", adminCors);
        return source;
    }

    private CorsConfiguration baseCorsConfiguration() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        return configuration;
    }

    private void applyOrigins(CorsConfiguration configuration, List<String> origins) {
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedOriginPatterns(origins);
        configuration.addAllowedOriginPattern("http://localhost:*");
        configuration.addAllowedOriginPattern("http://127.0.0.1:*");
    }
}
