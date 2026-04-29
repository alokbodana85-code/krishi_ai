from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import random

app = FastAPI(title="Crop Recommendation API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Synthetic training data ───────────────────────────────────────────────────
CROPS = [
    "Rice", "Maize", "Chickpea", "Kidney Beans", "Pigeon Peas",
    "Moth Beans", "Mung Bean", "Black Gram", "Lentil", "Pomegranate",
    "Banana", "Mango", "Grapes", "Watermelon", "Muskmelon",
    "Apple", "Orange", "Papaya", "Coconut", "Cotton",
    "Jute", "Coffee", "Wheat", "Sugarcane", "Tobacco",
]

CROP_INFO = {
    "Rice":         {"emoji": "🌾", "color": "#F59E0B", "desc": "Rice thrives in high humidity and warm temperatures. Ensure proper water logging and nitrogen-rich soil."},
    "Maize":        {"emoji": "🌽", "color": "#EF4444", "desc": "Maize requires well-drained loamy soil with moderate rainfall. Great for warm-climate cultivation."},
    "Chickpea":     {"emoji": "🫘", "color": "#8B5CF6", "desc": "Chickpea is drought-tolerant and grows well in cool, dry climates with low humidity."},
    "Kidney Beans": {"emoji": "🫘", "color": "#DC2626", "desc": "Kidney Beans prefer cool temperatures and well-drained fertile soil with moderate watering."},
    "Pigeon Peas":  {"emoji": "🌱", "color": "#16A34A", "desc": "Pigeon Peas are drought-resistant legumes ideal for semi-arid tropical regions."},
    "Moth Beans":   {"emoji": "🌿", "color": "#65A30D", "desc": "Moth Beans are extremely drought-resistant and grow in sandy soils with minimal rainfall."},
    "Mung Bean":    {"emoji": "🫛", "color": "#22C55E", "desc": "Mung Bean thrives in warm, humid conditions and well-drained loamy soil."},
    "Black Gram":   {"emoji": "⚫", "color": "#374151", "desc": "Black Gram grows well in tropical climates with moderate rainfall and clay-loam soil."},
    "Lentil":       {"emoji": "🟤", "color": "#B45309", "desc": "Lentil is a cool-season crop that does well in well-drained, slightly alkaline soils."},
    "Pomegranate":  {"emoji": "🍎", "color": "#E11D48", "desc": "Pomegranate thrives in hot, dry climates and well-drained sandy loam soil."},
    "Banana":       {"emoji": "🍌", "color": "#FCD34D", "desc": "Banana requires high humidity, warm temperatures, and rich, loamy, well-drained soil."},
    "Mango":        {"emoji": "🥭", "color": "#F97316", "desc": "Mango trees prefer tropical climate, deep well-drained soil, and a dry season for flowering."},
    "Grapes":       {"emoji": "🍇", "color": "#7C3AED", "desc": "Grapes grow best in Mediterranean-like climates with well-drained loamy soil and good sunlight."},
    "Watermelon":   {"emoji": "🍉", "color": "#F43F5E", "desc": "Watermelon needs long warm seasons, sandy loam soil, and plenty of sunshine."},
    "Muskmelon":    {"emoji": "🍈", "color": "#FDE68A", "desc": "Muskmelon prefers hot, dry climate and light, well-drained sandy soil."},
    "Apple":        {"emoji": "🍎", "color": "#DC2626", "desc": "Apple requires cold winters and cool summers with well-drained, fertile soil."},
    "Orange":       {"emoji": "🍊", "color": "#EA580C", "desc": "Orange thrives in subtropical climates with deep, well-drained soil and abundant sunshine."},
    "Papaya":       {"emoji": "🟡", "color": "#D97706", "desc": "Papaya grows well in warm, humid tropical climates and rich, well-drained soil."},
    "Coconut":      {"emoji": "🥥", "color": "#78716C", "desc": "Coconut palms need tropical coastal climate, sandy soil, and high humidity."},
    "Cotton":       {"emoji": "🌸", "color": "#E5E7EB", "desc": "Cotton requires hot summers, moderate rainfall, and well-drained black cotton soil."},
    "Jute":         {"emoji": "🌿", "color": "#84CC16", "desc": "Jute thrives in hot, humid climates with alluvial soil and high rainfall."},
    "Coffee":       {"emoji": "☕", "color": "#92400E", "desc": "Coffee grows in tropical highlands with rich, well-drained soil and moderate rainfall."},
    "Wheat":        {"emoji": "🌾", "color": "#CA8A04", "desc": "Wheat is a cool-season crop suited for loamy soil with moderate rainfall."},
    "Sugarcane":    {"emoji": "🎋", "color": "#4ADE80", "desc": "Sugarcane requires tropical/subtropical climate, deep fertile soil, and abundant water."},
    "Tobacco":      {"emoji": "🍂", "color": "#A16207", "desc": "Tobacco grows best in warm climate, well-drained sandy loam or clay soils."},
}

# Generate synthetic training dataset
np.random.seed(42)
N = 2000
X_train = []
y_train = []

crop_params = {
    "Rice":         ([80,82],[200,300],[20,35],[60,70],[6,7],[40,60],[200,300]),
    "Maize":        ([0,0],[0,0],[18,26],[55,70],[5.5,7],[35,40],[60,110]),
    "Chickpea":     ([40,60],[67,100],[17,20],[14,22],[6,8.5],[14,22],[70,100]),
    "Kidney Beans": ([20,22],[28,40],[15,20],[18,22],[5.5,7],[18,22],[90,120]),
    "Pigeon Peas":  ([17,19],[131,200],[23,27],[42,48],[5,7],[42,48],[150,200]),
    "Moth Beans":   ([21,23],[45,68],[27,32],[53,62],[3.5,6.5],[53,62],[50,150]),
    "Mung Bean":    ([20,26],[36,62],[26,32],[82,95],[6.2,7.2],[82,95],[60,85]),
    "Black Gram":   ([39,41],[64,80],[29,33],[64,70],[7,7.5],[64,70],[65,90]),
    "Lentil":       ([18,20],[18,22],[17,21],[92,95],[6.5,7.3],[92,95],[40,70]),
    "Pomegranate":  ([18,20],[18,19],[21,25],[90,95],[6,7],[90,95],[100,150]),
    "Banana":       ([100,102],[74,80],[25,27],[80,85],[5.5,6.5],[80,85],[100,130]),
    "Mango":        ([14,16],[35,40],[30,35],[92,95],[4.5,7],[92,95],[90,120]),
    "Grapes":       ([23,24],[132,133],[22,27],[82,85],[5.5,6.5],[82,85],[50,100]),
    "Watermelon":   ([17,17],[100,105],[25,32],[85,95],[6,7],[85,95],[40,65]),
    "Muskmelon":    ([17,17],[100,105],[28,35],[92,95],[6,6.5],[92,95],[24,30]),
    "Apple":        ([20,22],[130,140],[20,23],[92,95],[5.5,6.5],[92,95],[110,145]),
    "Orange":       ([9,10],[10,12],[22,25],[92,95],[6,7],[92,95],[110,120]),
    "Papaya":       ([49,50],[59,60],[33,35],[92,95],[6,7],[92,95],[145,200]),
    "Coconut":      ([21,23],[14,16],[27,30],[92,95],[5.5,7],[92,95],[175,200]),
    "Cotton":       ([117,118],[45,46],[23,25],[79,85],[6,8],[79,85],[80,120]),
    "Jute":         ([60,82],[40,60],[23,25],[79,85],[6,7],[79,85],[150,200]),
    "Coffee":       ([37,38],[29,30],[25,28],[58,62],[6,6.5],[58,62],[140,165]),
    "Wheat":        ([20,21],[100,107],[23,28],[65,75],[6,7],[65,75],[50,110]),
    "Sugarcane":    ([20,40],[115,135],[26,33],[80,90],[6,7.5],[80,90],[175,200]),
    "Tobacco":      ([37,38],[48,52],[22,28],[45,55],[5.5,7],[45,55],[50,80]),
}

for crop, params in crop_params.items():
    n_samples = N // len(CROPS)
    for _ in range(n_samples):
        N_val  = np.random.uniform(params[0][0], params[0][1]+1)
        P_val  = np.random.uniform(params[1][0], params[1][1]+1)
        K_val  = np.random.uniform(params[2][0], params[2][1]+1)
        temp   = np.random.uniform(params[3][0], params[3][1]+1)
        hum    = np.random.uniform(params[4][0], params[4][1]+1)
        ph     = np.random.uniform(params[5][0], params[5][1]+1)
        rain   = np.random.uniform(params[6][0], params[6][1]+1)
        X_train.append([N_val, P_val, K_val, temp, hum, ph, rain])
        y_train.append(crop)

X_train = np.array(X_train)
y_train = np.array(y_train)

le = LabelEncoder()
y_encoded = le.fit_transform(y_train)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_encoded)

