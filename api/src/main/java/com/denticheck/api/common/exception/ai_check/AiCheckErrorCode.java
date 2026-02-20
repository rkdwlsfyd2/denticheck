package com.denticheck.api.common.exception.ai_check;

import com.denticheck.api.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AiCheckErrorCode implements ErrorCode {
    // 4000번대: AI 검진 관련
    AI_ANALYSIS_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 4000, "AI 분석 중 오류가 발생했습니다.");

    private final HttpStatus httpStatus;
    private final int code;
    private final String message;
}
