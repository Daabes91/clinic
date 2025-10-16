package com.clinic.security;

import com.clinic.config.SecurityProperties;
import com.clinic.modules.admin.staff.model.StaffRole;
import com.clinic.modules.admin.staff.model.StaffUser;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class JwtIssuer {

    private final SecurityProperties securityProperties;
    private final RSAKey staffKey;
    private final RSASSASigner staffSigner;
    private final Environment environment;

    public JwtIssuer(SecurityProperties securityProperties, Environment environment) {
        this.securityProperties = securityProperties;
        this.environment = environment;
        String staffPem = securityProperties.jwt().staff().privateKey();
        if (!StringUtils.hasText(staffPem)) {
            staffPem = environment.getProperty("JWT_STAFF_PRIVATE_KEY");
        }
        if (!StringUtils.hasText(staffPem)) {
            staffPem = "classpath:keys/staff_private.pem";
        }
        this.staffKey = parseRsaKey(staffPem, "staff");
        try {
            this.staffSigner = new RSASSASigner(staffKey);
        } catch (JOSEException e) {
            throw new IllegalStateException("Unable to initialize staff JWT signer", e);
        }
    }

    public IssuedToken issueStaffAccessToken(StaffUser user) {
        var tokenConfig = securityProperties.jwt().staff();
        String issuer = resolve(tokenConfig.issuer(), "JWT_STAFF_ISSUER", "https://api.example-clinic.com");
        String audience = resolve(tokenConfig.audience(), "JWT_STAFF_AUDIENCE", "staff");
        Instant now = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        Instant expiresAt = now.plus(tokenConfig.accessTtl());

        var claims = new JWTClaimsSet.Builder()
                .subject(String.valueOf(user.getId()))
                .issuer(issuer)
                .audience(audience)
                .issueTime(java.util.Date.from(now))
                .expirationTime(java.util.Date.from(expiresAt))
                .claim("email", user.getEmail())
                .claim("name", user.getFullName())
                .claim("roles", List.of(roleToAuthority(user.getRole())))
                .build();

        try {
            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader.Builder(JWSAlgorithm.RS256)
                            .type(JOSEObjectType.JWT)
                            .build(),
                    claims
            );
            signedJWT.sign(staffSigner);
            return new IssuedToken(signedJWT.serialize(), expiresAt);
        } catch (JOSEException ex) {
            throw new IllegalStateException("Unable to sign staff JWT", ex);
        }
    }

    private String roleToAuthority(StaffRole role) {
        return "ROLE_" + role.name();
    }

    private String resolve(String currentValue, String envKey, String defaultValue) {
        if (currentValue != null && !currentValue.isBlank()) {
            return currentValue;
        }
        String envValue = environment.getProperty(envKey);
        if (envValue != null && !envValue.isBlank()) {
            return envValue;
        }
        return defaultValue;
    }

    private RSAKey parseRsaKey(String pem, String label) {
        if (pem == null || pem.isBlank()) {
            throw new IllegalStateException("Missing RSA private key for " + label + " tokens");
        }
        String normalized = PemUtils.loadPem(pem).replace("\\n", "\n");
        try {
            return (RSAKey) JWK.parseFromPEMEncodedObjects(normalized);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to parse RSA private key for " + label + " tokens", e);
        }
    }

    public record IssuedToken(String token, Instant expiresAt) {
    }
}
