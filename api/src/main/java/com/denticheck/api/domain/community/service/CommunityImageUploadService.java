package com.denticheck.api.domain.community.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * 게시글 첨부 이미지 업로드 (로컬 저장 후 접근 URL 반환).
 */
public interface CommunityImageUploadService {

    /**
     * 이미지 파일을 저장하고 접근 가능한 URL을 반환.
     *
     * @param file 업로드된 이미지 (jpg, jpeg, png, webp 등)
     * @return 저장된 파일의 공개 URL (예: https://api.example.com/uploads/community/xxx.jpg)
     * @throws IllegalArgumentException 빈 파일 또는 허용되지 않은 확장자
     */
    String uploadImage(MultipartFile file);
}
