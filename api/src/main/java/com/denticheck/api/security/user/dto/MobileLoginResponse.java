package com.denticheck.api.security.user.dto;

public record MobileLoginResponse(
        String accessToken,
        String refreshToken
) {
}
