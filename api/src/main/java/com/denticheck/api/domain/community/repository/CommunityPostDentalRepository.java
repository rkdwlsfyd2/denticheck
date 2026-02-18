package com.denticheck.api.domain.community.repository;

import com.denticheck.api.domain.community.entity.CommunityPostDentalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CommunityPostDentalRepository extends JpaRepository<CommunityPostDentalEntity, UUID> {
}
