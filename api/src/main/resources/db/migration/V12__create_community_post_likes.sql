-- 게시글 좋아요 (사용자별)
CREATE TABLE community_post_likes (
    user_id UUID NOT NULL,
    post_id UUID NOT NULL,
    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_community_post_likes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_community_post_likes_post FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE
);

CREATE INDEX idx_community_post_likes_post_id ON community_post_likes (post_id);
