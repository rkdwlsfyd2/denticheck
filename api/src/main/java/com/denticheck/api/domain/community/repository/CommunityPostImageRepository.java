package com.denticheck.api.domain.community.repository;

import com.denticheck.api.domain.community.entity.CommunityPostImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommunityPostImageRepository extends JpaRepository<CommunityPostImageEntity, UUID> {

    List<CommunityPostImageEntity> findByPost_IdInOrderBySortOrderAsc(List<UUID> postIds);
}
