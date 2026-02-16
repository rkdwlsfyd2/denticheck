package com.denticheck.api.common.exception.ai_check;

import com.denticheck.api.common.exception.BusinessException;
import lombok.Getter;

@Getter
public class AiCheckException extends BusinessException {
    public AiCheckException(AiCheckErrorCode errorCode) {
        super(errorCode);
    }
}
