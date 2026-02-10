package com.denticheck.api.domain.user.entity;

import lombok.Getter;

@Getter
public enum SocialProviderType {

    NAVER("네이버"),
    GOOGLE("구글"),
    APPLE("애플");

    private final String description;

    SocialProviderType(String description) {
        this.description = description;
    }
}
