package com.denticheck.api.graphql.resolver;

import com.denticheck.api.domain.community.dto.CommunityPostDto;
import com.denticheck.api.domain.community.dto.PostLikeResultDto;
import com.denticheck.api.domain.community.entity.CommunityPostLikeEntity;
import com.denticheck.api.domain.community.repository.CommunityPostLikeRepository;
import com.denticheck.api.domain.community.service.CommunityPostService;
import com.denticheck.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class CommunityResolver {

    private final CommunityPostService communityPostService;
    private final CommunityPostLikeRepository communityPostLikeRepository;
    private final UserRepository userRepository;

    @QueryMapping
    public List<CommunityPostDto> posts(
            @Argument("limit") Integer limit,
            @Argument("offset") Integer offset,
            @Argument("postType") String postType) {
        List<CommunityPostDto> list = (limit != null || offset != null || postType != null)
                ? communityPostService.findAll(limit != null ? limit : 10, offset != null ? offset : 0, postType)
                : communityPostService.findAll();
        String currentAuthorName = getCurrentUserDisplayNameOrNull();
        UUID currentUserId = getCurrentUserIdOrNull();
        Set<UUID> likedPostIds = currentUserId != null
                ? communityPostLikeRepository.findByUserId(currentUserId).stream()
                        .map(CommunityPostLikeEntity::getPostId)
                        .collect(Collectors.toSet())
                : Collections.emptySet();
        list.forEach(dto -> {
            dto.setIsMine(currentAuthorName != null && currentAuthorName.equals(dto.getAuthor()));
            dto.setIsLiked(likedPostIds.contains(dto.getId()));
        });
        return list;
    }

    @MutationMapping
    @PreAuthorize("hasRole('USER')")
    public boolean deletePost(@Argument("id") String idStr) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || username.isBlank()) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        String authorName = getCurrentUserDisplayNameOrNull();
        if (authorName == null) authorName = username;
        UUID postId;
        try {
            postId = UUID.fromString(idStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 게시글 ID입니다.");
        }
        communityPostService.deleteIfAuthor(postId, authorName);
        return true;
    }

    private String getCurrentUserDisplayNameOrNull() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            if (username == null || username.isBlank()) return null;
            return userRepository.findByUsername(username)
                    .map(user -> (user.getNickname() != null && !user.getNickname().isBlank())
                            ? user.getNickname()
                            : user.getUsername())
                    .orElse(username);
        } catch (Exception e) {
            return null;
        }
    }

    private UUID getCurrentUserIdOrNull() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            if (username == null || username.isBlank()) return null;
            return userRepository.findByUsername(username).map(u -> u.getId()).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    @MutationMapping
    @PreAuthorize("hasRole('USER')")
    public CommunityPostDto createPost(@Argument("input") CreatePostInput input) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || username.isBlank()) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        String authorName = userRepository.findByUsername(username)
                .map(user -> (user.getNickname() != null && !user.getNickname().isBlank())
                        ? user.getNickname()
                        : user.getUsername())
                .orElse(username);
        List<UUID> dentalIds;
        try {
            dentalIds = parseDentalIds(input.getDentalIds());
        } catch (Exception e) {
            throw new IllegalArgumentException("치과 태그 ID 변환 실패: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()), e);
        }
        List<String> imageUrls = input.getImageUrls() != null ? input.getImageUrls() : new ArrayList<>();
        try {
            CommunityPostDto created = communityPostService.create(authorName, input.getContent(), input.getPostType(), dentalIds, imageUrls);
            created.setIsMine(true);
            created.setIsLiked(false);
            return created;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            // 클라이언트에 실제 원인 전달 (예: "일부 치과 ID가 존재하지 않습니다" 등)
            Throwable cause = e.getCause();
            String detail = (cause != null && cause.getMessage() != null && !cause.getMessage().isBlank())
                    ? cause.getMessage()
                    : e.getMessage();
            String message = (detail != null && !detail.isBlank())
                    ? detail
                    : "게시글 등록 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
            throw new RuntimeException(message, e);
        }
    }

    @MutationMapping
    @PreAuthorize("hasRole('USER')")
    public PostLikeResultDto togglePostLike(@Argument("postId") String postIdStr) {
        UUID userId = getCurrentUserIdOrNull();
        if (userId == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        UUID postId;
        try {
            postId = UUID.fromString(postIdStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 게시글 ID입니다.");
        }
        return communityPostService.toggleLike(userId, postId);
    }

    /** GraphQL [ID!]는 문자열 배열로 바인딩되므로 UUID로 변환 */
    private List<UUID> parseDentalIds(List<String> raw) {
        if (raw == null || raw.isEmpty()) return Collections.emptyList();
        List<UUID> result = new ArrayList<>(raw.size());
        for (String s : raw) {
            if (s == null || s.isBlank()) continue;
            try {
                result.add(UUID.fromString(s.trim()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("잘못된 치과 ID: " + s, e);
            }
        }
        return result;
    }

    @lombok.Data
    public static class CreatePostInput {
        private String content;
        private String postType;
        /** GraphQL [ID!] → List<String>으로 바인딩 */
        private List<String> dentalIds;
        /** 이미지 URL 목록 (최대 4장) */
        private List<String> imageUrls;
    }
}
