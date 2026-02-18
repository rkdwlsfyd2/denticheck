package com.denticheck.api.common.exception.chatbot;

import com.denticheck.api.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ChatbotErrorCode implements ErrorCode {
    // 5000번대: 챗봇 관련
    CHATBOT_SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, 5000, "챗봇 서비스를 현재 이용할 수 없습니다.");

    private final HttpStatus httpStatus;
    private final int code;
    private final String message;
}
