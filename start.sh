#!/usr/bin/env bash
set -e

echo "🌱 Starting CropSage — Smart Crop Recommendation System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Backend ──────────────────────────────────────────────
echo ""
echo "📦 Setting up Python backend..."
cd "$(dirname "$0")/backend"

if [ ! -d "venv" ]; then
  echo "  Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

echo "  ✅ Backend dependencies installed"
echo "  🚀 Starting FastAPI on http://localhost:8000 ..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# ── Frontend ─────────────────────────────────────────────
echo ""
echo "📦 Setting up Next.js frontend..."
cd "$(dirname "$0")/frontend"
npm install --silent

echo "  ✅ Frontend dependencies installed"
echo "  🚀 Starting Next.js on http://localhost:3000 ..."
npm run dev &
FRONTEND_PID=$!

# ── Summary ──────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅  Backend API : http://localhost:8000"
echo "  ✅  API Docs    : http://localhost:8000/docs"
echo "  ✅  Frontend    : http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Press Ctrl+C to stop both servers."
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo 'Stopped.'" INT
wait
