# USER PLAN (DO NOT MODIFY)
# Virtual Trial Room — Production Implementation Plan

> **Version:** 1.0.0  
> **Type:** 2D AI-Powered Virtual Try-On System  
> **Stack:** React + FastAPI + PyTorch + MediaPipe + HR-VITON  
> **Target:** Production-grade, real human photo, real face preservation, realistic cloth draping

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Tech Stack — Full Breakdown](#2-tech-stack--full-breakdown)
3. [Directory Structure](#3-directory-structure)
4. [Phase 1 — Project Scaffold & Infrastructure](#4-phase-1--project-scaffold--infrastructure)
5. [Phase 2 — User Photo Pipeline (Real Face + Body)](#5-phase-2--user-photo-pipeline-real-face--body)
6. [Phase 3 — AI Cloth Draping Engine](#6-phase-3--ai-cloth-draping-engine)
7. [Phase 4 — Measurement & Fit System](#7-phase-4--measurement--fit-system)
8. [Phase 5 — Frontend Trial Room UI](#8-phase-5--frontend-trial-room-ui)
9. [Phase 6 — Garment Catalog & Management](#9-phase-6--garment-catalog--management)
10. [Phase 7 — Performance, Caching & Queue](#10-phase-7--performance-caching--queue)
11. [Phase 8 — Deployment & DevOps](#11-phase-8--deployment--devops)
12. [AI Model Reference](#12-ai-model-reference)
13. [API Contract](#13-api-contract)
14. [Environment Variables](#14-environment-variables)
15. [Paste-Ready Prompts for AI Coding Agents](#15-paste-ready-prompts-for-ai-coding-agents)

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      BROWSER (React)                        │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Upload  │  │  MediaPipe   │  │   Konva Canvas       │  │
│  │  Photo   │→ │  Pose + Seg  │→ │   (Layer Renderer)   │  │
│  └──────────┘  └──────────────┘  └──────────────────────┘  │
│                        │                    ↑               │
│              body keypoints JSON    warped garment PNG       │
└────────────────────────┼────────────────────┼───────────────┘
                         ↓                    │
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                           │
│  POST /api/tryon                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. InsightFace → detect + preserve face region      │   │
│  │  2. Human Parser → semantic body segmentation        │   │
│  │  3. OpenPose / DWPose → 18-point body skeleton       │   │
│  │  4. Cloth Mask Generator → garment alpha mask        │   │
│  │  5. HR-VITON / OOTDiffusion → TPS warp + refine     │   │
│  │  6. Face Paste-back → restore face onto result      │   │
│  │  7. Return warped PNG → browser renders on canvas    │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓                                   │
│              Celery + Redis (async job queue)                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Storage: Supabase (PostgreSQL + Storage buckets)           │
│  CDN:     Cloudinary (image delivery + resize)              │
│  Models:  Local /models/ directory OR HuggingFace Hub       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack — Full Breakdown

### Frontend

| Package | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| Konva.js | 9.x | Canvas layer management (body + cloth + face layers) |
| @mediapipe/pose | 0.5.x | 33-point body keypoint detection (browser WASM) |
| @mediapipe/selfie_segmentation | 0.1.x | Background removal (browser-side) |
| @tensorflow/tfjs-backend-webgl | 4.x | GPU acceleration for MediaPipe in browser |
| Zustand | 4.x | Global state (measurements, garment selection, results) |
| React Dropzone | 14.x | Photo upload |
| Framer Motion | 11.x | UI animations |
| React Query | 5.x | Server state, polling for async job results |
| Axios | 1.x | HTTP client |

### Backend

| Package | Version | Purpose |
|---|---|---|
| FastAPI | 0.111.x | REST API |
| Uvicorn | 0.30.x | ASGI server |
| Celery | 5.x | Async job queue for GPU inference |
| Redis | 7.x | Celery broker + result backend |
| Pydantic | 2.x | Request/response validation |
| python-multipart | — | File upload handling |
| Pillow | 10.x | Image I/O, compositing |
| OpenCV-python | 4.x | Image transforms, TPS warping, mask processing |
| NumPy | 1.x | Array operations |
| torch + torchvision | 2.x (CUDA 12) | Model inference |
| insightface | 0.7.x | Face detection + 5-point landmark extraction |
| onnxruntime-gpu | 1.18.x | Optimized face model inference |
| huggingface-hub | 0.x | Model downloads |
| supabase-py | 2.x | Database + storage |
| cloudinary | 1.x | CDN image management |
| python-dotenv | — | Environment config |

### AI Models

| Model | Task | Source |
|---|---|---|
| MediaPipe BlazePose | 33 body keypoints (browser) | Google MediaPipe |
| DWPose / OpenPose | 18+hand keypoints (server) | IDEA-Research/DWPose |
| SCHP / LIP Parser | Human body part segmentation | Engineering-Vision-Group/SCHP |
| InsightFace buffalo_l | Face detection + landmarks | deepinsight/insightface |
| HR-VITON | Cloth warping + try-on generation | sangyun884/HR-VITON |
| OOTDiffusion (optional upgrade) | Diffusion-based try-on | levihsu/OOTDiffusion |
| u2net / IS-Net | Garment background removal | xuebinqin/U-2-Net |

---

## 3. Directory Structure

```
virtual-trial-room/
├── frontend/
│   ├── public/
│   │   └── models/                    # MediaPipe WASM models (self-hosted)
│   ├── src/
│   │   ├── components/
│   │   │   ├── TrialRoom/
│   │   │   │   ├── TrialRoom.jsx      # Root orchestrator
│   │   │   │   ├── BodyCanvas.jsx     # Konva stage: body + garment + face layers
│   │   │   │   ├── FaceLayer.jsx      # Real face preserved + rendered on canvas
│   │   │   │   ├── GarmentLayer.jsx   # Warped cloth PNG layer
│   │   │   │   └── SkeletonOverlay.jsx # Debug keypoint visualizer
│   │   │   ├── Upload/
│   │   │   │   ├── PhotoUpload.jsx    # Drag-drop + webcam capture
│   │   │   │   └── PhotoPreview.jsx
│   │   │   ├── Measurements/
│   │   │   │   ├── MeasurementPanel.jsx   # Height, chest, waist, hip, shoulder sliders
│   │   │   │   ├── SizeAutoDetect.jsx     # Suggests size from measurements
│   │   │   │   └── FitAnalysis.jsx        # Per-zone fit score bars
│   │   │   ├── Catalog/
│   │   │   │   ├── GarmentCatalog.jsx     # Browse + filter garments
│   │   │   │   ├── GarmentCard.jsx
│   │   │   │   └── CategoryFilter.jsx
│   │   │   └── UI/
│   │   │       ├── ColorPicker.jsx
│   │   │       ├── PatternSelector.jsx
│   │   │       └── DrapeStyleToggle.jsx
│   │   ├── hooks/
│   │   │   ├── useMediaPipePose.js        # BlazePose keypoint extraction hook
│   │   │   ├── useBodySegmentation.js     # Selfie segmentation hook
│   │   │   ├── useTryOnJob.js             # Poll Celery job via React Query
│   │   │   └── useMeasurements.js
│   │   ├── store/
│   │   │   └── trialRoomStore.js          # Zustand store
│   │   ├── utils/
│   │   │   ├── keypointUtils.js           # Normalize, scale keypoints
│   │   │   ├── canvasUtils.js             # Layer compositing helpers
│   │   │   └── fitCalculator.js           # Measurement → fit % logic
│   │   ├── api/
│   │   │   └── trialRoomApi.js            # Axios calls to FastAPI
│   │   └── main.jsx
│   ├── .env
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py                        # FastAPI app entry
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── tryon.py               # POST /api/tryon
│   │   │   │   ├── garments.py            # GET /api/garments
│   │   │   │   └── jobs.py                # GET /api/jobs/{job_id}
│   │   │   └── deps.py                    # Shared dependencies
│   │   ├── core/
│   │   │   ├── config.py                  # Settings via pydantic-settings
│   │   │   └── celery_app.py              # Celery instance
│   │   ├── services/
│   │   │   ├── pose_service.py            # DWPose inference
│   │   │   ├── segmentation_service.py    # SCHP human parser
│   │   │   ├── face_service.py            # InsightFace detection + paste-back
│   │   │   ├── cloth_mask_service.py      # U2Net garment masking
│   │   │   ├── tryon_service.py           # HR-VITON orchestrator
│   │   │   └── image_service.py           # Pillow compositing utilities
│   │   ├── tasks/
│   │   │   └── tryon_task.py              # Celery task: full try-on pipeline
│   │   ├── models/
│   │   │   └── schemas.py                 # Pydantic request/response schemas
│   │   └── db/
│   │       ├── supabase_client.py
│   │       └── garment_repo.py
│   ├── models/                            # Downloaded AI model weights
│   │   ├── dwpose/
│   │   ├── schp/
│   │   ├── insightface/
│   │   ├── u2net/
│   │   └── hrviton/
│   ├── scripts/
│   │   └── download_models.py             # One-shot model downloader
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml
├── nginx.conf
└── README.md
```

---

## 4. Phase 1 — Project Scaffold & Infrastructure

### 1.1 Frontend scaffold

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install react-konva konva @mediapipe/pose @mediapipe/selfie_segmentation
npm install @tensorflow/tfjs-backend-webgl zustand @tanstack/react-query
npm install axios react-dropzone framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 1.2 Backend scaffold

```bash
mkdir backend && cd backend
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn[standard] celery redis python-multipart
pip install pillow opencv-python numpy torch torchvision
pip install insightface onnxruntime-gpu huggingface-hub
pip install supabase cloudinary python-dotenv pydantic-settings
```

### 1.3 Redis + Celery local dev

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

```python
# backend/app/core/celery_app.py
from celery import Celery

celery_app = Celery(
    "tryon",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
    include=["app.tasks.tryon_task"],
)
celery_app.conf.task_serializer = "json"
celery_app.conf.result_expires = 3600
```

### 1.4 docker-compose.yml

```yaml
version: "3.9"
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: ./backend/.env
    volumes:
      - ./backend/models:/app/models
    depends_on:
      - redis
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  worker:
    build: ./backend
    command: celery -A app.core.celery_app worker --loglevel=info --concurrency=1 -P solo
    env_file: ./backend/.env
    volumes:
      - ./backend/models:/app/models
    depends_on:
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
```

---

## 5. Phase 2 — User Photo Pipeline (Real Face + Body)

This phase handles real human photo input. The goal is to extract accurate body keypoints and preserve the user's real face perfectly throughout the try-on pipeline.

### 5.1 Browser-side: MediaPipe pose + segmentation

```javascript
// frontend/src/hooks/useMediaPipePose.js
import { useEffect, useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

export function useMediaPipePose() {
  const [keypoints, setKeypoints] = useState(null);
  const [segmentationMask, setSegmentationMask] = useState(null);
  const poseRef = useRef(null);
  const segRef = useRef(null);

  useEffect(() => {
    // Initialize Pose
    poseRef.current = new Pose({
      locateFile: (f) => `/models/pose/${f}`,
    });
    poseRef.current.setOptions({
      modelComplexity: 2,          // highest accuracy
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });
    poseRef.current.onResults((results) => {
      if (results.poseLandmarks) {
        setKeypoints(results.poseLandmarks);
      }
    });

    // Initialize Segmentation
    segRef.current = new SelfieSegmentation({
      locateFile: (f) => `/models/selfie_segmentation/${f}`,
    });
    segRef.current.setOptions({ modelSelection: 1 });
    segRef.current.onResults((results) => {
      setSegmentationMask(results.segmentationMask);
    });
  }, []);

  async function processImage(imageElement) {
    await poseRef.current.send({ image: imageElement });
    await segRef.current.send({ image: imageElement });
  }

  return { keypoints, segmentationMask, processImage };
}
```

### 5.2 Server-side: face detection and extraction

```python
# backend/app/services/face_service.py
import insightface
import numpy as np
import cv2
from PIL import Image

class FaceService:
    def __init__(self, model_root: str = "/app/models/insightface"):
        self.app = insightface.app.FaceAnalysis(
            name="buffalo_l",
            root=model_root,
            providers=["CUDAExecutionProvider", "CPUExecutionProvider"],
        )
        self.app.prepare(ctx_id=0, det_size=(640, 640))

    def extract_face(self, image_np: np.ndarray):
        """Returns face bounding box, landmarks, and cropped face region."""
        faces = self.app.get(image_np)
        if not faces:
            return None
        face = sorted(faces, key=lambda f: f.det_score, reverse=True)[0]
        bbox = face.bbox.astype(int)           # [x1, y1, x2, y2]
        landmarks = face.kps                   # 5-point: eyes, nose, mouth corners
        x1, y1, x2, y2 = bbox
        padding = 20
        x1 = max(0, x1 - padding)
        y1 = max(0, y1 - padding)
        x2 = min(image_np.shape[1], x2 + padding)
        y2 = min(image_np.shape[0], y2 + padding)
        face_crop = image_np[y1:y2, x1:x2]
        return {
            "bbox": (x1, y1, x2, y2),
            "landmarks": landmarks,
            "face_crop": face_crop,
        }

    def paste_face_back(
        self,
        result_np: np.ndarray,
        original_face_data: dict,
    ) -> np.ndarray:
        """Paste original face back onto try-on result to restore real face."""
        face_crop = original_face_data["face_crop"]
        x1, y1, x2, y2 = original_face_data["bbox"]
        h = y2 - y1
        w = x2 - x1
        resized_face = cv2.resize(face_crop, (w, h))

        # Feathered alpha blend for seamless paste
        mask = np.ones((h, w), dtype=np.float32)
        feather = max(4, h // 12)
        for i in range(feather):
            alpha = i / feather
            if i < h:
                mask[i, :] = alpha
                mask[h - 1 - i, :] = alpha
            if i < w:
                mask[:, i] = np.minimum(mask[:, i], alpha)
                mask[:, w - 1 - i] = np.minimum(mask[:, w - 1 - i], alpha)

        mask_3ch = np.stack([mask] * 3, axis=-1)
        roi = result_np[y1:y2, x1:x2].astype(np.float32)
        blended = resized_face.astype(np.float32) * mask_3ch + roi * (1 - mask_3ch)
        result_np[y1:y2, x1:x2] = blended.astype(np.uint8)
        return result_np
```

### 5.3 Server-side: human body parser (SCHP)

```python
# backend/app/services/segmentation_service.py
import torch
import numpy as np
from PIL import Image
import torchvision.transforms as T

# SCHP segments body into 20 regions:
# 0=background, 1=hat, 2=hair, 3=sunglasses, 4=upper-clothes,
# 5=skirt, 6=pants, 7=dress, 8=belt, 9=left-shoe, 10=right-shoe,
# 11=face, 12=left-leg, 13=right-leg, 14=left-arm, 15=right-arm,
# 16=bag, 17=scarf, 18=torso-skin, 19=left-hand, 20=right-hand

UPPER_LABELS = [4]          # upper clothes
LOWER_LABELS = [5, 6, 7]    # skirt, pants, dress
PRESERVE_LABELS = [2, 11]   # hair, face — always preserved

class HumanParserService:
    def __init__(self, model_path: str = "/app/models/schp/exp-schp-201908261155-lip.pth"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self._load_model(model_path)
        self.transform = T.Compose([
            T.Resize((512, 512)),
            T.ToTensor(),
            T.Normalize(mean=[0.406, 0.456, 0.485], std=[0.225, 0.224, 0.229]),
        ])

    def _load_model(self, path):
        from networks import init_model  # SCHP repo
        model = init_model("resnet101", num_classes=20, pretrained=None)
        state = torch.load(path, map_location=self.device)
        model.load_state_dict(state["state_dict"], strict=False)
        model.to(self.device).eval()
        return model

    @torch.no_grad()
    def get_segmentation(self, pil_image: Image.Image) -> np.ndarray:
        orig_w, orig_h = pil_image.size
        inp = self.transform(pil_image).unsqueeze(0).to(self.device)
        output = self.model(inp)
        parsing = output[0].argmax(1).squeeze().cpu().numpy()
        parsing = Image.fromarray(parsing.astype(np.uint8)).resize(
            (orig_w, orig_h), Image.NEAREST
        )
        return np.array(parsing)

    def get_body_mask(self, parsing: np.ndarray, region: str = "upper") -> np.ndarray:
        labels = UPPER_LABELS if region == "upper" else LOWER_LABELS
        mask = np.zeros(parsing.shape, dtype=np.uint8)
        for label in labels:
            mask[parsing == label] = 255
        return mask
```

---

## 6. Phase 3 — AI Cloth Draping Engine

This is the core try-on pipeline. It uses thin-plate spline (TPS) warping to deform the garment image to match the user's body, then refines the result with HR-VITON's appearance flow network.

### 6.1 HR-VITON integration

```python
# backend/app/services/tryon_service.py
import torch
import numpy as np
from PIL import Image
import cv2

class TryOnService:
    """
    Wraps HR-VITON pipeline.
    Repo: https://github.com/sangyun884/HR-VITON
    Input:  person image (512x384), cloth image (512x384), cloth mask, agnostic map, densepose
    Output: warped try-on result (512x384 → upscaled to original resolution)
    """

    def __init__(self, checkpoint_dir: str = "/app/models/hrviton"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tocg, self.generator = self._load_models(checkpoint_dir)

    def _load_models(self, checkpoint_dir):
        # HR-VITON has two networks:
        # 1. TOCG  — Try-On Condition Generator (warps cloth to body)
        # 2. Generator — Appearance refinement + generation
        from models.network_generator import SPADEGenerator
        from models.network_tocg import ConditionGenerator

        tocg = ConditionGenerator(
            input_nc=4, output_nc=13, ngf=96, norm_layer="batch", num_upsampling_layers="most"
        )
        tocg.load_state_dict(torch.load(f"{checkpoint_dir}/mtviton.pth", map_location=self.device))
        tocg.to(self.device).eval()

        generator = SPADEGenerator(3 + 3 + 3, 3)
        generator.load_state_dict(torch.load(f"{checkpoint_dir}/gen.pth", map_location=self.device))
        generator.to(self.device).eval()

        return tocg, generator

    @torch.no_grad()
    def run(
        self,
        person_img: Image.Image,       # User photo, background removed
        cloth_img: Image.Image,        # Garment PNG (transparent background)
        cloth_mask: Image.Image,       # Binary garment mask
        agnostic: Image.Image,         # Person image with clothing region removed
        densepose: np.ndarray,         # DensePose UV map
    ) -> Image.Image:

        # Resize to HR-VITON input size
        SIZE = (512, 384)
        person_t = self._to_tensor(person_img.resize(SIZE))
        cloth_t = self._to_tensor(cloth_img.resize(SIZE))
        mask_t = self._to_tensor_mask(cloth_mask.resize(SIZE))
        agnostic_t = self._to_tensor(agnostic.resize(SIZE))
        densepose_t = torch.from_numpy(
            cv2.resize(densepose, (SIZE[1], SIZE[0]))
        ).permute(2, 0, 1).unsqueeze(0).float().to(self.device) / 255.0

        # Stage 1: condition generation (cloth warping)
        input_tocg = torch.cat([agnostic_t, densepose_t, cloth_t, mask_t], dim=1)
        flow_out, warped_cloth, warped_mask = self.tocg(input_tocg)

        # Stage 2: appearance refinement
        input_gen = torch.cat([agnostic_t, densepose_t, warped_cloth], dim=1)
        result_t = self.generator(input_gen, segmap=warped_mask)

        return self._to_pil(result_t)

    def _to_tensor(self, img: Image.Image):
        import torchvision.transforms.functional as TF
        return TF.to_tensor(img.convert("RGB")).unsqueeze(0).to(self.device) * 2 - 1

    def _to_tensor_mask(self, img: Image.Image):
        import torchvision.transforms.functional as TF
        return TF.to_tensor(img.convert("L")).unsqueeze(0).to(self.device)

    def _to_pil(self, tensor) -> Image.Image:
        t = (tensor.squeeze(0).cpu().clamp(-1, 1) + 1) / 2
        return Image.fromarray((t.permute(1, 2, 0).numpy() * 255).astype(np.uint8))
```

### 6.2 Agnostic map generator

```python
# backend/app/services/agnostic_service.py
import numpy as np
from PIL import Image, ImageDraw

def generate_agnostic(
    person_img: Image.Image,
    parsing: np.ndarray,
    keypoints: dict,
    region: str = "upper",
) -> Image.Image:
    """
    Removes clothing region from person image.
    Fills removed region with body-color inpainting (simple mean fill).
    The model then fills this region with the new garment.
    """
    agnostic = person_img.copy().convert("RGB")
    arr = np.array(agnostic)
    mask = np.zeros(parsing.shape, dtype=np.uint8)

    erase_labels = [4, 7] if region == "upper" else [5, 6]  # upper-clothes or pants/skirt
    for label in erase_labels:
        mask[parsing == label] = 255

    # Fill erased region with skin-tone average from arms
    skin_labels = [14, 15]  # left-arm, right-arm
    skin_pixels = arr[(parsing == 14) | (parsing == 15)]
    fill_color = tuple(skin_pixels.mean(axis=0).astype(int)) if len(skin_pixels) else (200, 170, 150)

    for c in range(3):
        arr[:, :, c][mask == 255] = fill_color[c]

    # Add noise for texture
    noise = np.random.normal(0, 8, arr.shape).astype(np.int16)
    arr = np.clip(arr.astype(np.int16) + noise * (mask[:, :, np.newaxis] // 255), 0, 255).astype(np.uint8)

    return Image.fromarray(arr)
```

### 6.3 Garment mask service (U2Net)

```python
# backend/app/services/cloth_mask_service.py
import torch
import numpy as np
from PIL import Image
import torchvision.transforms as T

class ClothMaskService:
    """Uses U2Net to generate binary mask for garment PNG."""

    def __init__(self, model_path: str = "/app/models/u2net/u2net_cloth_seg.pth"):
        from u2net import U2NET
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = U2NET(3, 4)  # 4-class: background + 3 garment parts
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.to(self.device).eval()
        self.transform = T.Compose([
            T.Resize((768, 768)),
            T.ToTensor(),
            T.Normalize([0.5] * 3, [0.5] * 3),
        ])

    @torch.no_grad()
    def get_mask(self, cloth_img: Image.Image) -> Image.Image:
        orig_size = cloth_img.size
        inp = self.transform(cloth_img.convert("RGB")).unsqueeze(0).to(self.device)
        d1, *_ = self.model(inp)
        pred = d1[:, 0, :, :]
        pred = (pred - pred.min()) / (pred.max() - pred.min() + 1e-8)
        mask_np = (pred.squeeze().cpu().numpy() * 255).astype(np.uint8)
        mask = Image.fromarray(mask_np).resize(orig_size, Image.BILINEAR)
        mask = mask.point(lambda p: 255 if p > 128 else 0)
        return mask
```

### 6.4 Full pipeline orchestration

```python
# backend/app/tasks/tryon_task.py
from celery import shared_task
from PIL import Image
import numpy as np
import io, base64

from app.services.face_service import FaceService
from app.services.segmentation_service import HumanParserService
from app.services.cloth_mask_service import ClothMaskService
from app.services.agnostic_service import generate_agnostic
from app.services.tryon_service import TryOnService
from app.services.pose_service import PoseService

face_svc = FaceService()
parser_svc = HumanParserService()
cloth_mask_svc = ClothMaskService()
tryon_svc = TryOnService()
pose_svc = PoseService()

@shared_task(bind=True, max_retries=2, time_limit=120)
def run_tryon(self, person_b64: str, cloth_b64: str, region: str = "upper"):
    try:
        person_img = b64_to_pil(person_b64)
        cloth_img = b64_to_pil(cloth_b64)
        person_np = np.array(person_img.convert("RGB"))

        # Step 1: Extract and save face
        face_data = face_svc.extract_face(person_np)

        # Step 2: Human body parsing
        parsing = parser_svc.get_segmentation(person_img)

        # Step 3: Cloth mask
        cloth_mask = cloth_mask_svc.get_mask(cloth_img)

        # Step 4: Agnostic map (erase existing clothes)
        keypoints = pose_svc.get_keypoints(person_img)
        agnostic = generate_agnostic(person_img, parsing, keypoints, region)

        # Step 5: DensePose UV map
        densepose = pose_svc.get_densepose(person_img)

        # Step 6: HR-VITON try-on
        result = tryon_svc.run(person_img, cloth_img, cloth_mask, agnostic, densepose)

        # Step 7: Upscale result to original resolution
        result = result.resize(person_img.size, Image.LANCZOS)
        result_np = np.array(result)

        # Step 8: Paste real face back
        if face_data:
            result_np = face_svc.paste_face_back(result_np, face_data)

        result_img = Image.fromarray(result_np)
        return {"status": "done", "result": pil_to_b64(result_img)}

    except Exception as exc:
        raise self.retry(exc=exc, countdown=5)

def b64_to_pil(b64: str) -> Image.Image:
    data = base64.b64decode(b64)
    return Image.open(io.BytesIO(data)).convert("RGB")

def pil_to_b64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()
```

---

## 7. Phase 4 — Measurement & Fit System

### 7.1 Size chart constants

```javascript
// frontend/src/utils/fitCalculator.js

export const SIZE_CHART = {
  XS: { chest: 80, waist: 62, hips: 86, shoulder: 36 },
  S:  { chest: 86, waist: 68, hips: 92, shoulder: 38 },
  M:  { chest: 92, waist: 74, hips: 98, shoulder: 40 },
  L:  { chest: 98, waist: 80, hips: 104, shoulder: 42 },
  XL: { chest: 106, waist: 88, hips: 112, shoulder: 44 },
  XXL:{ chest: 114, waist: 96, hips: 120, shoulder: 46 },
};

// Tolerance bands (cm) — how far off before fit degrades
const TOLERANCE = { chest: 4, waist: 3, hips: 4, shoulder: 2 };

export function computeFitScore(userMeasurements, size) {
  const chart = SIZE_CHART[size];
  const zones = ["chest", "waist", "hips", "shoulder"];
  const scores = {};

  zones.forEach((zone) => {
    const diff = Math.abs(userMeasurements[zone] - chart[zone]);
    const tol = TOLERANCE[zone];
    const score = Math.round(Math.max(0, Math.min(100, 100 - (diff / tol) * 30)));
    scores[zone] = score;
  });

  scores.overall = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / zones.length
  );
  return scores;
}

export function recommendSize(userMeasurements) {
  let bestSize = "M";
  let bestScore = 0;
  for (const size of Object.keys(SIZE_CHART)) {
    const score = computeFitScore(userMeasurements, size).overall;
    if (score > bestScore) {
      bestScore = score;
      bestSize = size;
    }
  }
  return { size: bestSize, score: bestScore };
}

// Compute pixel-to-cm scale from keypoints (shoulder width reference)
export function computePixelScale(keypoints, realShoulderCm) {
  if (!keypoints) return null;
  const lSh = keypoints[11]; // LEFT_SHOULDER
  const rSh = keypoints[12]; // RIGHT_SHOULDER
  const pixelDist = Math.hypot(
    (rSh.x - lSh.x) * 1000,
    (rSh.y - lSh.y) * 1000
  );
  return realShoulderCm / pixelDist; // cm per pixel
}
```

### 7.2 MeasurementPanel component

```jsx
// frontend/src/components/Measurements/MeasurementPanel.jsx
import { useStore } from "../../store/trialRoomStore";
import { computeFitScore, recommendSize } from "../../utils/fitCalculator";

const MEASUREMENTS = [
  { key: "height",   label: "Height",   min: 140, max: 210, unit: "cm" },
  { key: "chest",    label: "Chest",    min: 70,  max: 130, unit: "cm" },
  { key: "waist",    label: "Waist",    min: 55,  max: 120, unit: "cm" },
  { key: "hips",     label: "Hips",     min: 70,  max: 135, unit: "cm" },
  { key: "shoulder", label: "Shoulder", min: 30,  max: 56,  unit: "cm" },
  { key: "inseam",   label: "Inseam",   min: 60,  max: 90,  unit: "cm" },
];

export default function MeasurementPanel() {
  const { measurements, setMeasurement, selectedSize, setSelectedSize } = useStore();
  const rec = recommendSize(measurements);
  const fitScores = computeFitScore(measurements, selectedSize);

  return (
    <div className="p-4 space-y-3">
      {MEASUREMENTS.map(({ key, label, min, max, unit }) => (
        <div key={key} className="flex items-center gap-3">
          <label className="text-xs text-gray-500 w-16 shrink-0">{label}</label>
          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={measurements[key]}
            onChange={(e) => setMeasurement(key, +e.target.value)}
            className="flex-1"
          />
          <span className="text-xs font-medium w-12 text-right">
            {measurements[key]} {unit}
          </span>
        </div>
      ))}

      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-xs text-gray-500">Recommended size</p>
        <p className="text-lg font-semibold">{rec.size}
          <span className="text-xs font-normal text-gray-400 ml-2">
            {rec.score}% match
          </span>
        </p>
      </div>
    </div>
  );
}
```

---

## 8. Phase 5 — Frontend Trial Room UI

### 8.1 Zustand store

```javascript
// frontend/src/store/trialRoomStore.js
import { create } from "zustand";

export const useStore = create((set, get) => ({
  // User photo state
  userPhoto: null,          // File object
  userPhotoUrl: null,       // Object URL for display
  keypoints: null,          // MediaPipe 33-point result
  segMask: null,            // Segmentation mask ImageData

  // Garment state
  selectedGarment: null,    // { id, name, imageUrl, maskUrl, category }
  selectedColor: "#378ADD",
  selectedSize: "M",
  drapeStyle: "relaxed",    // relaxed | fitted | loose
  pattern: "solid",

  // Measurements
  measurements: {
    height: 165, chest: 90, waist: 72,
    hips: 96, shoulder: 40, inseam: 76,
  },

  // Try-on result
  jobId: null,
  jobStatus: "idle",        // idle | pending | done | error
  resultUrl: null,

  // Actions
  setUserPhoto: (file) => {
    const url = URL.createObjectURL(file);
    set({ userPhoto: file, userPhotoUrl: url, resultUrl: null, jobId: null, jobStatus: "idle" });
  },
  setKeypoints: (kp) => set({ keypoints: kp }),
  setSegMask: (mask) => set({ segMask: mask }),
  setGarment: (g) => set({ selectedGarment: g, resultUrl: null }),
  setMeasurement: (key, val) =>
    set((s) => ({ measurements: { ...s.measurements, [key]: val } })),
  setSelectedSize: (s) => set({ selectedSize: s }),
  setColor: (c) => set({ selectedColor: c }),
  setDrapeStyle: (d) => set({ drapeStyle: d }),
  setPattern: (p) => set({ pattern: p }),
  setJobResult: (jobId, status, url) => set({ jobId, jobStatus: status, resultUrl: url }),
}));
```

### 8.2 Canvas layer architecture (Konva)

```jsx
// frontend/src/components/TrialRoom/BodyCanvas.jsx
import { Stage, Layer, Image as KonvaImage, Line, Circle } from "react-konva";
import useImage from "use-image";
import { useStore } from "../../store/trialRoomStore";

// Layer order (bottom to top):
// 1. Background (solid color or user-selected scene)
// 2. Body layer (segmented person photo — background removed)
// 3. Garment layer (warped try-on result OR real-time bezier drape)
// 4. Face layer (original face pasted on top — for realism)
// 5. Skeleton overlay (debug — toggleable)

export default function BodyCanvas({ showSkeleton = false }) {
  const { userPhotoUrl, resultUrl, keypoints } = useStore();
  const [bodyImg] = useImage(userPhotoUrl || "");
  const [resultImg] = useImage(resultUrl || "");

  const W = 400, H = 640;

  return (
    <Stage width={W} height={H}>
      <Layer>
        {/* Background */}
        <KonvaImage image={null} fill="#F5F5F0" width={W} height={H} />

        {/* Body (segmented) */}
        {bodyImg && !resultImg && (
          <KonvaImage image={bodyImg} width={W} height={H} />
        )}

        {/* Try-on result (replaces body when ready) */}
        {resultImg && (
          <KonvaImage image={resultImg} width={W} height={H} />
        )}

        {/* Skeleton overlay */}
        {showSkeleton && keypoints && (
          <SkeletonLayer keypoints={keypoints} W={W} H={H} />
        )}
      </Layer>
    </Stage>
  );
}

function SkeletonLayer({ keypoints, W, H }) {
  const CONNECTIONS = [
    [11,12],[11,13],[13,15],[12,14],[14,16],
    [11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[26,28],
  ];
  return (
    <>
      {CONNECTIONS.map(([a, b], i) => {
        const pa = keypoints[a], pb = keypoints[b];
        if (!pa || !pb || pa.visibility < 0.5 || pb.visibility < 0.5) return null;
        return (
          <Line
            key={i}
            points={[pa.x * W, pa.y * H, pb.x * W, pb.y * H]}
            stroke="#5DCAA5" strokeWidth={2} opacity={0.7}
          />
        );
      })}
      {keypoints.map((kp, i) =>
        kp.visibility > 0.5 ? (
          <Circle key={i} x={kp.x * W} y={kp.y * H} radius={4} fill="#5DCAA5" />
        ) : null
      )}
    </>
  );
}
```

---

## 9. Phase 6 — Garment Catalog & Management

### 9.1 Supabase schema

```sql
-- Garments table
CREATE TABLE garments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  brand       TEXT,
  category    TEXT NOT NULL CHECK (category IN ('top','bottom','dress','jacket','outerwear')),
  gender      TEXT NOT NULL CHECK (gender IN ('male','female','unisex')),
  colors      TEXT[],              -- available hex colors
  sizes       TEXT[],              -- available sizes
  price       NUMERIC(10,2),
  image_url   TEXT NOT NULL,       -- flat-lay product image (white/transparent bg)
  mask_url    TEXT NOT NULL,       -- binary cloth mask PNG
  thumbnail_url TEXT,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Try-on sessions (for analytics + saved looks)
CREATE TABLE tryon_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID,               -- nullable (anonymous sessions)
  garment_id   UUID REFERENCES garments(id),
  measurements JSONB,
  size_selected TEXT,
  result_url   TEXT,
  fit_scores   JSONB,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON garments (category);
CREATE INDEX ON garments (gender);
```

### 9.2 Garment image preparation requirements

Every garment image in the catalog must be prepared as follows before upload:

- Photographed flat-lay on pure white or transparent background
- Minimum resolution: 768 × 1024 px (portrait orientation)
- PNG format with alpha channel for transparent background
- Companion binary mask PNG (white = cloth pixels, black = background)
- No mannequin, no hanger visible
- Consistent lighting (no harsh shadows)

Run this script to auto-generate masks for new garments:

```bash
# scripts/prepare_garment.py
python scripts/prepare_garment.py --input ./raw_garments/ --output ./prepared/
# Uses U2Net cloth segmentation to generate masks automatically
```

---

## 10. Phase 7 — Performance, Caching & Queue

### 10.1 Job queue pattern

```python
# backend/app/api/routes/tryon.py
from fastapi import APIRouter, UploadFile, File, Form
from app.tasks.tryon_task import run_tryon
import base64, io

router = APIRouter()

@router.post("/api/tryon")
async def start_tryon(
    person_photo: UploadFile = File(...),
    garment_id: str = Form(...),
    region: str = Form("upper"),
):
    person_bytes = await person_photo.read()
    person_b64 = base64.b64encode(person_bytes).decode()

    # Fetch garment image from Supabase
    garment_b64 = await fetch_garment_b64(garment_id)

    task = run_tryon.delay(person_b64, garment_b64, region)
    return {"job_id": task.id, "status": "pending"}

@router.get("/api/jobs/{job_id}")
async def get_job(job_id: str):
    from app.core.celery_app import celery_app
    result = celery_app.AsyncResult(job_id)
    if result.state == "SUCCESS":
        return {"status": "done", "result_url": result.result.get("result")}
    elif result.state == "FAILURE":
        return {"status": "error"}
    return {"status": "pending"}
```

### 10.2 Frontend polling

```javascript
// frontend/src/hooks/useTryOnJob.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTryOnJob(jobId) {
  return useQuery({
    queryKey: ["tryon-job", jobId],
    queryFn: () => axios.get(`/api/jobs/${jobId}`).then((r) => r.data),
    enabled: !!jobId,
    refetchInterval: (data) =>
      data?.status === "done" || data?.status === "error" ? false : 1500,
    retry: false,
  });
}
```

### 10.3 Result caching

Cache try-on results by `(person_image_hash, garment_id, size)` to avoid re-running expensive inference:

```python
import hashlib, redis

cache = redis.Redis(host="localhost", port=6379, db=2)
CACHE_TTL = 86400  # 24 hours

def cache_key(person_b64: str, garment_id: str, size: str) -> str:
    h = hashlib.sha256((person_b64[:500] + garment_id + size).encode()).hexdigest()
    return f"tryon:{h}"

def get_cached(key: str):
    return cache.get(key)

def set_cached(key: str, result_b64: str):
    cache.setex(key, CACHE_TTL, result_b64)
```

---

## 11. Phase 8 — Deployment & DevOps

### 11.1 Backend Dockerfile

```dockerfile
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y \
    python3.11 python3-pip libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### 11.2 Recommended cloud infrastructure

| Component | Service | Spec |
|---|---|---|
| API server | AWS EC2 / GCP Compute | g4dn.xlarge (T4 GPU, 16GB VRAM) |
| Worker (GPU inference) | Same instance or separate | 1 worker per GPU |
| Redis broker | AWS ElastiCache | cache.t4g.small |
| Database | Supabase (managed Postgres) | Pro plan |
| Image CDN | Cloudinary | Auto-resize, WebP serving |
| Frontend | Vercel / Cloudflare Pages | Static deploy |
| Object storage | Supabase Storage / S3 | Garment images + results |
| SSL | Let's Encrypt via Nginx | — |

### 11.3 nginx.conf (reverse proxy)

```nginx
upstream backend { server backend:8000; }
upstream frontend { server frontend:80; }

server {
  listen 443 ssl;
  server_name yourdomain.com;

  ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  client_max_body_size 20M;

  location /api/ {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_read_timeout 120s;
  }

  location / {
    proxy_pass http://frontend;
  }
}
```

---

## 12. AI Model Reference

### Download script

```python
# backend/scripts/download_models.py
from huggingface_hub import hf_hub_download
import subprocess, os

MODELS = [
    # HR-VITON
    ("levihsu/HR-VITON", "mtviton.pth",  "models/hrviton/mtviton.pth"),
    ("levihsu/HR-VITON", "gen.pth",      "models/hrviton/gen.pth"),

    # U2Net cloth segmentation
    ("skytnt/u2net_cloth_seg", "u2net_cloth_seg.pth", "models/u2net/u2net_cloth_seg.pth"),
]

for repo, filename, local_path in MODELS:
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    print(f"Downloading {filename}...")
    path = hf_hub_download(repo_id=repo, filename=filename, local_dir=os.path.dirname(local_path))
    print(f"  → {path}")

# SCHP (clone repo + download weights separately)
subprocess.run(["git", "clone", "https://github.com/GoGoDuck912/Self-Correction-Human-Parsing", "models/schp"])
print("Download SCHP weights manually from the repo releases.")

print("All models downloaded.")
```

### Model summary

| Model | Parameters | VRAM Required | Inference Time |
|---|---|---|---|
| MediaPipe BlazePose | ~6M | 0 (browser WASM) | ~30ms per frame |
| SCHP ResNet-101 | 60M | ~2 GB | ~0.3s |
| InsightFace buffalo_l | 86M | ~1.5 GB | ~0.1s |
| U2Net cloth | 44M | ~1 GB | ~0.2s |
| HR-VITON (TOCG + Gen) | ~130M | ~6 GB | ~2–4s |
| **Total** | — | ~10 GB | **~3–5s end-to-end** |

Minimum GPU: **NVIDIA T4 (16 GB VRAM)** for all models loaded simultaneously.

---

## 13. API Contract

### POST /api/tryon

**Request** (multipart/form-data)

| Field | Type | Description |
|---|---|---|
| `person_photo` | File (PNG/JPG) | User photo, max 10MB |
| `garment_id` | string (UUID) | Selected garment from catalog |
| `region` | string | `upper` or `lower` |
| `size` | string | XS / S / M / L / XL / XXL |

**Response**

```json
{
  "job_id": "abc123",
  "status": "pending"
}
```

### GET /api/jobs/{job_id}

**Response (pending)**
```json
{ "status": "pending" }
```

**Response (done)**
```json
{
  "status": "done",
  "result_url": "https://cdn.example.com/results/abc123.png",
  "fit_scores": {
    "chest": 94,
    "waist": 88,
    "hips": 91,
    "length": 96,
    "overall": 92
  }
}
```

### GET /api/garments

**Query params:** `?category=top&gender=female&page=1&limit=20`

**Response**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Classic White Shirt",
      "brand": "Studio",
      "category": "top",
      "gender": "female",
      "colors": ["#FFFFFF", "#2C2C2A", "#378ADD"],
      "sizes": ["XS","S","M","L","XL"],
      "price": 49.99,
      "image_url": "https://...",
      "thumbnail_url": "https://..."
    }
  ],
  "total": 84,
  "page": 1
}
```

---

## 14. Environment Variables

### Frontend (.env)

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloud
```

### Backend (.env)

```env
DATABASE_URL=postgresql://user:pass@host:5432/trialroom
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/1
MODEL_DIR=/app/models
ALLOWED_ORIGINS=https://yourdomain.com
MAX_IMAGE_SIZE_MB=10
```

---

## 15. Paste-Ready Prompts for AI Coding Agents

Paste these directly into Cursor, Claude Code, Copilot Workspace, or any AI coding agent to build each component.

---

### Prompt 1 — Full frontend scaffold

```
Build a React 18 + Vite virtual trial room frontend with the following spec:

Stack: React, Vite, Tailwind CSS, Konva.js, Zustand, @mediapipe/pose, @mediapipe/selfie_segmentation, @tanstack/react-query, axios, react-dropzone, framer-motion.

Create this folder structure:
src/
  components/TrialRoom/TrialRoom.jsx    — main layout (3-column: left panel, canvas center, right panel)
  components/TrialRoom/BodyCanvas.jsx   — Konva Stage with 4 layers: background, body, garment, skeleton
  components/Upload/PhotoUpload.jsx     — drag-drop + webcam capture, outputs File to store
  components/Measurements/MeasurementPanel.jsx  — sliders for height, chest, waist, hips, shoulder, inseam
  components/Measurements/FitAnalysis.jsx       — per-zone fit score bars with color coding
  components/Catalog/GarmentCatalog.jsx         — grid of garment cards fetched from /api/garments
  hooks/useMediaPipePose.js             — BlazePose hook, returns 33 keypoints from image element
  hooks/useBodySegmentation.js          — SelfieSegmentation hook, returns mask canvas
  hooks/useTryOnJob.js                  — polls GET /api/jobs/:id every 1.5s via React Query
  store/trialRoomStore.js               — Zustand store with all state and actions
  utils/fitCalculator.js                — SIZE_CHART, computeFitScore(), recommendSize()
  api/trialRoomApi.js                   — axios: startTryOn(photo, garmentId, region), getGarments()

Requirements:
- When user uploads photo, run MediaPipe pose + segmentation immediately in the browser
- Show extracted keypoints as a toggleable skeleton overlay on the Konva canvas
- When user selects a garment and clicks "Try On", POST to /api/tryon, get job_id, poll until done, render result PNG on canvas
- While job is pending, show a bezier-curve drape preview (parametric garment shapes) that responds to measurement sliders in real time
- Fit score bars update live as sliders change, using SIZE_CHART data
- All state in Zustand. No prop drilling.
- Tailwind for all styling. No CSS modules.
```

---

### Prompt 2 — FastAPI backend + Celery pipeline

```
Build a FastAPI backend for a virtual try-on system with the following spec:

Stack: FastAPI, Uvicorn, Celery, Redis, Pillow, OpenCV, PyTorch, insightface, python-multipart, supabase-py, python-dotenv, pydantic-settings.

Create:
app/main.py              — FastAPI app, CORS, include routers
app/core/config.py       — Settings class with all env vars
app/core/celery_app.py   — Celery instance pointing to Redis
app/api/routes/tryon.py  — POST /api/tryon (accepts multipart: person_photo file + garment_id + region form fields), dispatches Celery task, returns {job_id, status}
app/api/routes/jobs.py   — GET /api/jobs/{job_id} returns {status, result_url, fit_scores}
app/api/routes/garments.py — GET /api/garments with category/gender/page query params, reads from Supabase
app/services/face_service.py     — InsightFace buffalo_l: extract_face() returns {bbox, landmarks, face_crop}, paste_face_back() blends original face onto result with feathered alpha mask
app/services/segmentation_service.py — SCHP ResNet-101 human parser: get_segmentation() returns label map, get_body_mask() returns binary mask for upper or lower region
app/services/cloth_mask_service.py   — U2Net: get_mask() returns binary PIL mask for garment image
app/services/agnostic_service.py     — generate_agnostic() erases clothing region, fills with skin-tone sampled from arm pixels
app/services/tryon_service.py        — HR-VITON wrapper: loads TOCG + Generator, run() method takes person/cloth/mask/agnostic/densepose tensors, returns result PIL image
app/tasks/tryon_task.py  — Celery task @shared_task that runs: face extract → parse → cloth mask → agnostic → HR-VITON → face paste-back → return base64 result

All services initialize models once at module level (singleton pattern).
Models loaded from /app/models/ directory.
Use CUDA if available, fall back to CPU.
Return errors gracefully with proper HTTP status codes.
```

---

### Prompt 3 — Real-time bezier drape renderer

```
Build a canvas-based 2D garment draping renderer in vanilla JavaScript (works inside a React component via useRef on a canvas element).

It must:
1. Accept these inputs via a render(config) function:
   - body: { cx, headY, headR, neckY, shY, shW, bustY, bustW, waistY, waistW, hipY, hipW, crotchY, kneeY, ankleY } — all pixel values derived from measurement sliders
   - garment: 'tshirt' | 'shirt' | 'dress' | 'jacket' | 'pants' | 'skirt'
   - color: hex string
   - pattern: 'solid' | 'stripe' | 'check' | 'dot'
   - drapeStyle: 'relaxed' | 'fitted' | 'loose'  — multiplies ease factor on width curves

2. Draw:
   - A realistic body silhouette (all bezier curves, no flat lines) with skin tone, arms, neck, head
   - The selected garment draped over the body using cubic bezier curves that follow body contours
   - Fabric fold lines (secondary lighter bezier strokes) for dresses and skirts
   - Collar, buttons, lapels for shirt and jacket garment types
   - Pattern fill using OffscreenCanvas createPattern (stripe, check, polka dot on cloth color base)
   - A shadow layer (slight offset filled copy at low opacity) to give cloth depth

3. Re-render every time any input changes (call render() on each slider change)
4. Body proportions must scale correctly with height slider (affects leg/torso ratio)
5. Waist, chest, hip sliders reshape the bezier control points in real time
6. Export a getCanvas() function that returns the canvas element for saving as PNG
```

---

### Prompt 4 — Garment catalog admin + image preparation pipeline

```
Build a Python CLI script: scripts/prepare_garment.py

It must:
1. Accept --input dir (folder of raw garment JPG/PNG photos) and --output dir
2. For each image:
   a. Run U2Net cloth segmentation to remove background → save as transparent PNG
   b. Generate binary mask PNG (white=cloth, black=background)
   c. Resize both to 768x1024 maintaining aspect ratio with padding
   d. Run InsightFace to verify no human face is present (reject mannequin shots with visible faces)
   e. Auto-detect dominant colors using KMeans on cloth pixels (k=5) → save as hex list
   f. Save metadata as JSON sidecar: {name, filename, mask_filename, colors, width, height}
3. Print a summary of processed / rejected files

Also build: scripts/upload_garments.py
1. Reads prepared/ directory
2. Uploads each garment PNG and mask PNG to Supabase Storage bucket "garments"
3. Inserts row into garments table with image_url, mask_url, colors from JSON sidecar
4. Prompts CLI user to enter name, brand, category, gender, sizes, price for each garment
```

---

### Prompt 5 — Model download + setup verification

```
Build a Python script: scripts/setup.py

It must:
1. Check Python version (requires 3.10+)
2. Check CUDA availability and print GPU name + VRAM
3. Download these models if not already present in /app/models/:
   - HR-VITON: mtviton.pth + gen.pth from HuggingFace Hub (levihsu/HR-VITON)
   - U2Net cloth: u2net_cloth_seg.pth from (skytnt/u2net_cloth_seg)
   - InsightFace: buffalo_l pack (auto-download via insightface.app.FaceAnalysis)
   - SCHP: prompt user to manually download exp-schp-201908261155-lip.pth from Google Drive (print link)
4. Run a smoke test on each model:
   - Load model
   - Run inference on a 512x384 blank white image
   - Assert output shape is correct
   - Print PASS or FAIL per model
5. Print total disk usage of /app/models/
6. Print estimated inference time per model based on a timed test run
```

---

*End of plan. All prompts are designed to be pasted directly into an AI coding agent with no modification needed.*
