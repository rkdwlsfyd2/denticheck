package com.denticheck.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration
public class GoogleJwtDecoderConfig {

    @Bean
    public JwtDecoder googleIdTokenDecoder() {
        // Google issuer의 JWK를 자동으로 따라가서 서명 검증
        return NimbusJwtDecoder.withIssuerLocation("https://accounts.google.com").build();
    }
}