print("✅ Model trained successfully!")


class PredictRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


@app.get("/")
def root():
    return {"message": "Crop Recommendation API is running 🌱"}


@app.post("/predict")
def predict(req: PredictRequest):
    features = np.array([[
        req.nitrogen, req.phosphorus, req.potassium,
        req.temperature, req.humidity, req.ph, req.rainfall
    ]])

    proba = model.predict_proba(features)[0]
    top3_idx = np.argsort(proba)[::-1][:3]

    top_crop = le.classes_[top3_idx[0]]
    confidence = float(proba[top3_idx[0]])

    alternatives = []
    for i in top3_idx[1:]:
        name = le.classes_[i]
        info = CROP_INFO.get(name, {})
        alternatives.append({
            "name": name,
            "confidence": round(float(proba[i]) * 100, 1),
            "emoji": info.get("emoji", "🌱"),
        })

    info = CROP_INFO.get(top_crop, {
        "emoji": "🌱",
        "color": "#22C55E",
        "desc": "This crop is well-suited for the provided soil and climate conditions.",
    })

    return {
        "crop": top_crop,
        "confidence": round(confidence * 100, 1),
        "emoji": info["emoji"],
        "color": info["color"],
        "description": info["desc"],
        "alternatives": alternatives,
        "soil_health": _soil_health(req.ph, req.nitrogen, req.phosphorus, req.potassium),
    }


def _soil_health(ph, n, p, k):
    score = 0
    if 6.0 <= ph <= 7.5:  score += 33
    if n >= 20:            score += 34
    if p >= 20:            score += 16
    if k >= 30:            score += 17
    if score >= 70:        return {"label": "Excellent", "color": "#22C55E", "score": score}
    if score >= 45:        return {"label": "Good",      "color": "#84CC16", "score": score}
    if score >= 25:        return {"label": "Moderate",  "color": "#F59E0B", "score": score}
    return                        {"label": "Poor",      "color": "#EF4444", "score": score}
