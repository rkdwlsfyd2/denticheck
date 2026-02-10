from fastapi import APIRouter
from denticheck_ai.schemas.detect import DetectRequest, DetectResponse, DetectionResult, BBox

router = APIRouter(prefix="/v1/detect", tags=["detect"])

@router.post("", response_model=DetectResponse)
async def detect_objects(request: DetectRequest):
    # Stub: return dummy detections
    print(f"Running detection on: {request.storage_key}")
    
    return DetectResponse(
        detections=[
            DetectionResult(
                label="calculus",
                confidence=0.85,
                bbox=BBox(x=0.1, y=0.1, w=0.2, h=0.2)
            )
        ],
        summary={
            "calculus": {"count": 1, "max_score": 0.85},
            "caries": {"count": 0},
            "lesion": {"count": 0}
        }
    )
