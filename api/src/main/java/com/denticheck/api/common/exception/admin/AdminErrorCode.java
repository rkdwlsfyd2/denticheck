package com.denticheck.api.common.exception.admin;

import com.denticheck.api.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AdminErrorCode implements ErrorCode {
    // 2000번대: 관리자 관련
    ADMIN_NOT_FOUND(HttpStatus.NOT_FOUND, 2000, "관리자를 찾을 수 없습니다."),
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, 2001, "상품을 찾을 수 없습니다."),
    INSURANCE_NOT_FOUND(HttpStatus.NOT_FOUND, 2002, "보험 상품을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final int code;
    private final String message;
}
