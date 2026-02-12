package com.denticheck.api.domain.chatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.denticheck.api.domain.chatbot.entity.ChatRole;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {
    private UUID id;
    private UUID sessionId;
    private ChatRole role;
    private String content;
    private String language;
    private Map<String, Object> citation;
    private LocalDateTime createdDate;
}
