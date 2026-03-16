from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
import pickle
import os
from gesture_detection.gesture_classifier import GestureClassifier

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize classifier
try:
    classifier = GestureClassifier()
except Exception as e:
    print(f"Error initializing classifier: {e}")
    classifier = None

class Landmark(BaseModel):
    x: float
    y: float

class PredictionRequest(BaseModel):
    landmarks: List[Landmark]

@app.get("/")
async def root():
    return {"message": "SilentVoice API is running"}

@app.post("/predict")
async def predict(request: PredictionRequest):
    if not classifier:
        raise HTTPException(status_code=500, detail="Model not loaded. Please train the model first.")
    
    if len(request.landmarks) != 21:
        raise HTTPException(status_code=400, detail="Expected 21 landmarks")

    # Convert landmarks to the format expected by the classifier
    # The classifier expects [(x1, y1), (x2, y2), ...]
    landmarks_list = [(lm.x, lm.y) for lm in request.landmarks]
    
    try:
        # Debug: check first few landmarks to verify scaling
        print(f"Prediction requested. First landmark: ({request.landmarks[0].x:.1f}, {request.landmarks[0].y:.1f})")
        
        prediction = classifier.classify(landmarks_list)
        print(f"Prediction result: {prediction}")
        return {"prediction": prediction}
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
