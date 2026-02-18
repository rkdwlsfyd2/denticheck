package com.denticheck.api.domain.community.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/** 댓글 첨부 이미지 (일단 이미지만) */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "community_comment_images")
public class CommunityCommentImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private CommunityCommentEntity comment;

    /** 이미지 URL 또는 저장 경로 */
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    /** 표시 순서 (0부터) */
    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}
