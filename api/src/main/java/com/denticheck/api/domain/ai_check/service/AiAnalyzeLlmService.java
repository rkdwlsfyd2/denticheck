package com.denticheck.api.domain.ai_check.service;

import com.denticheck.api.domain.ai_check.dto.AnalyzeResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalyzeLlmService {

    @Value("${ai.client.url}")
    private String aiBaseUrl;

    @Value("${ai.analyze.timeout:3m}")
    private java.time.Duration generateTimeout;

    public AnalyzeResponse.LlmResult generate(
            List<AnalyzeResponse.DetectionItem> detections,
            Map<String, Object> summary,
            List<AnalyzeResponse.RagSource> ragSources) { // ragSources 인자는 하위 호환성을 위해 남겨두지만 무시됨

        try {
            // 1. Python 서버로 보낼 요청 DTO 구성
            ReportRequest request = buildReportRequest(detections, summary);

            // 2. Python API 호출 (/v1/report/generate)
            ReportResponse response = callPythonReportApi(request);

            if (response == null) {
                log.warn("Python report generation returned null. Using fallback.");
                return buildRuleBasedFallback(detections);
            }

            // 3. 응답 변환
            return AnalyzeResponse.LlmResult.builder()
                    .riskLevel("GREEN") // Python 응답에 없으므로 기본값 또는 별도 로직 (여기선 단순화)
                    .summary(response.getSummary())
                    .findings(parseFindings(response.getDetails())) // 텍스트를 구조화된 Findings로 변환
                    .careGuide(List.of()) // 상세 가이드는 details에 통합됨
                    .disclaimer(List.of(response.getDisclaimer()))
                    .build();

        } catch (Exception e) {
            log.error("Failed to generate report via Python server", e);
            return buildRuleBasedFallback(detections);
        }
    }

    private ReportRequest buildReportRequest(List<AnalyzeResponse.DetectionItem> detections,
            Map<String, Object> summary) {
        // YOLO 요약 정보 변환
        Map<String, YoloSummary> yoloMap = detections.stream()
                .collect(Collectors.groupingBy(
                        d -> normalizeLabel(d.getLabel()),
                        Collectors.collectingAndThen(Collectors.toList(), list -> {
                            double maxScore = list.stream()
                                    .mapToDouble(d -> d.getConfidence() != null ? d.getConfidence() : 0.0).max()
                                    .orElse(0.0);
                            return YoloSummary.builder()
                                    .present(true)
                                    .count(list.size())
                                    .maxScore(maxScore)
                                    .areaRatio(0.0)
                                    .build();
                        })));

        return ReportRequest.builder()
                .yolo(yoloMap)
                .survey(Collections.emptyMap()) // 필요 시 추가
                .history(Collections.emptyMap())
                .overall(OverallInfo.builder()
                        .level("info")
                        .recommendedActions(List.of())
                        .safetyFlags(Collections.emptyMap())
                        .build())
                .language("ko")
                .build();
    }

    private ReportResponse callPythonReportApi(ReportRequest request) {
        String url = aiBaseUrl + "/v1/report/generate";
        log.info("Calling Python AI Server at {} with timeout {} ms", url, generateTimeout.toMillis());
        long startTime = System.currentTimeMillis();

        try {
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setReadTimeout((int) generateTimeout.toMillis());
            factory.setConnectTimeout(10000);
            RestTemplate restTemplate = new RestTemplate(factory);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ResponseEntity<ReportResponse> response = restTemplate.postForEntity(
                    url,
                    new HttpEntity<>(request, headers),
                    ReportResponse.class);

            long duration = System.currentTimeMillis() - startTime;
            log.info("Python AI Server responded in {} ms", duration);
            return response.getBody();
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("Python AI Server call failed after {} ms. Configured timeout: {} ms", duration,
                    generateTimeout.toMillis(), e);
            throw e;
        }
    }

    private List<AnalyzeResponse.Finding> parseFindings(String details) {
        // Python이 줄글로 준 내용을 적당히 끊어서 Finding 객체로 변환 (임시 로직)
        return List.of(AnalyzeResponse.Finding.builder()
                .title("상세 분석 결과")
                .detail(details)
                .evidence(List.of("RAG 기반 분석"))
                .build());
    }

    private AnalyzeResponse.LlmResult buildRuleBasedFallback(List<AnalyzeResponse.DetectionItem> detections) {
        return AnalyzeResponse.LlmResult.builder()
                .riskLevel("YELLOW")
                .summary("AI 소견 생성에 일시적 오류가 발생했습니다.")
                .findings(List.of(AnalyzeResponse.Finding.builder()
                        .title("시스템 알림")
                        .detail("잠시 후 다시 시도해주세요.")
                        .evidence(List.of())
                        .build()))
                .careGuide(List.of("가까운 치과를 방문하여 검진받으세요."))
                .disclaimer(List.of("본 결과는 참고용이며 의학적 진단이 아닙니다."))
                .build();
    }

    // --- Helper Classes & Methods ---

    private String normalizeLabel(String raw) {
        return raw == null ? "normal" : raw.toLowerCase().trim();
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ReportRequest {
        private Map<String, YoloSummary> yolo;
        private Map<String, Object> survey;
        private Map<String, Object> history;
        private OverallInfo overall;
        private String language;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    private static class YoloSummary {
        private boolean present;
        private int count;
        @JsonProperty("max_score")
        private double maxScore;
        @JsonProperty("area_ratio")
        private double areaRatio;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    private static class OverallInfo {
        private String level;
        @JsonProperty("recommended_actions")
        private List<Object> recommendedActions;
        @JsonProperty("safety_flags")
        private Map<String, Boolean> safetyFlags;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ReportResponse {
        private String summary;
        private String details;
        private String disclaimer;
        private String language;
    }
}
