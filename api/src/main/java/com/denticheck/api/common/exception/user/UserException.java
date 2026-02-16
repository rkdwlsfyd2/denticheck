package com.denticheck.api.common.exception.user;

import com.denticheck.api.common.exception.BusinessException;
import lombok.Getter;

@Getter
public class UserException extends BusinessException {
    public UserException(UserErrorCode errorCode) {
        super(errorCode);
    }
}
