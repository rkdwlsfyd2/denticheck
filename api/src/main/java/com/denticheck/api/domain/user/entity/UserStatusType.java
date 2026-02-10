package com.denticheck.api.domain.user.entity;

import lombok.Getter;

@Getter
public enum UserStatusType {
    ACTIVE("정상"),
    DORMANT("휴면"),
    SUSPENDED("정지"),
    WITHDRAWN("탈퇴");

    private final String description;

    UserStatusType(String description) {
        this.description = description;
    }
}
