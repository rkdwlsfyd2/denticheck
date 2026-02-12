import os
import json
import glob
import datetime
from pathlib import Path

from ultralytics import YOLO

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from PIL import Image

# ======================
# 설정
# ======================
NAMES = ["caries", "tartar", "oral_cancer", "normal"]

BEST_PT = r"C:\Users\User\Downloads\oral_4class_caries_tartar_oralcancer_normal\runs\4class_s_100\weights\best.pt"

# ✅ 사용자가 지정한 폴더: Downloads 안의 caries*.avif
DOWNLOADS_DIR = r"C:\Users\User\Downloads"
AVIF_PATTERN = "caries*.avif"

# 추론 설정
CONF_TH = 0.25
IMGSZ = 640

# 출력 폴더(Downloads 안에 결과를 모아두자)
OUT_DIR = os.path.join(DOWNLOADS_DIR, "denticheck_poc_reports")


# ======================
# 폰트 등록 (한글)
# ======================
def register_korean_fonts():
    regular = r"C:\Windows\Fonts\malgun.ttf"
    bold = r"C:\Windows\Fonts\malgunbd.ttf"

    if not os.path.exists(regular):
        raise FileNotFoundError(f"한글 폰트 없음: {regular}")

    pdfmetrics.registerFont(TTFont("KOR", regular))

    if os.path.exists(bold):
        pdfmetrics.registerFont(TTFont("KOR_B", bold))
        return "KOR", "KOR_B"

    return "KOR", "KOR"


# ======================
# AVIF -> PNG 변환
# ======================
def ensure_pillow_can_open_avif():
    """
    Pillow는 기본으로 AVIF를 못 열 수 있음.
    pillow-avif-plugin이 설치되어 있으면 열 수 있다.
    """
    try:
        import pillow_avif  # noqa: F401
        return True
    except Exception:
        return False


def avif_to_png(avif_path: str, out_dir: str) -> str:
    """
    AVIF를 PNG로 변환해서 반환.
    """
    os.makedirs(out_dir, exist_ok=True)
    png_path = os.path.join(out_dir, Path(avif_path).stem + ".png")

    # pillow-avif-plugin이 없으면 여기서 실패할 수 있음
    img = Image.open(avif_path).convert("RGB")
    img.save(png_path, "PNG")
    return png_path


# ======================
# YOLO 추론
# ======================
def run_yolo_inference(image_path: str):
    model = YOLO(BEST_PT)
    result = model.predict(source=image_path, imgsz=IMGSZ, conf=CONF_TH, verbose=False)[0]

    dets = []
    if result.boxes is None or len(result.boxes) == 0:
        return dets

    xywhn = result.boxes.xywhn.cpu().numpy()
    confs = result.boxes.conf.cpu().numpy()
    clss = result.boxes.cls.cpu().numpy().astype(int)

    for (x, y, w, h), conf, cls in zip(xywhn, confs, clss):
        label = NAMES[cls] if 0 <= cls < len(NAMES) else str(cls)
        dets.append({
            "label": label,
            "class_id": int(cls),
            "confidence": float(conf),
            "bbox": {"x": float(x), "y": float(y), "w": float(w), "h": float(h)}
        })
    return dets


def summarize_detections(dets):
    summary = {name: {"present": False, "count": 0, "max_score": 0.0, "area_ratio": 0.0} for name in NAMES}
    area_sum = {name: 0.0 for name in NAMES}

    for d in dets:
        label = d["label"]
        conf = d["confidence"] or 0.0
        if conf < CONF_TH:
            continue

        w = max(d["bbox"]["w"], 0.0)
        h = max(d["bbox"]["h"], 0.0)
        area = w * h

        area_sum[label] += area
        s = summary[label]
        s["present"] = True
        s["count"] += 1
        s["max_score"] = max(s["max_score"], conf)

    for label in NAMES:
        summary[label]["area_ratio"] = round(area_sum[label], 4)

    return summary


