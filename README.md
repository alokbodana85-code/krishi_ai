# 🌱 CropSage — Smart Crop Recommendation System

> AI-powered farming assistant with a stunning glassmorphism UI, built with Next.js + FastAPI + Random Forest.

---

## ✨ Features

- 🎨 **Glassmorphism UI** — animated gradient background, frosted glass cards, glowing accents  
- 🎚️ **Interactive Sliders** — live-updating values with custom-styled range inputs  
- 🤖 **Random Forest ML** — trained on 25 crop varieties with soil + climate features  
- 📊 **Rich Results** — confidence bar, soil health score, top-3 alternatives  
- ⚡ **Real-time UX** — spinner during prediction, smooth page transitions  

---

## 📁 Project Structure

```
crop-recommendation/
├── backend/
│   ├── main.py             ← FastAPI app + Random Forest model
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx    ← Main page
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── SliderInput.tsx
    │   │   ├── ResultCard.tsx
    │   │   └── Loader.tsx
    │   └── lib/
    │       ├── types.ts
    │       └── sliders.ts
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## 🚀 Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at → http://localhost:8000  
Swagger docs at → http://localhost:8000/docs

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → http://localhost:3000

---

## 🔌 API Reference

### `POST /predict`

**Request body:**
```json
{
  "nitrogen":    90,
  "phosphorus":  42,
  "potassium":   43,
  "temperature": 21,
  "humidity":    82,
  "ph":          6.5,
  "rainfall":    202
}
```

**Response:**
```json
{
  "crop":        "Rice",
  "confidence":  87.4,
  "emoji":       "🌾",
  "color":       "#F59E0B",
  "description": "Rice thrives in high humidity and warm temperatures...",
  "alternatives": [
    { "name": "Jute",  "confidence": 6.2,  "emoji": "🌿" },
    { "name": "Maize", "confidence": 3.1,  "emoji": "🌽" }
  ],
  "soil_health": { "label": "Excellent", "color": "#22C55E", "score": 83 }
}
```

---

## 🌾 Supported Crops

Rice, Maize, Chickpea, Kidney Beans, Pigeon Peas, Moth Beans, Mung Bean, Black Gram, Lentil, Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut, Cotton, Jute, Coffee, Wheat, Sugarcane, Tobacco

---

## 🛠️ Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | Next.js 14, TypeScript, Tailwind CSS      |
| Animations| CSS keyframes, Framer Motion              |
| Backend   | FastAPI, Uvicorn                          |
| ML Model  | scikit-learn RandomForestClassifier       |
| Fonts     | Playfair Display + DM Sans (Google Fonts) |

---

*Made with 🌿 for precision agriculture.*
