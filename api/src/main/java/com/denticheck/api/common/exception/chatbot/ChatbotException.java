package com.denticheck.api.common.exception.chatbot;

import com.denticheck.api.common.exception.BusinessException;
import lombok.Getter;

@Getter
public class ChatbotException extends BusinessException {
    public ChatbotException(ChatbotErrorCode errorCode) {
        super(errorCode);
    }
}
