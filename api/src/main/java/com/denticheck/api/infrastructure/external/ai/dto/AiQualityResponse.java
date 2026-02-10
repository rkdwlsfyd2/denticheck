package com.denticheck.api.infrastructure.external.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiQualityResponse {
    private boolean pass;
    private List<String> reasons;
    private Double score;
}
