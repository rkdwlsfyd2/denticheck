package com.denticheck.api.domain.chatbot.repository;

import com.denticheck.api.domain.chatbot.entity.AiChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AiChatMessageRepository extends JpaRepository<AiChatMessageEntity, UUID> {
    List<AiChatMessageEntity> findAllBySessionIdOrderByCreatedAtAsc(UUID sessionId);
}
