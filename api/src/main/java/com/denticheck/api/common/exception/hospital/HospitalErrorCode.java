package com.denticheck.api.common.exception.hospital;

import com.denticheck.api.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum HospitalErrorCode implements ErrorCode {
    // 3000번대: 병원 관련
    HOSPITAL_NOT_FOUND(HttpStatus.NOT_FOUND, 3000, "병원을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final int code;
    private final String message;
}
