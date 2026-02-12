"""
[파일 역할]
YOLO 모델을 사용하여 이미지 내 치과 질환(치석, 충치, 병변 등)을 탐지하는 API 라우터입니다.
"""

from fastapi import APIRouter, HTTPException
from denticheck_ai.schemas.detect import DetectRequest, DetectResponse
from denticheck_ai.pipelines.detect.service import DetectionService
from loguru import logger

# 라우터 설정: /v1/detect 경로로 요청을 처리합니다.
router = APIRouter(prefix="/v1/detect", tags=["detect"])

# 객체 탐지 핵심 로직을 담당하는 DetectionService 인스턴스
detector = DetectionService()

@router.post("", response_model=DetectResponse, summary="질환 탐지 실행")
async def detect_objects(request: DetectRequest):
    """
    업로드된 이미지에서 치과 질환을 자동으로 찾아냅니다.
    
    1. 요청으로부터 storage_key(MinIO 파일명) 또는 image_url 획득
    2. DetectionService를 통해 YOLOv8 모델 추론 실행
    3. 탐지된 객체의 좌표(bbox), 신뢰도(confidence), 라벨(label) 반환
    """
    logger.info(f"질환 탐지 요청 수신: storage_key={request.storage_key}")
    try:
        # YOLO 파이프라인 호출
        result = await detector.detect(
            storage_key=request.storage_key,
            image_url=request.image_url
        )
        return result
    except Exception as e:
        logger.error(f"질환 탐지 실패: {str(e)}")
        # 사용자에게는 상세 에러 대신 정제된 메시지 반환
        raise HTTPException(status_code=500, detail="이미지 분석(YOLO) 중 오류가 발생했습니다.")