def overall_rule(yolo_summary):
    if yolo_summary["oral_cancer"]["present"] and yolo_summary["oral_cancer"]["max_score"] >= 0.5:
        return ("RED", ["oral_cancer_present"])

    if yolo_summary["caries"]["present"] or yolo_summary["tartar"]["present"]:
        reasons = []
        if yolo_summary["caries"]["present"]:
            reasons.append("caries_present")
        if yolo_summary["tartar"]["present"]:
            reasons.append("tartar_present")
        return ("YELLOW", reasons)

    return ("GREEN", ["no_findings"])


def build_nlg(yolo_summary, overall_level):
    caries = yolo_summary["caries"]
    tartar = yolo_summary["tartar"]
    oc = yolo_summary["oral_cancer"]

    if overall_level == "RED":
        summary = "구강 병변 의심 소견이 있어 빠른 확인을 권장합니다"
    elif overall_level == "YELLOW":
        if caries["present"] and tartar["present"]:
            summary = "충치와 치석 소견이 관찰되어 관리 및 상담을 권장합니다"
        elif caries["present"]:
            summary = "충치 소견이 관찰되어 관리 및 상담을 권장합니다"
        else:
            summary = "치석 소견이 관찰되어 스케일링 상담을 권장합니다"
    else:
        summary = "특이 소견이 뚜렷하지 않아 현재 상태를 유지하는 관리가 권장됩니다"

    lines = []
    lines.append("1. 관찰 요약")
    if caries["present"]:
        lines.append(f"- 충치(caries): {caries['count']}건, 최대 신뢰도 {caries['max_score']:.2f}")
    if tartar["present"]:
        lines.append(f"- 치석(tartar): {tartar['count']}건, 최대 신뢰도 {tartar['max_score']:.2f}")
    if oc["present"]:
        lines.append(f"- 구강 병변(oral_cancer): {oc['count']}건, 최대 신뢰도 {oc['max_score']:.2f}")
    if not (caries["present"] or tartar["present"] or oc["present"]):
        lines.append("- 탐지된 항목이 없습니다(정상일 수 있으며, 촬영 조건에 따라 달라질 수 있습니다).")

    lines.append("")
    lines.append("2. 권고(행동)")
    if overall_level == "RED":
        lines.append("- 빠른 시일 내 치과/의료진 상담을 권장합니다.")
        lines.append("- 통증/출혈/크기 변화가 있으면 지체하지 말고 진료를 권장합니다.")
    elif overall_level == "YELLOW":
        if tartar["present"]:
            lines.append("- 스케일링(치석 제거) 상담을 권장합니다.")
        if caries["present"]:
            lines.append("- 충치 의심 부위는 치과 검진으로 확인을 권장합니다.")
    else:
        lines.append("- 현재의 양치 습관을 유지하고, 정기 검진을 권장합니다.")

    lines.append("")
    lines.append("3. 관리 루틴(예시)")
    lines.append("- 하루 2~3회 2분 이상 꼼꼼히 양치하기")
    lines.append("- 치실/치간칫솔 사용(가능하면 매일)")
    lines.append("- 단 음식/탄산 섭취 후 물로 헹구기")

    details = "\n".join(lines)

    disclaimer = (
        "본 리포트는 입력된 이미지에 대한 AI 스크리닝 결과이며 의료 진단/확진이 아닙니다.\n"
        "증상이 지속되거나 악화되면 반드시 의료진 상담 및 검진을 받으시기 바랍니다."
    )
    return summary, details, disclaimer


def make_pdf(output_pdf, projection, image_path=None):
    font_regular, font_bold = register_korean_fonts()

    c = canvas.Canvas(output_pdf, pagesize=A4)
    w, h = A4

    c.setFont(font_bold, 16)
    c.drawString(20 * mm, h - 20 * mm, "DentiCheck AI Report (POC)")

    c.setFont(font_regular, 9)
    c.drawString(
        20 * mm, h - 27 * mm,
        f"Session: {projection['meta']['session_id']}   Generated: {projection['meta']['generated_at']}   Level: {projection['decision']['overall']['level']}"
    )

    c.setFont(font_bold, 13)
    c.drawString(20 * mm, h - 40 * mm, projection["nlg"]["summary"])

    c.setFont(font_bold, 11)
    c.drawString(20 * mm, h - 55 * mm, "Key Metrics")
    c.setFont(font_regular, 10)

    y = h - 62 * mm
    for k in ["caries", "tartar", "oral_cancer", "normal"]:
        s = projection["decision"]["yolo"]["summary"][k]
        line = f"- {k}: present={s['present']} count={s['count']} max={s['max_score']:.2f} area_ratio={s['area_ratio']:.4f}"
        c.drawString(22 * mm, y, line)
        y -= 6 * mm

    c.setFont(font_bold, 11)
    c.drawString(20 * mm, y - 5 * mm, "Details")
    y -= 12 * mm

    c.setFont(font_regular, 10)
    text_obj = c.beginText(20 * mm, y)
    for line in projection["nlg"]["details"].splitlines():
        text_obj.textLine(line)
    c.drawText(text_obj)

    # 이미지 첨부
    if image_path and os.path.exists(image_path):
        try:
            img = Image.open(image_path)
            img_w, img_h = img.size
            max_w = 90 * mm
            scale = max_w / img_w
            draw_w = max_w
            draw_h = img_h * scale
            c.drawImage(
                image_path,
                w - draw_w - 20 * mm,
                20 * mm,
                width=draw_w,
                height=draw_h,
                preserveAspectRatio=True,
                mask="auto",
            )
        except Exception:
            pass

    c.setFont(font_regular, 8)
    footer_y = 12 * mm
    for i, line in enumerate(projection["nlg"]["disclaimer"].splitlines()):
        c.drawString(20 * mm, footer_y + (i * 4 * mm), line)

    c.showPage()
    c.save()


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    # 1) Downloads에서 caries*.avif 찾기
    avifs = sorted(glob.glob(os.path.join(DOWNLOADS_DIR, AVIF_PATTERN)))
    if not avifs:
        raise FileNotFoundError(f"'{DOWNLOADS_DIR}'에서 '{AVIF_PATTERN}' 파일을 찾지 못했습니다.")

    avif_path = avifs[0]
    print("[INFO] AVIF found:", avif_path)

    # 2) AVIF 열기 가능 여부 체크
    if not ensure_pillow_can_open_avif():
        print("[WARN] pillow-avif-plugin이 없어 AVIF를 못 열 수 있습니다.")
        print("       아래 명령으로 설치 후 다시 실행하세요:")
        print("       pip install pillow-avif-plugin")

    # 3) AVIF -> PNG 변환
    png_path = avif_to_png(avif_path, OUT_DIR)
    print("[INFO] Converted to PNG:", png_path)

    # 4) YOLO 추론
    dets = run_yolo_inference(png_path)
    print("[INFO] detections:", len(dets))

    # 5) Decision/NLG
    yolo_summary = summarize_detections(dets)
    level, reasons = overall_rule(yolo_summary)
    nlg_summary, nlg_details, nlg_disclaimer = build_nlg(yolo_summary, level)

    decision_record = {
        "meta": {
            "session_id": "local-poc",
            "captured_at": None,
            "model_versions": {"yolo": "best.pt"},
        },
        "yolo": {"summary": yolo_summary, "detections": dets},
        "ml": {},
        "overall": {"level": level, "reasons": reasons},
    }

    projection = {
        "meta": {
            "session_id": "local-poc",
            "generated_at": datetime.datetime.now().isoformat(timespec="seconds"),
            "template_version": "poc_reportlab_v1",
        },
        "decision": decision_record,
        "nlg": {
            "summary": nlg_summary,
            "details": nlg_details,
            "disclaimer": nlg_disclaimer,
        },
    }

    # 6) 출력 파일명(타임스탬프) - PDF 잠금 방지
    base = Path(avif_path).stem
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

    json_path = os.path.join(OUT_DIR, f"{base}_decision_record_{ts}.json")
    pdf_path = os.path.join(OUT_DIR, f"{base}_report_{ts}.pdf")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(projection, f, ensure_ascii=False, indent=2)

    make_pdf(pdf_path, projection, image_path=png_path)

    print("✅ 완료")
    print("JSON:", json_path)
    print("PDF :", pdf_path)


if __name__ == "__main__":
    main()
