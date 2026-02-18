package com.denticheck.api.domain.community.entity;

import com.denticheck.api.domain.dental.entity.DentalEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
    name = "community_post_dentals",
    uniqueConstraints = @UniqueConstraint(columnNames = { "post_id", "dental_id" })
)
public class CommunityPostDentalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "post_id", nullable = false)
    private UUID postId;

    @Column(name = "dental_id", nullable = false)
    private UUID dentalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false, insertable = false, updatable = false)
    @Setter
    private CommunityPostEntity post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dental_id", nullable = false, insertable = false, updatable = false)
    private DentalEntity dental;
}
