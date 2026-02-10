package com.denticheck.api.domain.chatbot.entity;

import com.denticheck.api.common.entity.BaseTimeEntity;
import com.denticheck.api.domain.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chat_sessions")
public class ChatSessionEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "channel", nullable = false)
    @Builder.Default
    private String channel = "oral_faq";

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    public void endSession() {
        this.endedAt = LocalDateTime.now();
    }
}
