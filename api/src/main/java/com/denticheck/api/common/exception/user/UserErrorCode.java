package com.denticheck.api.common.exception.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UserErrorCode {
    // 1100번대: 유저 상태 관련
    USER_NOT_ACTIVE(HttpStatus.FORBIDDEN, 1100, "비활성 계정입니다. 관리자에게 문의해 주십시오."),
    USER_SUSPENDED(HttpStatus.FORBIDDEN, 1101, "정지된 계정입니다. 관리자에게 문의해 주십시오."),
    USER_DORMANT(HttpStatus.FORBIDDEN, 1102, "휴면 계정입니다. 관리자에게 문의해 주십시오."),
    USER_WITHDRAWN(HttpStatus.FORBIDDEN, 1103, "탈퇴한 계정입니다. 관리자에게 문의해 주십시오.");

    private final HttpStatus httpStatus;
    private final int code;
    private final String message;
}
