package com.denticheck.api.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

@Component
public class JWTUtil {

    private final SecretKey secretKey;
    private final Duration accessTokenExpiresIn;
    private final Duration refreshTokenExpiresIn;

    public JWTUtil(
            @Value("${jwt.secret-key}") String secretKeyString,
            @Value("${jwt.accessTokenExpiresIn}") Duration accessTokenExpiresIn,
            @Value("${jwt.refreshTokenExpiresIn}") Duration refreshTokenExpiresIn) {
        this.secretKey = new SecretKeySpec(secretKeyString.getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm());
        this.accessTokenExpiresIn = accessTokenExpiresIn;
        this.refreshTokenExpiresIn = refreshTokenExpiresIn;
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // JWT 클레임 username 파싱
    public String getUsername(String token) {
        return parseClaims(token).getSubject();
    }

    // JWT 클레임 role 파싱
    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    // JWT 유효 여부 (위조, 시간, Access/Refresh 여부)
    public Boolean isValid(String token, Boolean isAccess) {
        try {
            Claims claims = parseClaims(token);

            String type = claims.get("type", String.class);
            if (type == null)
                return false;

            if (isAccess && !"access".equals(type))
                return false;
            if (!isAccess && !"refresh".equals(type))
                return false;

            return true;

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String createAccessJWT(String username, String role) {
        return createJWT(username, role, true);
    }

    public String createRefreshJWT(String username, String role) {
        return createJWT(username, role, false);
    }

    // JWT(Access/Refresh) 생성
    public String createJWT(String username, String role, Boolean isAccess) {
        long now = System.currentTimeMillis();
        long expiry = isAccess ? accessTokenExpiresIn.toMillis() : refreshTokenExpiresIn.toMillis();
        String type = isAccess ? "access" : "refresh";

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .claim("type", type)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expiry))
                .signWith(secretKey)
                .compact();
    }
}