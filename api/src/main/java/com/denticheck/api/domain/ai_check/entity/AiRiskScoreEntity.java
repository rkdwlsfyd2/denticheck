package com.denticheck.api.domain.ai_check.entity;

import com.denticheck.api.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ai_risk_scores")
public class AiRiskScoreEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private AiCheckSessionEntity session;

    @Column(name = "model_name", nullable = false, length = 50)
    private String modelName;

    @Column(name = "target", nullable = false)
    private String target; // gingivitis/periodontal

    @Column(name = "pred_class", nullable = false)
    private String predClass; // normal/suspected

    @Column(name = "score", nullable = false, precision = 6, scale = 4)
    private BigDecimal score;
}
