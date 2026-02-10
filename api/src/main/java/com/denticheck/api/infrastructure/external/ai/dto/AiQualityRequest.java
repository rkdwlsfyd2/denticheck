package com.denticheck.api.infrastructure.external.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiQualityRequest {
    private String storageKey;
    private String imageUrl; // Optional, depending on implementation
}
