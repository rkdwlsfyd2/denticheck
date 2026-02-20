package com.denticheck.api.controller;

import com.denticheck.api.domain.community.service.CommunityImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityUploadController {

    private final CommunityImageUploadService communityImageUploadService;

    /**
     * 게시글용 이미지 1장 업로드. 로그인 필요.
     * 저장 후 접근 URL을 반환하며, createPost 시 imageUrls에 넣어 사용.
     */
    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestPart("file") MultipartFile file) {
        String url = communityImageUploadService.uploadImage(file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
