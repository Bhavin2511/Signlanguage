from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
import pickle
import os
import tensorflow as tf

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SEQUENCE_MODEL_PATH = 'models/isl_sequence_model.h5'
ACTIONS_PATH = 'models/actions.npy'

seq_model = None
seq_actions = None

try:
    if os.path.exists(SEQUENCE_MODEL_PATH):
        seq_model = tf.keras.models.load_model(SEQUENCE_MODEL_PATH)
        if os.path.exists(ACTIONS_PATH):
            seq_actions = np.load(ACTIONS_PATH)
        else:
            seq_actions = np.array([
                "HELP", "STOP", "CALL", "POLICE", "DOCTOR", "HOSPITAL",
                "EMERGENCY", "FIRE", "SAFE", "WAIT",
                "PAIN", "MEDICINE", "SICK", "INJURY", "FEVER",
                "WATER", "FOOD", "HUNGRY", "THIRSTY",
                "YES", "NO", "PLEASE", "SORRY", "THANK YOU",
                "ME", "YOU", "HOME", "HERE"
            ])
        print("Sequence model loaded successfully.")
except Exception as e:
    print(f"Error loading sequence model: {e}")

class SequencePredictionRequest(BaseModel):
    sequence: List[List[float]]

@app.get("/")
async def root():
    return {"message": "SilentVoice API is running"}

@app.post("/predict_sequence")
async def predict_sequence(request: SequencePredictionRequest):
    if seq_model is None:
        raise HTTPException(status_code=500, detail="Sequence model not loaded.")
    
    if len(request.sequence) != 30:
        raise HTTPException(status_code=400, detail=f"Expected 30 frames, got {len(request.sequence)}")
        
    seq_array = np.array(request.sequence)
    if seq_array.shape != (30, 126):
         raise HTTPException(status_code=400, detail=f"Expected shape (30, 126), got {seq_array.shape}")
         
    res = seq_model.predict(np.expand_dims(seq_array, axis=0), verbose=0)[0]
    confidence = float(res[np.argmax(res)])
    # We follow the threshold used in python
    if confidence > 0.70:
        prediction = str(seq_actions[np.argmax(res)])
    else:
        prediction = "?"
        
    return {"prediction": prediction, "confidence": confidence}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
