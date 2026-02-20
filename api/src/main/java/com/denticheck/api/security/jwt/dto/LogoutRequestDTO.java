package com.denticheck.api.security.jwt.dto;

import jakarta.validation.constraints.NotBlank;

public record LogoutRequestDTO(
                @NotBlank(message = "RefreshToken이 필요합니다.") String refreshToken) {
}
