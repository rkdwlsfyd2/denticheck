"""
[파일 역할]
DentiCheck AI 서비스의 메인 진입점(Entry Point)입니다.
FastAPI 프레임워크를 사용하여 AI 관련 API 엔드포인트를 노합하고 서버를 실행합니다.

[실행 방법]
uvicorn denticheck_ai.api.main:app --reload --port 8001

[주요 기능]
1. FastAPI 앱 인스턴스 생성 및 설정
2. CORS(Cross-Origin Resource Sharing) 설정 (모든 도메인 허용)
3. 각 기능별(챗봇, 리포트, 품질체크, 탐지) 라우터 등록
4. 헬스체크 및 루트 엔드포인트 제공
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from denticheck_ai.api.routers import chat, report, quality, detect

# FastAPI 앱 초기화
app = FastAPI(
    title="DentiCheck AI Service", 
    description="치과 AI 분석 및 챗봇 서비스를 제공하는 API 서버",
    version="0.1.0"
)

# CORS 설정: 프론트엔드 및 백엔드와의 원활한 통신을 위해 모든 오리진 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 기능별 AI 라우터 등록 (기능 분할 관리)
app.include_router(chat.router)    # RAG 기반 챗봇 서비스
app.include_router(report.router)  # LLM 기반 소견서 생성 서비스
app.include_router(quality.router) # 이미지 품질 검사 서비스
app.include_router(detect.router)  # YOLO 기반 치과 질환 탐지 서비스

@app.get("/health", tags=["System"])
def health_check():
    """서버 상태 확인용 엔드포인트"""
    return {"status": "ok", "service": "denticheck-ai"}

@app.get("/", tags=["System"])
async def root():
    """루트 경로 접속 시 안내 메시지 반환"""
    return {"message": "Denticheck AI Service is running. Documentation: /docs"}
