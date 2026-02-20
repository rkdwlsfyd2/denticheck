package com.denticheck.api.common.exception.admin;

import com.denticheck.api.common.exception.BusinessException;
import lombok.Getter;

@Getter
public class AdminException extends BusinessException {
    public AdminException(AdminErrorCode errorCode) {
        super(errorCode);
    }
}
