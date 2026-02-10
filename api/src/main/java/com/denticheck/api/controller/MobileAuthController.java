package com.denticheck.api.controller;

import com.denticheck.api.security.jwt.dto.JWTResponseDTO;
import com.denticheck.api.security.user.dto.MobileLoginRequest;
import com.denticheck.api.security.user.service.impl.MobileAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MobileAuthController {

    private final MobileAuthService mobileAuthService;

    @PostMapping("/auth/mobile/google")
    public JWTResponseDTO googleLogin(@Valid @RequestBody MobileLoginRequest req) {
        return mobileAuthService.googleLogin(req.idToken());
    }
}
