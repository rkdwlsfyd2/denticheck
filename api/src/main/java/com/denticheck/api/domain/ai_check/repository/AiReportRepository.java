package com.denticheck.api.domain.ai_check.repository;

import com.denticheck.api.domain.ai_check.entity.AiReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AiReportRepository extends JpaRepository<AiReportEntity, UUID> {
    Optional<AiReportEntity> findBySessionId(UUID sessionId);
}
