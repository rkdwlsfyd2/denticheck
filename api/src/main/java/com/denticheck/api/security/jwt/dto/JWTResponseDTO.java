package com.denticheck.api.security.jwt.dto;

public record JWTResponseDTO(String accessToken, String refreshToken) {
}
