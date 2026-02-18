package com.denticheck.api.common.exception.hospital;

import com.denticheck.api.common.exception.BusinessException;
import lombok.Getter;

@Getter
public class HospitalException extends BusinessException {
    public HospitalException(HospitalErrorCode errorCode) {
        super(errorCode);
    }
}
