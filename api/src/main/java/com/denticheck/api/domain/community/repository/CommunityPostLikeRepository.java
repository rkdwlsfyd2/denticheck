package com.denticheck.api.domain.community.repository;

import com.denticheck.api.domain.community.entity.CommunityPostLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommunityPostLikeRepository extends JpaRepository<CommunityPostLikeEntity, UUID> {

    boolean existsByUserIdAndPostId(UUID userId, UUID postId);

    void deleteByUserIdAndPostId(UUID userId, UUID postId);

    /** 사용자가 좋아요한 게시글 like 목록 (posts 조회 시 isLiked 설정용) */
    List<CommunityPostLikeEntity> findByUserId(UUID userId);
}
