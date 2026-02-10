package com.denticheck.api.security.user.dto;

import jakarta.validation.constraints.NotBlank;

public record MobileLoginRequest(
        @NotBlank
        String idToken
) {
}
