-- 게시글-치과 태그 (게시글에 연결된 치과)
CREATE TABLE community_post_dentals (
    post_id UUID NOT NULL,
    dental_id UUID NOT NULL,
    PRIMARY KEY (post_id, dental_id),
    CONSTRAINT fk_community_post_dentals_post FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE,
    CONSTRAINT fk_community_post_dentals_dental FOREIGN KEY (dental_id) REFERENCES dentals (id) ON DELETE CASCADE
);

CREATE INDEX idx_community_post_dentals_dental_id ON community_post_dentals (dental_id);
