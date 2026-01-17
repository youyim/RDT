package com.rdt.auth.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * JWT Secret Key (HMAC-SHA256, at least 32 characters)
     */
    private String secret;

    /**
     * JWT Expiration time in milliseconds
     */
    private long expiration;
}
