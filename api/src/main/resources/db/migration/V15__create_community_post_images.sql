-- 게시글 첨부 이미지 (URL/경로만 저장)
CREATE TABLE community_post_images (
    id         UUID PRIMARY KEY,
    post_id    UUID         NOT NULL REFERENCES community_posts (id) ON DELETE CASCADE,
    image_url  VARCHAR(500) NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_community_post_images_post_id ON community_post_images (post_id);
