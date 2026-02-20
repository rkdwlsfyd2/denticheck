package com.denticheck.api.security.jwt.service;

import com.denticheck.api.security.jwt.dto.JWTResponseDTO;
import com.denticheck.api.security.jwt.dto.RefreshRequestDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface JwtService {
    JWTResponseDTO cookie2Header(HttpServletRequest request, HttpServletResponse response);

    JWTResponseDTO refreshRotate(RefreshRequestDTO dto, HttpServletResponse response);

    JWTResponseDTO devLogin(HttpServletResponse response);

    void addRefresh(String username, String refreshToken);

    Boolean existRefresh(String refreshToken);

    void removeRefresh(String refreshToken);

    void removeRefreshUser(String username);
}
