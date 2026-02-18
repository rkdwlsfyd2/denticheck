package com.denticheck.api.domain.dental.repository;

import com.denticheck.api.domain.dental.entity.DentalEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DentalRepository extends JpaRepository<DentalEntity, UUID> {

    List<DentalEntity> findByNameContainingIgnoreCaseOrderByNameAsc(String name, Pageable pageable);

    List<DentalEntity> findAllByOrderByNameAsc(Pageable pageable);

    long countByIdIn(Iterable<UUID> ids);
}
