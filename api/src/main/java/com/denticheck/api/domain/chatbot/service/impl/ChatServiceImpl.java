package com.denticheck.api.domain.chatbot.service.impl;

import com.denticheck.api.domain.chatbot.entity.AiChatMessageEntity;
import com.denticheck.api.domain.chatbot.entity.ChatSessionEntity;
import com.denticheck.api.domain.chatbot.repository.AiChatMessageRepository;
import com.denticheck.api.domain.chatbot.repository.ChatSessionRepository;
import com.denticheck.api.domain.chatbot.service.ChatService;
import com.denticheck.api.domain.chatbot.dto.ChatAppRequest;
import com.denticheck.api.domain.chatbot.dto.ChatAppResponse;
import com.denticheck.api.domain.chatbot.dto.ChatRequest;
import com.denticheck.api.domain.chatbot.dto.ChatResponse;
import com.denticheck.api.domain.chatbot.entity.ChatMessageType;
import com.denticheck.api.domain.user.entity.UserEntity;
import com.denticheck.api.domain.user.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.denticheck.api.domain.chatbot.entity.ChatRole;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final AiChatMessageRepository aiChatMessageRepository;
    private final UserRepository userRepository;
    // private final AiReportRepository aiReportRepository; // Removed unused
    // dependency
    private final ObjectMapper objectMapper;

    // Session ID -> SseEmitter Map
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @Value("${ai.client.url}")
    private String AI_SERVICE_URL;

    @Override
    @Transactional
    public ChatSessionEntity startSession(UUID userId, String channel) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getOrCreateActiveSession(user, channel);
    }

    private ChatSessionEntity getOrCreateActiveSession(UserEntity user, String channel) {
        return chatSessionRepository.findByUserIdAndChannelAndEndedAtIsNull(user.getId(), channel)
                .orElseGet(() -> {
                    log.info("새 채팅 세션을 시작합니다. 사용자: {}, 채널: {}", user.getId(), channel);
                    ChatSessionEntity session = ChatSessionEntity.builder()
                            .user(user)
                            .channel(channel)
                            .build();
                    return chatSessionRepository.save(session);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiChatMessageEntity> getChatHistory(UUID sessionId) {
        return aiChatMessageRepository.findAllBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    @Override
    public SseEmitter subscribe(UUID sessionId) {
        SseEmitter emitter = new SseEmitter(60 * 60 * 1000L); // 1 hour timeout
        emitters.put(sessionId, emitter);

        emitter.onCompletion(() -> emitters.remove(sessionId));
        emitter.onTimeout(() -> emitters.remove(sessionId));
        emitter.onError((e) -> emitters.remove(sessionId));

        return emitter;
    }

    @Override
    @Transactional
    public ChatAppResponse processMessage(ChatAppRequest request, UUID userId, String channel) {
        String content = request.getContent();
        ChatMessageType messageType = request.getMessageType() != null ? request.getMessageType()
                : ChatMessageType.TEXT;
        Map<String, Object> payload = request.getPayload();

        log.info("사용자로부터 채팅 메시지를 수신했습니다. 사용자: {}, 채널: {}, 내용: {}", userId, channel, content);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ChatSessionEntity session = getOrCreateActiveSession(user, channel);

        // 1. Save User Message
        AiChatMessageEntity userMessage = AiChatMessageEntity.builder()
                .session(session)
                .role(ChatRole.USER)
                .content(content)
                .messageType(messageType)
                .payload(payload)
                .language("ko") // Default to Korean for now
                .build();
        aiChatMessageRepository.save(userMessage);

        // Update Session Metadata
        session.touchLastMessage(preview(content));

        // 2. Call AI Server (MOCK for now)
        // String aiResponseJson = callAiServer(session.getId(), content, "ko");

        // Mock AI Response
        String aiContent = "안녕하세요! [" + content + "]라고 말씀하셨군요. \n현재 AI 연결 테스트 중입니다. \n(Mock Response)";
        ChatMessageType aiMessageType = ChatMessageType.TEXT;
        Map<String, Object> aiPayload = null;

        // 3. Save Assistant Message
        AiChatMessageEntity aiMessage = AiChatMessageEntity.builder()
                .session(session)
                .role(ChatRole.ASSISTANT)
                .content(aiContent)
                .messageType(aiMessageType)
                .payload(aiPayload)
                .language("ko")
                .build();
        AiChatMessageEntity savedAiMessage = aiChatMessageRepository.save(aiMessage);

        session.touchLastMessage(preview(aiContent));

        // 4. Push to SSE (Optional for simple HTTP request/response)
        // ... (Keep existing if needed, or remove if moving to pure HTTP)

        log.info("AI 응답: sessionId={}, content={}", session.getId(), savedAiMessage.getContent());

        return ChatAppResponse.builder()
                .sessionId(session.getId())
                .userMessageId(userMessage.getId())
                .assistantMessageId(savedAiMessage.getId())
                .assistantContent(savedAiMessage.getContent())
                .messageType(savedAiMessage.getMessageType())
                .payload(savedAiMessage.getPayload())
                .build();
    }

    @Override
    @Transactional
    public void endSession(UUID userId, String channel) {
        chatSessionRepository.findByUserIdAndChannelAndEndedAtIsNull(userId, channel)
                .ifPresent(session -> {
                    log.info("채팅 세션을 종료합니다: {}", session.getId());
                    session.endSession();
                });
    }

    private String preview(String content) {
        if (content == null)
            return "Picture/Card";
        return content.length() <= 30 ? content : content.substring(0, 30) + "...";
    }

    @Override
    @Transactional
    public ChatResponse processMessage(ChatRequest request) {
        // Deprecated or keep for legacy/internal use if needed.
        // For now, redirecting logic or throwing error.
        throw new UnsupportedOperationException("Use processMessage(ChatAppRequest, userId, channel) instead.");
    }

    private String callAiServer(UUID sessionId, String content, String language) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Construct request body
        // Adjust this structure to match what the Python AI server expects
        Map<String, Object> requestBody = Map.of(
                "session_id", sessionId.toString(),
                "message", content,
                "language", language != null ? language : "ko");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(AI_SERVICE_URL + "/v1/chat/ask", entity,
                    String.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("AI 서버 호출 중 오류가 발생했습니다.", e);
            throw new RuntimeException("AI Server Error");
        }
    }

    private void saveAiReport(ChatSessionEntity session, JsonNode reportNode, String language) {
        // TODO: AI Report now requires an AiCheckSessionEntity
        // (AiReportEntity.session).
        // The current ChatSessionEntity does not link to AiCheckSessionEntity.
        // We need to either pass the check session ID in the chat request or redesign
        // this flow.
        // For now, we log the report content and skip saving.

        log.warn(
                "채팅 세션 {}에 대한 AI 리포트를 수신했지만, 연결된 AiCheckSession이 없어 저장할 수 없습니다. 리포트 내용: {}",
                session.getId(), reportNode);

        /*
         * String summary = reportNode.path("summary").asText();
         * String routineGuide = reportNode.path("routine_guide").asText();
         * String warnings = reportNode.path("warnings").asText();
         * String disclaimerVersion = reportNode.path("disclaimer_version").asText();
         * 
         * AiReportEntity report = AiReportEntity.builder()
         * .summary(summary)
         * .details("Checkup required")
         * .disclaimer("Consult a dentist")
         * .disclaimerVersion(disclaimerVersion)
         * .language(language)
         * .build();
         * 
         * // aiReportRepository.save(report);
         */
    }
}
