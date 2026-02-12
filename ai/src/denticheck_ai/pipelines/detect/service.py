"""
[파일 역할]
YOLOv8 모델을 사용하여 치과 질환(치석, 충치, 병변)을 탐지하는 핵심 서비스 클래스입니다.
이미지 다운로드, 전처리, 추론, 결과 가공의 전체 파이프라인을 관리합니다.
"""

import os
import httpx
import tempfile
from pathlib import Path
from ultralytics import YOLO
from denticheck_ai.core.settings import settings
from denticheck_ai.schemas.detect import DetectResponse, DetectionResult, BBox
from loguru import logger

class DetectionService:
    """
    YOLOv8 기반 질환 탐지 서비스 클래스입니다.
    """
    
    def __init__(self):
        """
        서비스 초기화 및 YOLO 모델 로드
        - 설정된 경로에서 모델 가중치(.pt) 파일을 불러옵니다.
        - 모델 파일이 없을 경우 기본 모델(yolov8n.pt)을 사용합니다.
        """
        # 현재 작업 디렉토리 기준 모델 경로 설정
        model_path = os.path.join(os.getcwd(), settings.YOLO_MODEL_PATH)
        if not os.path.exists(model_path):
            logger.warning(f"모델을 찾을 수 없습니다: {model_path}. 기본 모델(yolov8n.pt)을 로드합니다.")
            self.model = YOLO("yolov8n.pt")
        else:
            self.model = YOLO(model_path)
        logger.info(f"YOLO 모델 로드 완료: {model_path}")

    async def _download_image(self, storage_key: str, image_url: str = None) -> Path:
        """
        이미지 다운로드 및 임시 저장
        - 우선순위 1: 전달된 직접 URL(image_url) 사용
        - 우선순위 2: storage_key(MinIO)를 기반으로 내부 URL 생성
        - 다운로드된 파일은 작업 완료 후 삭제될 수 있도록 임시 경로에 저장합니다.
        """
        target_url = image_url
        if not target_url:
            # MinIO 프로토콜 및 URL 구성
            protocol = "https" if settings.MINIO_SECURE else "http"
            target_url = f"{protocol}://{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET}/{storage_key}"

        tmp_dir = tempfile.gettempdir()
        # 파일명 내 안전하지 않은 문자 처리
        safe_name = storage_key.replace("/", "_")
        tmp_path = Path(tmp_dir) / f"detect_{safe_name}"
        
        logger.info(f"이미지 다운로드 시작: {target_url} -> {tmp_path}")
        
        async with httpx.AsyncClient() as client:
            resp = await client.get(target_url, timeout=30.0)
            resp.raise_for_status()
            tmp_path.write_bytes(resp.content)
            
        return tmp_path

    async def detect(self, storage_key: str, image_url: str = None) -> DetectResponse:
        """
        질환 탐지 실행 메인 메서드
        1. 이미지 다운로드
        2. YOLOv8 모델 추론(Predict)
        3. 결과 데이터를 정해진 스키마(DetectResponse)로 변환
        4. 임시 파일 삭제 및 최종 결과 반환
        """
        image_path = None
        try:
            # 1. 이미지 준비
            image_path = await self._download_image(storage_key, image_url)
            
            # 2. YOLO 추론 (신뢰도 0.25 이상인 것만 탐지)
            results = self.model.predict(source=str(image_path), conf=0.25, verbose=False)
            
            detections = []
            # 질환별 통계 요약 초기화
            summary = {
                "tartar": {"count": 0, "max_score": 0.0}, 
                "caries": {"count": 0, "max_score": 0.0}, 
                "lesion": {"count": 0, "max_score": 0.0}
            }
            
            if len(results) > 0:
                result = results[0]
                for box in result.boxes:
                    cls_id = int(box.cls[0])
                    label = self.model.names[cls_id]
                    
                    # 라벨 칭호 일관성 맞추기 (calculus -> tartar)
                    if label == "calculus": label = "tartar"
                    
                    score = float(box.conf[0])
                    # 이미지 내 등비 좌표 [중심x, 중심y, 너비, 높이] (0~1 사이 값)
                    pxy = box.xywhn[0].tolist()
                    
                    det = DetectionResult(
                        label=label,
                        confidence=score,
                        bbox=BBox(x=pxy[0], y=pxy[1], w=pxy[2], h=pxy[3])
                    )
                    detections.append(det)
                    
                    # 요약 정보(개수 및 최고 신뢰도) 업데이트
                    if label not in summary:
                        summary[label] = {"count": 0, "max_score": 0.0}
                    
                    summary[label]["count"] += 1
                    summary[label]["max_score"] = max(summary[label]["max_score"], score)
            
            return DetectResponse(detections=detections, summary=summary)
            
        except Exception as e:
            logger.error(f"탐지 파이프라인 작동 실패: {str(e)}")
            # 에러 발생 시 시스템 중단을 막기 위해 빈 결과 반환
            return DetectResponse(detections=[], summary={})
        finally:
            # 4. 사용이 끝난 임시 이미지 파일 삭제 (디스크 용량 관리)
            if image_path and image_path.exists():
                try:
                    image_path.unlink()
                except Exception:
                    pass
