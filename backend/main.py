from __future__ import annotations

from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Krishi AI API API",
    version="3.0.0",
)

# For production, replace ["*"] with the URL of your frontend.

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://krishi-ai-gzw3.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


FEATURE_NAMES = (
    "nitrogen",
    "phosphorus",
    "potassium",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
)

DATA_PATH = (
    Path(__file__).resolve().parent
    / "data"
    / "crop_recommendation.csv"
)

# The uploaded CSV uses lowercase labels without spaces.
# These are converted to the display names used by the API.
CROP_NAME_MAP = {
    "rice": "Rice",
    "maize": "Maize",
    "chickpea": "Chickpea",
    "kidneybeans": "Kidney Beans",
    "pigeonpeas": "Pigeon Peas",
    "mothbeans": "Moth Beans",
    "mungbean": "Mung Bean",
    "blackgram": "Black Gram",
    "lentil": "Lentil",
    "pomegranate": "Pomegranate",
    "banana": "Banana",
    "mango": "Mango",
    "grapes": "Grapes",
    "watermelon": "Watermelon",
    "muskmelon": "Muskmelon",
    "apple": "Apple",
    "orange": "Orange",
    "papaya": "Papaya",
    "coconut": "Coconut",
    "cotton": "Cotton",
    "jute": "Jute",
    "coffee": "Coffee",
}

CROP_INFO: dict[str, dict[str, str]] = {
    "Rice": {
        "emoji": "🌾",
        "color": "#F59E0B",
        "desc": "Rice thrives in high humidity and warm temperatures. Ensure proper water logging and nitrogen-rich soil.",
    },
    "Maize": {
        "emoji": "🌽",
        "color": "#EF4444",
        "desc": "Maize requires well-drained loamy soil with moderate rainfall. Great for warm-climate cultivation.",
    },
    "Chickpea": {
        "emoji": "🫘",
        "color": "#8B5CF6",
        "desc": "Chickpea is drought-tolerant and grows well in cool, dry climates with low humidity.",
    },
    "Kidney Beans": {
        "emoji": "🫘",
        "color": "#DC2626",
        "desc": "Kidney Beans prefer cool temperatures and well-drained fertile soil with moderate watering.",
    },
    "Pigeon Peas": {
        "emoji": "🌱",
        "color": "#16A34A",
        "desc": "Pigeon Peas are drought-resistant legumes ideal for semi-arid tropical regions.",
    },
    "Moth Beans": {
        "emoji": "🌿",
        "color": "#65A30D",
        "desc": "Moth Beans are extremely drought-resistant and grow in sandy soils with minimal rainfall.",
    },
    "Mung Bean": {
        "emoji": "🫛",
        "color": "#22C55E",
        "desc": "Mung Bean thrives in warm, humid conditions and well-drained loamy soil.",
    },
    "Black Gram": {
        "emoji": "⚫",
        "color": "#374151",
        "desc": "Black Gram grows well in tropical climates with moderate rainfall and clay-loam soil.",
    },
    "Lentil": {
        "emoji": "🟤",
        "color": "#B45309",
        "desc": "Lentil is a cool-season crop that does well in well-drained, slightly alkaline soils.",
    },
    "Pomegranate": {
        "emoji": "🍎",
        "color": "#E11D48",
        "desc": "Pomegranate thrives in hot, dry climates and well-drained sandy loam soil.",
    },
    "Banana": {
        "emoji": "🍌",
        "color": "#FCD34D",
        "desc": "Banana requires high humidity, warm temperatures, and rich, loamy, well-drained soil.",
    },
    "Mango": {
        "emoji": "🥭",
        "color": "#F97316",
        "desc": "Mango trees prefer tropical climate, deep well-drained soil, and a dry season for flowering.",
    },
    "Grapes": {
        "emoji": "🍇",
        "color": "#7C3AED",
        "desc": "Grapes grow best in Mediterranean-like climates with well-drained loamy soil and good sunlight.",
    },
    "Watermelon": {
        "emoji": "🍉",
        "color": "#F43F5E",
        "desc": "Watermelon needs long warm seasons, sandy loam soil, and plenty of sunshine.",
    },
    "Muskmelon": {
        "emoji": "🍈",
        "color": "#FDE68A",
        "desc": "Muskmelon prefers hot, dry climate and light, well-drained sandy soil.",
    },
    "Apple": {
        "emoji": "🍎",
        "color": "#DC2626",
        "desc": "Apple requires cold winters and cool summers with well-drained, fertile soil.",
    },
    "Orange": {
        "emoji": "🍊",
        "color": "#EA580C",
        "desc": "Orange thrives in subtropical climates with deep, well-drained soil and abundant sunshine.",
    },
    "Papaya": {
        "emoji": "🟡",
        "color": "#D97706",
        "desc": "Papaya grows well in warm, humid tropical climates and rich, well-drained soil.",
    },
    "Coconut": {
        "emoji": "🥥",
        "color": "#78716C",
        "desc": "Coconut palms need tropical coastal climate, sandy soil, and high humidity.",
    },
    "Cotton": {
        "emoji": "🌸",
        "color": "#E5E7EB",
        "desc": "Cotton requires hot summers, moderate rainfall, and well-drained black cotton soil.",
    },
    "Jute": {
        "emoji": "🌿",
        "color": "#84CC16",
        "desc": "Jute thrives in hot, humid climates with alluvial soil and high rainfall.",
    },
    "Coffee": {
        "emoji": "☕",
        "color": "#92400E",
        "desc": "Coffee grows in tropical highlands with rich, well-drained soil and moderate rainfall.",
    },
}


