package com.clinic.security;

import com.clinic.config.SecurityProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.util.matcher.IpAddressMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AdminIpFilter extends OncePerRequestFilter {

    private final List<IpAddressMatcher> allowedMatchers;

    public AdminIpFilter(SecurityProperties securityProperties) {
        this.allowedMatchers = securityProperties.admin().ipAllowlist().stream()
                .map(IpAddressMatcher::new)
                .collect(Collectors.toList());
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getServletPath().startsWith("/api/admin/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String remoteAddr = extractClientIp(request);

        boolean allowed = allowedMatchers.isEmpty()
                || allowedMatchers.stream().anyMatch(matcher -> matcher.matches(remoteAddr));

        if (!allowed) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "IP not allowed");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String extractClientIp(HttpServletRequest request) {
        String header = request.getHeader("X-Forwarded-For");
        if (header != null && !header.isBlank()) {
            return header.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
