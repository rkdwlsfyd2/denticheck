package com.denticheck.api.domain.chatbot.service;

import com.denticheck.api.domain.chatbot.entity.AiChatMessageEntity;
import com.denticheck.api.domain.chatbot.entity.ChatSessionEntity;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

import com.denticheck.api.domain.chatbot.dto.ChatRequest;
import com.denticheck.api.domain.chatbot.dto.ChatResponse;

public interface ChatService {

    ChatSessionEntity startSession(UUID userId, String channel);

    List<AiChatMessageEntity> getChatHistory(UUID sessionId);

    SseEmitter subscribe(UUID sessionId);

    ChatResponse processMessage(ChatRequest request);
}
