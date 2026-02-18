package com.denticheck.api.controller;

import com.denticheck.api.security.jwt.dto.JWTResponseDTO;
import com.denticheck.api.security.jwt.dto.LogoutRequestDTO;
import com.denticheck.api.security.jwt.dto.RefreshRequestDTO;
import com.denticheck.api.security.jwt.service.impl.JwtServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import com.denticheck.api.common.exception.auth.AuthErrorCode;
import com.denticheck.api.common.exception.auth.AuthException;

@RestController
@RequiredArgsConstructor
public class JwtController {

    private final JwtServiceImpl jwtServiceImpl;

    // 소셜 로그인 쿠키 방식의 Refresh 토큰 헤더 방식으로 교환
    @PostMapping(value = "/jwt/exchange", consumes = MediaType.APPLICATION_JSON_VALUE)
    public JWTResponseDTO jwtExchangeApi(
            HttpServletRequest request,
            HttpServletResponse response) {
        return jwtServiceImpl.cookie2Header(request, response);
    }

    // Refresh 토큰으로 Access 토큰 재발급 (Rotate 포함)
    @PostMapping(value = "/jwt/refresh", consumes = MediaType.APPLICATION_JSON_VALUE)
    public JWTResponseDTO jwtRefreshApi(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestBody RefreshRequestDTO dto) {

        // 하이브리드 지원: 바디에 토큰이 없으면 쿠키에서 찾음
        String refreshToken = dto.getRefreshToken();
        if (refreshToken == null || refreshToken.isBlank()) {
            jakarta.servlet.http.Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (jakarta.servlet.http.Cookie cookie : cookies) {
                    if ("refreshToken".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                        break;
                    }
                }
            }
        }

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthException(AuthErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        dto.setRefreshToken(refreshToken);
        return jwtServiceImpl.refreshRotate(dto, response);
    }

    @PostMapping("/jwt/dev-login")
    public JWTResponseDTO devLoginApi(HttpServletResponse response) {
        return jwtServiceImpl.devLogin(response);
    }

    // 로그아웃 (Refresh 토큰 삭제)
    @PostMapping(value = "/jwt/logout", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestBody LogoutRequestDTO dto) {

        String refreshToken = dto.refreshToken();
        // 바디에 없으면 쿠키에서라도 찾아서 삭제 시도
        if (refreshToken == null || refreshToken.isBlank()) {
            jakarta.servlet.http.Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (jakarta.servlet.http.Cookie cookie : cookies) {
                    if ("refreshToken".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                        break;
                    }
                }
            }
        }

        if (refreshToken != null) {
            jwtServiceImpl.removeRefresh(refreshToken);
        }

        // 쿠키 삭제 (MaxAge 0)
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("refreshToken", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }
}
