-- 1. 채팅 세션 테이블 생성
CREATE TABLE chat_sessions (
    id UUID NOT NULL,
    user_id UUID NOT NULL,
    channel TEXT NOT NULL DEFAULT 'oral_faq',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT pk_chat_sessions PRIMARY KEY (id),
    CONSTRAINT fk_chat_sessions_users FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 2. AI 채팅 메시지 테이블 생성
CREATE TABLE ai_chat_messages (
    id UUID NOT NULL,
    session_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    citation JSONB, -- RAG 출처 (선택)
    language VARCHAR(10) NOT NULL DEFAULT 'ko',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT pk_ai_chat_messages PRIMARY KEY (id),
    CONSTRAINT fk_ai_chat_messages_session FOREIGN KEY (session_id) REFERENCES chat_sessions (id)
);

-- 3. 기존 ai_reports 데이터 초기화 (FK 변경을 위해 필수)
TRUNCATE TABLE ai_reports;

-- 4. ai_reports 테이블 구조 변경
-- 4-1. 기존 FK 삭제
ALTER TABLE ai_reports DROP CONSTRAINT fk_ai_reports_session;

ALTER TABLE ai_reports DROP CONSTRAINT uc_ai_reports_session;

-- 4-2. 컬럼 추가
ALTER TABLE ai_reports
ADD COLUMN language VARCHAR(10) NOT NULL DEFAULT 'ko';

-- 4-3. 새로운 FK 추가 (chat_sessions 참조)
ALTER TABLE ai_reports
ADD CONSTRAINT fk_ai_reports_chat_session FOREIGN KEY (session_id) REFERENCES chat_sessions (id);

-- 4-4. 유니크 제약조건 재설정
ALTER TABLE ai_reports
ADD CONSTRAINT uc_ai_reports_chat_session UNIQUE (session_id);