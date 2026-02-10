package com.denticheck.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ConfigurationProperties(prefix = "google.mobile")
public class GoogleMobileProperties {
    private List<String> allowedAudiences = new ArrayList<>();
}
