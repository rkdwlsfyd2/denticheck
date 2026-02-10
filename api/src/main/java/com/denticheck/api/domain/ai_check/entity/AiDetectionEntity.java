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
@Table(name = "ai_detections")
public class AiDetectionEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private AiCheckSessionEntity session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id", nullable = false)
    private AiImageEntity image;

    @Column(name = "model_name", nullable = false, length = 50)
    private String modelName;

    @Column(name = "label", nullable = false)
    private String label;

    @Column(name = "confidence", nullable = false, precision = 6, scale = 4)
    private BigDecimal confidence;

    @Column(name = "bbox_x", nullable = false, precision = 8, scale = 6)
    private BigDecimal bboxX;

    @Column(name = "bbox_y", nullable = false, precision = 8, scale = 6)
    private BigDecimal bboxY;

    @Column(name = "bbox_w", nullable = false, precision = 8, scale = 6)
    private BigDecimal bboxW;

    @Column(name = "bbox_h", nullable = false, precision = 8, scale = 6)
    private BigDecimal bboxH;
}
