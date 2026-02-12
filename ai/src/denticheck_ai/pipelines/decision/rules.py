"""
[파일 역할]
분석 결과(YOLO, ML, 설문 등)를 종합하여 최종적인 건강 등급과 권장 조치를 결정하는 '의사결정 규칙(Rule Engine)' 파일입니다.
결정론적(Deterministic) 비즈니스 로직을 통해 서비스 레이어에서 사용할 최종 등급을 산출합니다.
"""

from typing import List, Dict
from .decision_model import (
    DecisionRecord, OverallResult, RecommendedAction
)

def evaluate_overall_risk(record: DecisionRecord) -> OverallResult:
    """
    모든 분석 결과를 기반으로 종합 위험도를 평가합니다.
    
    [판단 우선순위]
    1. 구강 내 병변(Lesion) 발견 시: 즉시 병원 방문 권고
    2. 충치(Caries): 발견 시 '주의', 3개 이상 시 '병원 방문' 격상
    3. 치석: 발견 시 '주의' 및 구강 관리 루틴 제안
    """
    yolo = record.yolo
    survey = record.survey

    reasons = []    # 판단 근거 저장
    actions = []    # 권장 조치 저장
    safety_flags = {"lesion_caution_text_required": False} # 특이사항 플래그
    
    level = "normal" # 기본 등급: 정상

    # 1단계: 직접적인 병변(Lesion) 탐지 여부 확인 (최우선 순위)
    if yolo.summary.get("lesion", {}).get("present"):
        reasons.append("lesion_detected")
        level = "recommend_visit" # 병원 방문 권고로 등급 설정
        safety_flags["lesion_caution_text_required"] = True
        actions.append(RecommendedAction(code="hospital_visit_lesion", priority="high"))

    # 2단계: 치석(Calculus/Tartar) 탐지 확인
    # yolo 라벨 상의 calculus는 서비스에서 tartar로 통칭함
    if yolo.summary.get("calculus", {}).get("present") or yolo.summary.get("tartar", {}).get("present"):
        reasons.append("calculus_present")
        if level == "normal":
            level = "attention"
        actions.append(RecommendedAction(code="scaling_consult", priority="medium"))
    
    # 3단계: 충치(Caries) 탐지 확인 및 개수에 따른 가중치
    if yolo.summary.get("caries", {}).get("present"):
        reasons.append("caries_detected")
        if level == "normal":
            level = "attention"
        
        # 충치가 3개 이상 발견되면 등급 상향
        if yolo.summary.get("caries", {}).get("count", 0) >= 3:
             level = "recommend_visit"
        actions.append(RecommendedAction(code="cavity_care", priority="medium"))

    # 특이사항 없는 경우 기본 관리 안내
    if level == "normal":
        actions.append(RecommendedAction(code="maintain_routine", priority="low"))

    return OverallResult(
        level=level,
        reasons=reasons,
        recommended_actions=actions,
        safety_flags=safety_flags
    )
