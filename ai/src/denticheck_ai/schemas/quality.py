from pydantic import BaseModel
from typing import List, Optional

class QualityCheckRequest(BaseModel):
    storage_key: str
    image_url: Optional[str] = None

class QualityCheckResponse(BaseModel):
    pass_: bool  # 'pass' is a reserved keyword
    reasons: List[str]
    score: float

    class Config:
        populate_by_name = True
        # Map 'pass_' field to 'pass' in JSON
        json_schema_extra = {
            "example": {
                "pass": True,
                "reasons": [],
                "score": 0.95
            }
        }