def load_real_dataset(path: Path) -> pd.DataFrame:
    """Load, normalize, and validate the real agricultural dataset."""
    if not path.exists():
        raise FileNotFoundError(
            f"Dataset not found at {path}. "
            "Place crop_recommendation.csv inside the data folder."
        )

    df = pd.read_csv(path)

    # CSV columns: N, P, K, temperature, humidity, ph, rainfall, label.
    df = df.rename(
        columns={
            "N": "nitrogen",
            "P": "phosphorus",
            "K": "potassium",
            "label": "crop",
        }
    )

    required_columns = list(FEATURE_NAMES) + ["crop"]
    missing_columns = set(required_columns) - set(df.columns)
    if missing_columns:
        raise ValueError(
            f"Missing dataset columns: {sorted(missing_columns)}"
        )

    df = df[required_columns].copy()

    for column in FEATURE_NAMES:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    df["crop"] = (
        df["crop"]
        .astype(str)
        .str.strip()
        .str.lower()
        .map(CROP_NAME_MAP)
    )

    df = df.dropna(subset=required_columns)
    df = df.drop_duplicates()

    # Reject physically implausible values.
    valid_rows = (
        df["nitrogen"].between(0, 300)
        & df["phosphorus"].between(0, 300)
        & df["potassium"].between(0, 300)
        & df["temperature"].between(-20, 60)
        & df["humidity"].between(0, 100)
        & df["ph"].between(0, 14)
        & df["rainfall"].between(0, 1000)
    )
    df = df[valid_rows]

    if df.empty:
        raise ValueError("No valid rows remain after cleaning the dataset.")

    unknown_crops = sorted(
        set(df["crop"].dropna()) - set(CROP_INFO)
    )
    if unknown_crops:
        raise ValueError(
            f"Unknown crop labels after normalization: {unknown_crops}"
        )

    return df


# Train once when the API starts.
training_data = load_real_dataset(DATA_PATH)

X_train = training_data[list(FEATURE_NAMES)].to_numpy(
    dtype=np.float32
)

label_encoder = LabelEncoder()
y_train = label_encoder.fit_transform(training_data["crop"])

model = RandomForestClassifier(
    n_estimators=300,
    class_weight="balanced_subsample",
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1,
    oob_score=True,
)

model.fit(X_train, y_train)
MODEL_OOB_SCORE = round(float(model.oob_score_), 4)
MODEL_ROW_COUNT = len(training_data)
MODEL_CLASS_COUNT = len(label_encoder.classes_)

print(
    f"Model trained on {MODEL_ROW_COUNT} rows "
    f"and {MODEL_CLASS_COUNT} crop classes."
)
print(f"Model OOB score: {MODEL_OOB_SCORE}")


class PredictRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nitrogen: float = Field(..., ge=0, le=300)
    phosphorus: float = Field(..., ge=0, le=300)
    potassium: float = Field(..., ge=0, le=300)
    temperature: float = Field(..., ge=-20, le=60)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14)
    rainfall: float = Field(..., ge=0, le=1000)


def soil_health(
    ph: float,
    nitrogen: float,
    phosphorus: float,
    potassium: float,
) -> dict[str, Any]:
    score = 0

    if 6.0 <= ph <= 7.5:
        score += 33
    if nitrogen >= 20:
        score += 34
    if phosphorus >= 20:
        score += 16
    if potassium >= 30:
        score += 17

    if score >= 70:
        label, color = "Excellent", "#22C55E"
    elif score >= 45:
        label, color = "Good", "#84CC16"
    elif score >= 25:
        label, color = "Moderate", "#F59E0B"
    else:
        label, color = "Poor", "#EF4444"

    return {
        "label": label,
        "color": color,
        "score": score,
    }


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "Crop Recommendation API is running 🌱",
        "version": app.version,
    }


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "model_oob_score": MODEL_OOB_SCORE,
        "training_rows": MODEL_ROW_COUNT,
        "classes": MODEL_CLASS_COUNT,
        "crop_classes": list(label_encoder.classes_),
    }


@app.post("/predict")
def predict(req: PredictRequest) -> dict[str, Any]:
    values = [getattr(req, name) for name in FEATURE_NAMES]
    features = np.asarray([values], dtype=np.float32)

    probabilities = model.predict_proba(features)[0]
    top_indices = np.argsort(probabilities)[::-1][:3]

    top_crop = str(label_encoder.classes_[top_indices[0]])
    top_info = CROP_INFO[top_crop]

    alternatives = []
    for index in top_indices[1:]:
        crop = str(label_encoder.classes_[index])
        info = CROP_INFO[crop]
        alternatives.append(
            {
                "name": crop,
                "confidence": round(
                    float(probabilities[index]) * 100,
                    1,
                ),
                "emoji": info["emoji"],
            }
        )

    return {
        "crop": top_crop,
        "confidence": round(
            float(probabilities[top_indices[0]]) * 100,
            1,
        ),
        "emoji": top_info["emoji"],
        "color": top_info["color"],
        "description": top_info["desc"],
        "alternatives": alternatives,
        "soil_health": soil_health(
            req.ph,
            req.nitrogen,
            req.phosphorus,
            req.potassium,
        ),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )
