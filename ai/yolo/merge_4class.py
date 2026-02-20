import os
import shutil
from pathlib import Path
from collections import Counter

# =========================
# User-configured paths
# =========================
ROOT_TEETH = r"C:\Users\User\Downloads\Dataset\dataset_merged"
ROOT_CANCER = r"C:\Users\User\Downloads\OralCancer_v9_rebalanced"
ROOT_HEALTHY = r"C:\Users\User\Downloads\Healthy Teeth.v1i.yolov8"
OUT_ROOT = r"C:\Users\User\Downloads\oral_4class_caries_tartar_oralcancer_normal"

# =========================
# Class mapping (source_class_id -> target_class_id)
# =========================
TEETH_MAP = {0: 0, 1: 1}  # caries->caries, calculus->tartar
CANCER_MAP = {0: 2}       # oral_cancer->oral_cancer
HEALTHY_MAP = {0: 3}      # Healthy teeths->normal

# =========================
# Dataset config
# =========================
DATASETS = [
    {
        "name": "TEETH",
        "root": ROOT_TEETH,
        "split_map": {"train": "train", "val": "val"},
        "class_map": TEETH_MAP,
        "prefix": "TEETH_",
    },
    {
        "name": "CANCER",
        "root": ROOT_CANCER,
        "split_map": {"train": "train", "val": "val", "test": "test"},
        "class_map": CANCER_MAP,
        "prefix": "CANCER_",
    },
    {
        "name": "HEALTHY",
        "root": ROOT_HEALTHY,
        "split_map": {"train": "train", "valid": "val", "test": "test"},
        "class_map": HEALTHY_MAP,
        "prefix": "HEALTHY_",
    },
]

TARGET_NAMES = ["caries", "tartar", "oral_cancer", "normal"]

# =========================
# Helpers
# =========================
IMG_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".webp"}


def ensure_dirs(base: Path):
    for split in ["train", "val", "test"]:
        (base / split / "images").mkdir(parents=True, exist_ok=True)
        (base / split / "labels").mkdir(parents=True, exist_ok=True)


def list_images(folder: Path):
    if not folder.exists():
        return []
    return [p for p in folder.iterdir() if p.suffix.lower() in IMG_EXTS and p.is_file()]


def read_label_lines(label_path: Path):
    if not label_path.exists():
        return None
    text = label_path.read_text(encoding="utf-8").strip()
    if text == "":
        return []
    return [line for line in text.splitlines() if line.strip() != ""]


def remap_label_lines(lines, class_map, src_label_path):
    remapped = []
    for idx, line in enumerate(lines, 1):
        parts = line.strip().split()
        if len(parts) < 5:
            raise ValueError(f"Invalid label format in {src_label_path} at line {idx}: '{line}'")
        try:
            cls = int(float(parts[0]))
        except ValueError as e:
            raise ValueError(f"Invalid class id in {src_label_path} at line {idx}: '{parts[0]}'") from e
        if cls not in class_map:
            raise ValueError(f"Class id {cls} not in class_map for {src_label_path}")
        parts[0] = str(class_map[cls])
        remapped.append(" ".join(parts))
    return remapped


def copy_and_remap_labels(src_label: Path, dst_label: Path, class_map, stats, split):
    lines = read_label_lines(src_label)
    if lines is None:
        print(f"[WARN] Missing label file: {src_label}")
        return
    if len(lines) == 0:
        print(f"[WARN] Empty label file: {src_label}")
        dst_label.write_text("", encoding="utf-8")
        stats[split]["labels"] += 1
        return

    remapped = remap_label_lines(lines, class_map, src_label)
    dst_label.write_text("\n".join(remapped) + "\n", encoding="utf-8")
    stats[split]["labels"] += 1

    for line in remapped:
        cls_id = int(line.split()[0])
        stats[split]["class_instances"][cls_id] += 1
    img_classes = set(int(line.split()[0]) for line in remapped)
    for cls_id in img_classes:
        stats[split]["class_images"][cls_id] += 1


def merge_dataset(cfg, out_root: Path, stats):
    root = Path(cfg["root"])
    prefix = cfg["prefix"]
    class_map = cfg["class_map"]

    for src_split, dst_split in cfg["split_map"].items():
        src_img_dir = root / src_split / "images"
        src_lbl_dir = root / src_split / "labels"
        dst_img_dir = out_root / dst_split / "images"
        dst_lbl_dir = out_root / dst_split / "labels"

        images = list_images(src_img_dir)
        if not images:
            if src_img_dir.exists():
                print(f"[WARN] No images found in {src_img_dir}")
            else:
                print(f"[WARN] Missing images dir: {src_img_dir}")
            continue

        for img_path in images:
            stem = img_path.stem
            new_name = prefix + img_path.name
            dst_img_path = dst_img_dir / new_name
            dst_lbl_path = dst_lbl_dir / (prefix + stem + ".txt")
            src_lbl_path = src_lbl_dir / (stem + ".txt")

            shutil.copy2(img_path, dst_img_path)
            stats[dst_split]["images"] += 1

            copy_and_remap_labels(src_lbl_path, dst_lbl_path, class_map, stats, dst_split)


def write_data_yaml(out_root: Path):
    content = "\n".join([
        "train: train/images",
        "val: val/images",
        "test: test/images",
        "nc: 4",
        "names: ['caries','tartar','oral_cancer','normal']",
        "",
    ])
    (out_root / "data.yaml").write_text(content, encoding="utf-8")


def print_report(stats):
    print("\n=== Merge Report ===")
    total_instances = Counter()

    for split in ["train", "val", "test"]:
        print(f"\n[{split}] images: {stats[split]['images']}, labels: {stats[split]['labels']}")
        for cls_id, name in enumerate(TARGET_NAMES):
            inst = stats[split]["class_instances"][cls_id]
            imgc = stats[split]["class_images"][cls_id]
            print(f"  - {name}: instances={inst}, labeled_images={imgc}")
            total_instances[cls_id] += inst

    total_all = sum(total_instances.values())
    if total_all > 0:
        print("\n[Class Imbalance Check]")
        for cls_id, name in enumerate(TARGET_NAMES):
            pct = (total_instances[cls_id] / total_all) * 100.0
            line = f"  - {name}: {total_instances[cls_id]} ({pct:.2f}%)"
            if pct < 5.0:
                line += "  <-- WARNING: <5%"
            print(line)
    else:
        print("\n[WARN] No instances found. Check labels.")


def main():
    out_root = Path(OUT_ROOT)
    ensure_dirs(out_root)

    stats = {
        split: {
            "images": 0,
            "labels": 0,
            "class_instances": Counter(),
            "class_images": Counter(),
        } for split in ["train", "val", "test"]
    }

    for cfg in DATASETS:
        print(f"[INFO] Merging {cfg['name']} from {cfg['root']}")
        merge_dataset(cfg, out_root, stats)

    write_data_yaml(out_root)
    print_report(stats)


if __name__ == "__main__":
    main()
