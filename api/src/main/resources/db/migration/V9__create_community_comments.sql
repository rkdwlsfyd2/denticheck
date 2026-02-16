-- 커뮤니티 댓글 (CommunityCommentEntity)
CREATE TABLE community_comments (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    like_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_community_comments_post FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE
);

-- 댓글 첨부 이미지 (CommunityCommentImageEntity)
CREATE TABLE community_comment_images (
    id UUID PRIMARY KEY,
    comment_id UUID NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_comment_images_comment FOREIGN KEY (comment_id) REFERENCES community_comments (id) ON DELETE CASCADE
);

CREATE INDEX idx_community_comments_post_id ON community_comments (post_id);
CREATE INDEX idx_community_comment_images_comment_id ON community_comment_images (comment_id);
