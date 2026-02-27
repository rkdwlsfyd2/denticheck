# DentiCheck

[![Hackathon](https://img.shields.io/badge/DeveloperWeek-2026_Hackathon-blue)](https://developerweek-2026-hackathon.devpost.com/)
[![Backend](https://img.shields.io/badge/backend-Spring_Boot_3.5.10-brightgreen)](./api)
[![AI Service](https://img.shields.io/badge/ai-FastAPI%20%2B%20YOLOv8-orange)](./ai)
[![Mobile](https://img.shields.io/badge/mobile-Expo_54-black)](./app)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](./LICENSE)


- Devpost context: [DeveloperWeek 2026 Hackathon](https://developerweek-2026-hackathon.devpost.com/) (online + in-person, Feb 2-20, 2026, ended)
- Repository: <https://github.com/rkdwlsfyd2/denticheck.git>

## Why it matters
Most dental issues are discovered late, after pain or cost has already increased.  
DentiCheck turns a smartphone oral image into AI-assisted findings plus explainable guidance.  
The goal is to lower access friction to preliminary screening and help users decide next actions earlier.

## Project snapshot

| Item | Details |
|---|---|
| Project type | Team project (hackathon + portfolio) |
| Period | 2026-02-01 to 2026-02-20 |
| Contest | DeveloperWeek 2026 Hackathon |
| My role | AI YOLO pipeline, RAG chatbot, backend integration for AI endpoints |
| One-line intro | AI-first oral health pre-screening platform with object detection + RAG chatbot + report generation |

## Table of contents
- [Architecture](#architecture)
- [AI core](#ai-core)
- [Model Card](#model-card)
- [Product features](#product-features)
- [API spec](#api-spec)
- [Tech stack](#tech-stack)
- [Reproducibility and runbook](#reproducibility-and-runbook)
- [Testing and validation](#testing-and-validation)
- [Security privacy ethics](#security-privacy-ethics)
- [Limitations and roadmap](#limitations-and-roadmap)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [How to verify](#how-to-verify)

## Architecture
```text
[Mobile App (Expo)]        [Admin Console (React/Vite)]
          |                          |
          +----------- HTTPS --------+
                       |
                [API Server]
        Spring Boot (REST + GraphQL)
                       |
         +-------------+-------------+
         |                           |
   [AI Service]                 [PostgreSQL]
 FastAPI (YOLO + RAG)         App/Data/Logs
         |
   +-----+------+
   |            |
[Milvus]     [Ollama]
Vector DB    LLM (llama3.2:3b)
```

## AI core

### Problem definition (input/output)
- Input
  - Oral images (`jpg/jpeg/png/webp`)
  - User chat questions (text)
  - Survey/history metadata for report generation
- Output
  - Detection labels + bounding boxes + confidence
  - Quality gate score (`pass`, reasons, score)
  - RAG-grounded chatbot answer
  - Structured AI report payload (+ PDF URL flow in backend)

### Approach and models
- Model type
  - Multi-class object detection (4 classes)
  - RAG chatbot (retrieval + generation)
  - Rule/LLM-assisted summarization for report
- Libraries/models used
  - `ultralytics` YOLOv8
  - FastAPI
  - LangChain + Milvus + Ollama (`llama3.2:3b`)
  - HuggingFace embeddings (`jhgan/ko-sroberta-multitask`)
- Feature representation
  - Vision: YOLO internal features
  - Text: dense embeddings in Milvus

### Data
- Source
  - Dental knowledge corpus in `ai/data/snudh_knowledge.json` (SNUDH-origin content in repository)
  - YOLO label config in `ai/yolo/data.yaml`
- Scale
  - Detection classes: `caries`, `tartar`, `oral_cancer`, `normal` (4 classes)
  - Knowledge items: 323 entries (`"title"` count in dataset file)

- Preprocessing/labeling
  - RAG: document split (`chunk_size=1000`, `chunk_overlap=100`) then vectorized and ingested to Milvus
  - Detection: class normalization mapping in service layer (`cavity -> caries`, etc.)

### Training and inference pipeline

| Stage | Detection pipeline | RAG pipeline |
|---|---|---|
| Training/Build | YOLO training artifacts stored under `ai/yolo/runs/4class_s_100` | Ingest JSON corpus -> embed -> store in Milvus |
| Inference step 1 | Image quality check (`/v1/quality`) | Retrieve top-k contexts from Milvus |
| Inference step 2 | YOLO predict (`/v1/detect`) | Prompt compose + LLM answer (`/v1/chat/ask`) |
| Inference step 3 | Backend orchestration + report assembly | Report text generation (`/v1/report/generate`) |
| Serving mode | Real-time API | Real-time API |

### Evaluation
- Metrics
  - YOLO run file: `ai/yolo/runs/4class_s_100/results.csv` (epoch 100)
  - Precision: `0.82461`
  - Recall: `0.79513`
  - mAP@50: `0.81616`
  - mAP@50-95: `0.65235`
- Latency
  - End-to-end latency: [TBD]
- Cost
  - Local Ollama path available (no hosted LLM required for baseline run)
- Error analysis (observed/expected)
  - Low-light or blurry image reduces detection reliability.
  - Non-oral or partial oral images can produce weak/empty detections.
  - Quality endpoint is currently a stub returning pass in most paths, so bad images can leak into detection.

## Model Card

| Field | Details |
|---|---|
| Model name | DentiCheck YOLOv8 4-class detector |
| Intended use | Preliminary visual screening support for oral images |
| Not intended for | Clinical diagnosis or emergency triage replacement |
| Inputs | Single oral image |
| Outputs | Label(s), confidence, normalized bbox |
| Classes | caries, tartar, oral_cancer, normal |
| Training data | [TBD: image count/split specifics] |
| Reported metrics | P 0.82461 / R 0.79513 / mAP50 0.81616 / mAP50-95 0.65235 |
| Safety notes | Must include medical disclaimer; human professional confirmation required |

## Product features

### User-facing features
- Upload oral image from mobile app
- Receive AI-based visual findings
- Ask follow-up questions through chatbot
- Get report summary and PDF link flow
- Browse related dental ecosystem features (dentist/product/insurance modules exist in app/api)

### AI-facing/system features
- FastAPI routers for quality, detect, chat, report
- Backend orchestration endpoint for one-call AI check (`/api/ai-check`)
- Milvus retrieval integration with Ollama generation
- Detection label normalization and structured response schemas

## API spec

### 1) AI quality check
- Endpoint: `POST /v1/quality`
- Content type: `multipart/form-data` or JSON

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

### 2) AI detection
- Endpoint: `POST /v1/detect`
- Content type: `multipart/form-data` or JSON

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

### 3) RAG chat ask
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

### 4) Backend orchestrated AI check
- Endpoint: `POST /api/ai-check`
- Service: Spring Boot API (`http://localhost:8080`)

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

## Tech stack

| Layer | Stack |
|---|---|
| Frontend (mobile) | Expo 54, React Native 0.81, TypeScript |
| Frontend (admin) | React 18, Vite 5, TailwindCSS |
| Backend | Java 17, Spring Boot 3.5.10, GraphQL, JPA, Flyway |
| AI service | Python 3.11, FastAPI, Ultralytics YOLOv8, LangChain |
| LLM/RAG | Ollama (`llama3.2:3b`), Milvus, HuggingFace embeddings |
| Database | PostgreSQL 15 |
| Infra | Docker Compose |
| Dev tools | Gradle, Poetry, npm, pytest/jest (project-level) |

## Reproducibility and runbook

### Requirements

| Component | Version |
|---|---|
| Docker | latest stable |
| Docker Compose | v2+ |
| Java | 17 |
| Python | 3.11 |
| Node.js | 18+ (LTS recommended) |

### Environment variables (`.env` example)

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

### Run with docker compose (recommended)
```bash
docker compose -f docker-compose.local.yml up -d
```

Expected main ports:
- `8080`: Spring API
- `8000`: AI service
- `5432`: PostgreSQL
- `19530`: Milvus
- `11434`: Ollama

### Run each service manually

1. AI service
```bash
cd ai
pip install -r requirements.txt
PYTHONPATH=src uvicorn denticheck_ai.api.main:app --reload --port 8000
```

2. API service
```bash
cd api
./gradlew bootRun
```

3. Mobile app
```bash
cd app
npm install
npm run start
```

4. Admin console
```bash
cd console
npm install
npm run dev
```

## Testing and validation

### 1) Health check
```bash
curl http://localhost:8000/health
curl http://localhost:8080/actuator/health
```
Note: `/actuator/health` availability is profile-dependent ([TBD] if disabled).

### 2) Sample AI inference
```bash
curl -X POST "http://localhost:8000/v1/detect" -F "file=@sample.jpg"
```

### 3) End-to-end orchestration check
```bash
curl -X POST "http://localhost:8080/api/ai-check" -F "file=@sample.jpg"
```

### 4) AI smoke script
```bash
cd ai
bash scripts/smoke_test.sh
```

## Security privacy ethics
- Data sensitivity
  - Oral images are health-related personal data; treat as sensitive.
- Storage policy
  - Local upload/report paths exist; production retention/deletion policy is [TBD].
- Secret management
  - API keys and JWT secrets should be supplied via env/secret files, not committed.
- Prompt-injection/model abuse
  - RAG grounding is used to constrain responses to retrieved contexts.
  - Additional policy filtering and jailbreak defense are [TBD].
- Clinical safety
  - Outputs are assistive only; final diagnosis must be made by licensed professionals.

## Limitations and roadmap

### Current limitations
1. Quality check endpoint is currently stub-like and not fully robust.
2. Detection dataset size/split documentation is incomplete (`[TBD]`).
3. End-to-end latency and reliability benchmarks are not yet formally reported.
4. RAG source governance/citation quality control needs stronger evaluation.
5. Production-grade PHI lifecycle policy (encryption/retention/deletion audit) is not fully documented.
6. Multilingual behavior/prompt-hardening is partially implemented, not formally red-teamed.

### Next roadmap (priority)
1. P0: Replace quality stub with real CV quality-gate (blur, exposure, framing) and threshold tuning.
2. P0: Add full model/data card (dataset counts, split strategy, per-class metrics, drift checks).
3. P1: Add e2e observability (latency, error budget, cost per inference, tracing).
4. P1: Harden safety layer (prompt-injection defense, response policy guardrails, audit logs).
5. P2: Improve retrieval quality with source scoring/reranking and citation confidence calibration.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| `Connection refused` to `:19530` | Milvus not healthy | `docker compose -f docker-compose.local.yml up -d milvus etcd minio` |
| AI returns empty detections | Bad image or model path issue | Check `YOLO_MODEL_PATH`, test with known sample image |
| `ModuleNotFoundError` in AI service | Python deps missing | `pip install -r ai/requirements.txt` |
| API cannot call AI service | Wrong `AI_CLIENT_URL` | Set `AI_CLIENT_URL=http://ai:8000` in docker or localhost in local |
| Chat answers are generic | Milvus not ingested | Run ingest script and verify `dental_knowledge` collection exists |

## Contributing
Team project. For changes:
1. Open an issue with scope (`ai`, `api`, `app`, `console`).
2. Use feature branches and small PRs.
3. Include reproducible test steps (`curl`/screenshots/log snippets).

## License
MIT (see `LICENSE`).

## How to verify
- [ ] `docker compose -f docker-compose.local.yml up -d` completes with healthy core services.
- [ ] `GET http://localhost:8000/health` returns `{"status":"ok","service":"denticheck-ai"}`.
- [ ] `POST /v1/detect` with a local sample image returns `detections` and `summary`.
- [ ] `POST /v1/chat/ask` returns an English answer when `language="en"`.
- [ ] `POST /api/ai-check` returns orchestration payload with `sessionId`, `status`, and AI fields.
- [ ] YOLO metric values in this README match `ai/yolo/runs/4class_s_100/results.csv` epoch 100.
