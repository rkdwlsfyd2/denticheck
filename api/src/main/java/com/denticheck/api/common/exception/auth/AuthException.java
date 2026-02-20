package com.denticheck.api.common.exception.auth;

import com.denticheck.api.common.exception.BusinessException;
import lombok.Getter;

@Getter
public class AuthException extends BusinessException {
    public AuthException(AuthErrorCode errorCode) {
        super(errorCode);
    }
}
