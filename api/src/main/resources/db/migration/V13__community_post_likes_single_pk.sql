-- 좋아요 테이블을 복합 PK → 단일 UUID PK로 변경 (CommunityPostLikeId 제거)
ALTER TABLE community_post_likes ADD COLUMN id UUID;

UPDATE community_post_likes SET id = gen_random_uuid() WHERE id IS NULL;

ALTER TABLE community_post_likes ALTER COLUMN id SET NOT NULL;

ALTER TABLE community_post_likes DROP CONSTRAINT community_post_likes_pkey;

ALTER TABLE community_post_likes ADD PRIMARY KEY (id);

ALTER TABLE community_post_likes ADD CONSTRAINT uq_community_post_likes_user_post UNIQUE (user_id, post_id);
