package com.denticheck.api.common.exception;

import lombok.Builder;
import lombok.Getter;
import com.denticheck.api.common.exception.user.UserErrorCode;

@Getter
@Builder
public class ErrorResponse {
    private final int code;
    private final String message;

    public static ErrorResponse from(UserErrorCode errorCode) {
        return ErrorResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
    }
}
