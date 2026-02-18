-- 커뮤니티 게시글 테이블 (CommunityPostEntity)
CREATE TABLE community_posts (
    id UUID PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    like_count INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);
