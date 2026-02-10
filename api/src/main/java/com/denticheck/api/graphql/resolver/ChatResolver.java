package com.denticheck.api.graphql.resolver;

import com.denticheck.api.domain.chatbot.entity.AiChatMessageEntity;
import com.denticheck.api.domain.chatbot.entity.ChatSessionEntity;
import com.denticheck.api.domain.chatbot.service.ChatService;
import com.denticheck.api.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatResolver {

    private final ChatService chatService;

    private final UserRepository userRepository;

    @MutationMapping
    @PreAuthorize("hasRole('USER')")
    public ChatSessionEntity startChatSession(@Argument String channel) {
        // Get current user ID (assuming JWT authentication sets principal as username
        // or ID)
        // For now, using a placeholder or need to extract from SecurityContext
        // Assuming SecurityContext holds username which is UUID, or need to look up
        // User.
        // Let's assume we can get ID. If not, we might need a User Service to look up
        // by username.
        // Given existing code style, let's try to get ID.

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        // Warn: username might be "temp-user" for tests.
        // If "temp-user", we might need a dummy user in DB.

        // TODO: Proper User ID retrieval. For now assuming username is UUID string or
        // "temp-user"
        com.denticheck.api.domain.user.entity.UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return chatService.startSession(user.getId(), channel);
    }

    @QueryMapping
    @PreAuthorize("hasRole('USER')")
    public List<AiChatMessageEntity> getChatHistory(@Argument UUID sessionId) {
        return chatService.getChatHistory(sessionId);
    }

    @MutationMapping
    @PreAuthorize("hasRole('USER')")
    public AiChatMessageEntity sendChatMessage(@Argument UUID sessionId, @Argument String content,
            @Argument String language) {
        return chatService.processMessage(sessionId, content, language);
    }
}
