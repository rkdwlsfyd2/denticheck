-- 게시글 종류: product(상품후기), hospital(병원후기), NULL이면 전체(일반)
ALTER TABLE community_posts
ADD COLUMN post_type VARCHAR(20) NULL;
