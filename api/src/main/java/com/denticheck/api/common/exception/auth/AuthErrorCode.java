package com.denticheck.api.common.exception.auth;

import com.denticheck.api.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AuthErrorCode implements ErrorCode {
    // 6000번대: 인증/인가 관련
    EMPTY_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, 6000, "Access Token이 존재하지 않습니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, 6001, "만료된 토큰입니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, 6002, "유효하지 않은 토큰입니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, 6003, "Refresh Token이 유효하지 않거나 만료되었습니다."),
    LOGIN_FAILED(HttpStatus.UNAUTHORIZED, 6004, "로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");

    private final HttpStatus httpStatus;
    private final int code;
    private final String message;
}
