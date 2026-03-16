# 🤟 SilentVoice: Indian Sign Language (ISL) Platform

A premium, high-fidelity platform for Indian Sign Language communication and learning, featuring real-time AI gesture detection.

## 📁 Project Structure

```bash
SignLanguage/
├── voice/               # Next.js Frontend (Premium UI)
├── api.py               # FastAPI Backend (AI Inference Engine)
├── main.py              # Local Testing Script (OpenCV)
├── collect_landmarks.py # Data Collection Utility
├── train_model.py       # Model Training Script
├── hand_tracking/       # MediaPipe Hand Tracking Logic
├── gesture_detection/   # AI Model Interaction Logic
├── data/                # Training Dataset (landmarks_data.csv)
└── models/              # Trained ML Models (gesture_model.pkl)
```

## 🚀 Quick Start

### 1. Installation
Install all Python and Node.js dependencies:
```bash
npm run install:all
```

### 2. Run the Application
Start both the Frontend and Backend concurrently:
```bash
npm run dev
```
*   **Web App**: http://localhost:3000
*   **API**: http://localhost:8000

## 🛠️ Development Tools

### Training your own model:
1.  **Collect Data**: Run `python collect_landmarks.py` to capture signs.
2.  **Train**: Run `python train_model.py` to generate a new `gesture_model.pkl`.

### Individual Components:
*   Start **Backend only**: `npm run dev:backend`
*   Start **Frontend only**: `npm run dev:frontend`
