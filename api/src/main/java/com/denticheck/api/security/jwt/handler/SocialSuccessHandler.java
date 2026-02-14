package com.denticheck.api.security.jwt.handler;

import com.denticheck.api.common.util.JWTUtil;
import com.denticheck.api.security.jwt.service.impl.JwtServiceImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@Component
@Qualifier("SocialSuccessHandler")
@RequiredArgsConstructor
public class SocialSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtServiceImpl jwtServiceImpl;
    private final JWTUtil jwtUtil;

    @Value("${admin.web.login-success-redirect}")
    private String adminLoginSuccessRedirect;

    @Value("${admin.web.refresh-cookie-max-age}")
    private Duration refreshCookieMaxAge;

    @Value("${admin.web.refresh-cookie-secure}")
    private boolean refreshCookieSecure;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {

        // username, role
        String username = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // JWT(Refresh) 발급
        String refreshToken = jwtUtil.createRefreshJWT(username, role);
        // 발급한 Refresh DB 테이블 저장 (Refresh whitelist)
        jwtServiceImpl.addRefresh(username, refreshToken);

        // 응답
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(refreshCookieSecure);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(Math.toIntExact(refreshCookieMaxAge.toSeconds()));

        response.addCookie(refreshCookie);

        response.sendRedirect(adminLoginSuccessRedirect);
    }

}
