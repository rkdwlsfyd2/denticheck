-- 게시글-치과 태그 테이블을 복합 PK → 단일 UUID PK로 변경 (CommunityPostDentalId 제거)
ALTER TABLE community_post_dentals ADD COLUMN id UUID;

UPDATE community_post_dentals SET id = gen_random_uuid() WHERE id IS NULL;

ALTER TABLE community_post_dentals ALTER COLUMN id SET NOT NULL;

ALTER TABLE community_post_dentals DROP CONSTRAINT community_post_dentals_pkey;

ALTER TABLE community_post_dentals ADD PRIMARY KEY (id);

ALTER TABLE community_post_dentals ADD CONSTRAINT uq_community_post_dentals_post_dental UNIQUE (post_id, dental_id);
