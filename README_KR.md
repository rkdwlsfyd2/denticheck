# DentiCheck

[![Hackathon](https://img.shields.io/badge/DeveloperWeek-2026_Hackathon-blue)](https://developerweek-2026-hackathon.devpost.com/)
[![Backend](https://img.shields.io/badge/backend-Spring_Boot_3.5.10-brightgreen)](./api)
[![AI Service](https://img.shields.io/badge/ai-FastAPI%20%2B%20YOLOv8-orange)](./ai)
[![Mobile](https://img.shields.io/badge/mobile-Expo_54-black)](./app)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](./LICENSE)


- 공모전: [DeveloperWeek 2026 Hackathon](https://developerweek-2026-hackathon.devpost.com/) (온라인+오프라인, 2026-02-02 ~ 2026-02-20, 종료)
- 레포: <https://github.com/rkdwlsfyd2/denticheck.git>

- English: [README_EN.md](./README_EN.md)

## Why it matters
치과 질환은 통증이 생긴 뒤에야 발견되는 경우가 많아 비용과 치료 부담이 커집니다.  
DentiCheck는 스마트폰 구강 이미지를 AI 기반 사전 점검 결과와 설명 가능한 가이드로 변환합니다.  
목표는 초기 스크리닝 접근성을 높이고, 사용자가 더 빠르게 다음 행동을 결정하도록 돕는 것입니다.

## 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 개발 형태 | 팀 프로젝트 (공모전 + 포트폴리오) |
| 기간 | 2026-02-01 ~ 2026-02-20 |
| 공모전 | DeveloperWeek 2026 Hackathon |
| 내 역할 | AI YOLO 파이프라인, RAG 챗봇, AI 연동 백엔드 |
| 한 줄 소개 | 객체탐지 + RAG 챗봇 + 리포트 생성을 결합한 AI 중심 구강 사전 점검 플랫폼 |

## 목차
- [아키텍처](#아키텍처)
- [AI 핵심](#ai-핵심)
- [모델 카드](#모델-카드)
- [핵심 기능](#핵심-기능)
- [API 스펙](#api-스펙)
- [기술 스택](#기술-스택)
- [재현성 및 실행](#재현성-및-실행)
- [테스트 및 검증](#테스트-및-검증)
- [보안 개인정보 윤리](#보안-개인정보-윤리)
- [한계와 로드맵](#한계와-로드맵)
- [트러블슈팅](#트러블슈팅)
- [Contributing](#contributing)
- [License](#license)
- [How to verify](#how-to-verify)

## 아키텍처
```text
[모바일 앱 (Expo)]         [관리자 콘솔 (React/Vite)]
          |                          |
          +----------- HTTPS --------+
                       |
                [API 서버]
        Spring Boot (REST + GraphQL)
                       |
         +-------------+-------------+
         |                           |
   [AI 서비스]                   [PostgreSQL]
 FastAPI (YOLO + RAG)          앱/데이터/로그
         |
   +-----+------+
   |            |
[Milvus]     [Ollama]
Vector DB    LLM (llama3.2:3b)
```

## AI 핵심

### 문제 정의 (입력/출력)
- 입력
  - 구강 이미지 (`jpg/jpeg/png/webp`)
  - 사용자 챗봇 질문 텍스트
  - 리포트 생성을 위한 문진/이력 메타데이터
- 출력
  - 질환 라벨 + 바운딩박스 + confidence
  - 이미지 품질 점수(`pass`, reasons, score)
  - RAG 근거 기반 챗봇 답변
  - 구조화된 AI 리포트 payload (+ 백엔드 PDF URL 플로우)

### 모델/접근 방식
- 모델 유형
  - 4-클래스 객체 탐지
  - RAG 챗봇 (검색 + 생성)
  - 리포트용 규칙/LLM 요약
- 사용 모델/라이브러리
  - `ultralytics` YOLOv8
  - FastAPI
  - LangChain + Milvus + Ollama (`llama3.2:3b`)
  - HuggingFace 임베딩 (`jhgan/ko-sroberta-multitask`)
- 특징/임베딩
  - 비전: YOLO 내부 특징
  - 텍스트: 밀집 임베딩 + Milvus 벡터 검색

### 데이터
- 출처
  - `ai/data/snudh_knowledge.json`의 치의학 지식 코퍼스 (레포 내 수록)
  - YOLO 라벨 구성: `ai/yolo/data.yaml`
- 규모
  - 탐지 클래스: `caries`, `tartar`, `oral_cancer`, `normal` (총 4개)
  - 지식 항목: 323개 (`"title"` 패턴 카운트 기준)
  - 탐지 학습 샘플 수: [TBD]
- 전처리/라벨링
  - RAG: 문서 분할(`chunk_size=1000`, `chunk_overlap=100`) 후 임베딩 저장
  - 탐지: 서비스 레벨 라벨 정규화(`cavity -> caries` 등)

### 학습/추론 파이프라인

| 단계 | 탐지 파이프라인 | RAG 파이프라인 |
|---|---|---|
| 학습/빌드 | YOLO 학습 결과물 `ai/yolo/runs/4class_s_100` | JSON 코퍼스 임베딩 후 Milvus 적재 |
| 추론 1단계 | 이미지 품질 검사 (`/v1/quality`) | Milvus top-k 검색 |
| 추론 2단계 | YOLO 추론 (`/v1/detect`) | 프롬프트 구성 + LLM 응답 (`/v1/chat/ask`) |
| 추론 3단계 | 백엔드 오케스트레이션 + 리포트 조합 | 리포트 텍스트 생성 (`/v1/report/generate`) |
| 배포 방식 | 실시간 API | 실시간 API |

### 평가
- 지표
  - YOLO 결과 파일: `ai/yolo/runs/4class_s_100/results.csv` (epoch 100)
  - Precision: `0.82461`
  - Recall: `0.79513`
  - mAP@50: `0.81616`
  - mAP@50-95: `0.65235`
- 지연
  - End-to-end latency: [TBD]
- 비용
  - Ollama 로컬 경로 지원(기본 실행 시 외부 유료 LLM 필수 아님)
- 에러 분석 (대표 케이스)
  - 저조도/흔들림 이미지에서 탐지 성능 저하.
  - 구강이 아닌 이미지 또는 구강 영역이 부분만 촬영된 경우 빈 탐지 가능.
  - 품질 체크 엔드포인트가 현재 스텁 성격이라 저품질 이미지 필터링이 약함.

## 모델 카드

| 항목 | 내용 |
|---|---|
| 모델명 | DentiCheck YOLOv8 4-class detector |
| 목적 | 구강 이미지 기반 사전 시각 점검 보조 |
| 비목적 | 임상 진단 대체, 응급 트리아지 대체 |
| 입력 | 단일 구강 이미지 |
| 출력 | 라벨, confidence, 정규화 bbox |
| 클래스 | caries, tartar, oral_cancer, normal |
| 학습 데이터 | [TBD: 이미지 수/분할 정보] |
| 보고 지표 | P 0.82461 / R 0.79513 / mAP50 0.81616 / mAP50-95 0.65235 |
| 주의사항 | 의료 면책 고지 필요, 최종 판단은 의료진 확인 필수 |

## 핵심 기능

### 사용자 관점
- 모바일 앱에서 구강 이미지 업로드
- AI 기반 시각적 소견 수신
- 챗봇으로 후속 질문
- 리포트 요약 및 PDF 링크 플로우 확인
- 치과/제품/보험 연계 모듈 탐색(앱/API에 관련 도메인 포함)

### AI/시스템 관점
- FastAPI 라우터: quality/detect/chat/report
- 백엔드 단일 오케스트레이션 엔드포인트(`/api/ai-check`)
- Milvus 검색 + Ollama 생성 결합
- 탐지 라벨 정규화 및 구조화 응답 스키마

## API 스펙

### 1) AI 품질 체크
- Endpoint: `POST /v1/quality`
- Content type: `multipart/form-data` 또는 JSON

```bash
curl -X POST "http://localhost:8000/v1/quality" \
  -F "file=@sample.jpg"
```

```json
{
  "pass_": true,
  "reasons": [],
  "score": 0.98
}
```

### 2) AI 질환 탐지
- Endpoint: `POST /v1/detect`
- Content type: `multipart/form-data` 또는 JSON

```bash
curl -X POST "http://localhost:8000/v1/detect" \
  -F "file=@sample.jpg"
```

```json
{
  "detections": [
    {
      "label": "caries",
      "confidence": 0.91,
      "bbox": { "x": 0.52, "y": 0.41, "w": 0.18, "h": 0.22 }
    }
  ],
  "summary": {
    "caries": { "count": 1, "max_score": 0.91 }
  }
}
```

### 3) RAG 챗봇 질의
- Endpoint: `POST /v1/chat/ask`

```bash
curl -X POST "http://localhost:8000/v1/chat/ask" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"What should I do after tartar scaling?\",\"language\":\"en\"}"
```

```json
{
  "answer": "[TBD: model-generated text]",
  "language": "en"
}
```

### 4) 백엔드 오케스트레이션 AI 체크
- Endpoint: `POST /api/ai-check`
- 서비스: Spring API (`http://localhost:8080`)

```bash
curl -X POST "http://localhost:8080/api/ai-check" \
  -F "file=@sample.jpg"
```

```json
{
  "sessionId": "uuid",
  "status": "done",
  "qualityPass": true,
  "detections": [],
  "summary": {},
  "llmResult": {
    "overall": { "level": "warning", "badgeText": "Moderate", "oneLineSummary": "[TBD]" }
  },
  "pdfUrl": "[TBD]"
}
```

## 기술 스택

| 레이어 | 스택 |
|---|---|
| Frontend (mobile) | Expo 54, React Native 0.81, TypeScript |
| Frontend (admin) | React 18, Vite 5, TailwindCSS |
| Backend | Java 17, Spring Boot 3.5.10, GraphQL, JPA, Flyway |
| AI service | Python 3.11, FastAPI, Ultralytics YOLOv8, LangChain |
| LLM/RAG | Ollama (`llama3.2:3b`), Milvus, HuggingFace embeddings |
| Database | PostgreSQL 15 |
| Infra | Docker Compose |
| DevTools | Gradle, Poetry, npm, pytest/jest (프로젝트 수준) |

## 재현성 및 실행

### Requirements

| 구성요소 | 버전 |
|---|---|
| Docker | 최신 안정 버전 |
| Docker Compose | v2+ |
| Java | 17 |
| Python | 3.11 |
| Node.js | 18+ (LTS 권장) |

### 환경변수 예시 (`.env`)

```env
# AI service
ENV=local
API_URL=
YOLO_MODEL_PATH=models/yolo/weights/best.pt
DETECT_CONF_THRESHOLD=0.05
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=denticheck
MINIO_SECURE=false
MILVUS_URI=http://localhost:19530
COLLECTION_NAME=dental_knowledge
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# API service
SPRING_PROFILES_ACTIVE=local
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/denticheck
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
AI_CLIENT_URL=http://localhost:8000
AI_SERVICE_URL=http://localhost:8000
REPORT_STORAGE_TYPE=local
REPORT_LOCAL_DIR=/tmp/denticheck-reports
REPORT_BASE_URL=http://localhost:8080/reports

# OAuth/JWT secrets
KAKAO_REST_API_KEY=
JWT_SECRET_KEY=
```

### docker-compose 실행 (권장)
```bash
docker compose -f docker-compose.local.yml up -d
```

주요 포트:
- `8080`: Spring API
- `8000`: AI service
- `5432`: PostgreSQL
- `19530`: Milvus
- `11434`: Ollama

### 서비스별 개별 실행

1. AI 서비스
```bash
cd ai
pip install -r requirements.txt
PYTHONPATH=src uvicorn denticheck_ai.api.main:app --reload --port 8000
```

2. API 서버
```bash
cd api
./gradlew bootRun
```

3. 모바일 앱
```bash
cd app
npm install
npm run start
```

4. 관리자 콘솔
```bash
cd console
npm install
npm run dev
```

## 테스트 및 검증

### 1) 헬스체크
```bash
curl http://localhost:8000/health
curl http://localhost:8080/actuator/health
```
참고: `/actuator/health` 노출 여부는 설정에 따라 [TBD].

### 2) 샘플 추론
```bash
curl -X POST "http://localhost:8000/v1/detect" -F "file=@sample.jpg"
```

### 3) E2E 오케스트레이션
```bash
curl -X POST "http://localhost:8080/api/ai-check" -F "file=@sample.jpg"
```

### 4) AI 스모크 테스트 스크립트
```bash
cd ai
bash scripts/smoke_test.sh
```

## 보안 개인정보 윤리
- 데이터 민감도
  - 구강 이미지는 건강 관련 개인정보로 간주하고 민감정보로 처리.

- 키 관리
  - API 키/JWT 비밀값은 환경변수 또는 secret 파일로 주입, 레포 커밋 금지.
- 프롬프트 인젝션/모델 악용 대응
  - RAG grounding으로 응답 근거를 검색 컨텍스트에 제한.

- 의료 안전성
  - 결과는 보조 정보이며 최종 진단은 의료진이 수행.

## 한계와 로드맵

### 현재 한계
1. 품질 체크 엔드포인트가 스텁 수준으로 완전하지 않음.
2. 탐지 데이터셋 규모/분할 문서화가 부족함.
3. E2E 지연/안정성 벤치마크가 공식적으로 정리되지 않음.
4. RAG 출처 품질/인용 검증 체계가 강화 필요.
5. 운영용 PHI 라이프사이클(암호화/보존/삭제 감사) 문서화 미흡.
6. 다국어/프롬프트 하드닝은 부분 구현 상태로 레드팀 검증 미완료.

### 다음 단계 로드맵 (우선순위)
1. P0: 품질 스텁 제거, 실제 CV 품질게이트(blur/exposure/framing) + 임계값 튜닝.
2. P0: 모델/데이터 카드 보강(샘플 수, 분할, 클래스별 지표, 드리프트).
3. P1: E2E 관측성 추가(지연, 에러버짓, 추론비용, 트레이싱).
4. P1: 안전 계층 강화(프롬프트 인젝션 방어, 정책 가드레일, 감사 로그).
5. P2: 검색 품질 향상(재랭킹, 출처 점수화, 인용 confidence 보정).

## 트러블슈팅

| 문제 | 원인 | 해결 |
|---|---|---|
| `:19530` 연결 실패 | Milvus 미기동/비정상 | `docker compose -f docker-compose.local.yml up -d milvus etcd minio` |
| AI 탐지가 비어 있음 | 이미지 품질 불량 또는 모델 경로 오류 | `YOLO_MODEL_PATH` 확인, 샘플 이미지로 재검증 |
| AI 서비스 `ModuleNotFoundError` | Python 의존성 누락 | `pip install -r ai/requirements.txt` |
| API에서 AI 호출 실패 | `AI_CLIENT_URL` 설정 오류 | Docker는 `http://ai:8000`, 로컬은 `http://localhost:8000` |
| 챗봇이 일반론만 답함 | Milvus 미적재 | ingest 실행 후 `dental_knowledge` 컬렉션 확인 |

## Contributing
팀 프로젝트 기준:
1. 이슈에 작업 범위 명시(`ai`, `api`, `app`, `console`).
2. 기능 브랜치 + 작은 PR 단위로 제출.
3. `curl`/스크린샷/로그 기반 재현 절차 포함.

## License
MIT (`LICENSE` 참고).

## How to verify
- [ ] `docker compose -f docker-compose.local.yml up -d` 후 핵심 서비스가 healthy 상태다.
- [ ] `GET http://localhost:8000/health`가 `{"status":"ok","service":"denticheck-ai"}`를 반환한다.
- [ ] `POST /v1/detect`에 샘플 이미지를 넣으면 `detections`, `summary`가 반환된다.
- [ ] `POST /v1/chat/ask`에서 `language="en"` 요청 시 영어 답변이 반환된다.
- [ ] `POST /api/ai-check` 응답에 `sessionId`, `status`, AI 결과 필드가 포함된다.
- [ ] README 지표 값이 `ai/yolo/runs/4class_s_100/results.csv` epoch 100 값과 일치한다.
