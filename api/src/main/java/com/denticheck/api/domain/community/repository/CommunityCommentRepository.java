package com.denticheck.api.domain.community.repository;

import com.denticheck.api.domain.community.entity.CommunityCommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommunityCommentRepository extends JpaRepository<CommunityCommentEntity, UUID> {

    /** 게시글별 댓글 목록 (작성일 기준 정렬) */
    List<CommunityCommentEntity> findByPost_IdOrderByCreatedAtAsc(UUID postId);
}
