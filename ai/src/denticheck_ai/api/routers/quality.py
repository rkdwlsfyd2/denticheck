from fastapi import APIRouter, HTTPException
from denticheck_ai.schemas.quality import QualityCheckRequest, QualityCheckResponse

router = APIRouter(prefix="/v1/quality", tags=["quality"])

@router.post("", response_model=QualityCheckResponse)
async def check_quality(request: QualityCheckRequest):
    # Stub implementation
    # In real implementation, download image provided by storage_key or image_url
    print(f"Checking quality for image: {request.storage_key}")
    
    # Mock result: always pass for now
    return QualityCheckResponse(
        pass_=True,
        reasons=[],
        score=0.98
    )
