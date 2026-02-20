package com.denticheck.api.infrastructure.external;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoMapService {

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Double[] getCoordinates(String address) {
        if (address == null || address.trim().isEmpty()) {
            return null;
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://dapi.kakao.com/v2/local/search/address.json")
                    .queryParam("query", address)
                    .build()
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoRestApiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> body = response.getBody();

            if (body != null && body.containsKey("documents")) {
                List<Map<String, Object>> documents = (List<Map<String, Object>>) body.get("documents");
                if (!documents.isEmpty()) {
                    Map<String, Object> firstResult = documents.get(0);
                    // y is latitude, x is longitude in Kakao API
                    String x = (String) firstResult.get("x");
                    String y = (String) firstResult.get("y");

                    log.info("Geocoding success for address: {} -> lat: {}, lng: {}", address, y, x);
                    return new Double[] { Double.parseDouble(y), Double.parseDouble(x) };
                }
            }
        } catch (Exception e) {
            log.error("Failed to get coordinates for address: {}", address, e);
        }

        return null;
    }
}
