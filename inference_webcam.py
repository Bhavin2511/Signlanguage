import cv2
import numpy as np
import os
import tensorflow as tf
from hand_tracking.advanced_hand_detector import AdvancedHandDetector

# --- Configuration ---
sequence_length = 30
threshold = 0.75 # Prediction confidence threshold
model_path = 'models/isl_sequence_model.h5'
actions_path = 'models/actions.npy'

# --- Load Model & Actions ---
if not os.path.exists(model_path):
    print(f"Error: Model not found at {model_path}. Please run train_sequence_model.py first.")
    exit()

model = tf.keras.models.load_model(model_path)

# Load Actions (labels)
if os.path.exists(actions_path):
    actions = np.load(actions_path)
    print(f"Loaded actions: {actions}")
else:
    # Default fallback
    actions = np.array([
        "HELP", "STOP", "CALL", "POLICE", "DOCTOR", "HOSPITAL",
        "EMERGENCY", "FIRE", "SAFE", "WAIT",
        "PAIN", "MEDICINE", "SICK", "INJURY", "FEVER",
        "WATER", "FOOD", "HUNGRY", "THIRSTY",
        "YES", "NO", "PLEASE", "SORRY", "THANK YOU",
        "ME", "YOU", "HOME", "HERE"
    ])

# --- Initialization ---
detector = AdvancedHandDetector()

# Detection variables
sequence = []
sentence = []
predictions = []

cap = cv2.VideoCapture(0)

print("--- Real-Time Prediction Started ---")
print("Press 'Q' to Exit")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Flip frame for mirror effect
    frame = cv2.flip(frame, 1)

    # 1. Make detections (Normalization is now inside get_landmarks)
    frame = detector.find_hands(frame)
    keypoints = detector.get_landmarks()
    
    # 2. Prediction logic
    sequence.append(keypoints)
    sequence = sequence[-sequence_length:] # Keep last 30 frames

    display_text = "Waiting..."
    confidence = 0.0

    if len(sequence) == sequence_length:
        res = model.predict(np.expand_dims(sequence, axis=0), verbose=0)[0]
        confidence = res[np.argmax(res)]
        
        # Add current prediction to buffer for smoothing
        predictions.append(np.argmax(res))
        predictions = predictions[-10:] # Keep last 10 predictions for majority vote

        # 3. Smoothing Logic (Majority Voting over last 10 frames)
        unique_preds, counts = np.unique(predictions, return_counts=True)
        majority_vote = unique_preds[np.argmax(counts)]
        
        if confidence > threshold:
            display_text = actions[majority_vote]
            
            # Sentence formation logic
            if len(sentence) > 0:
                if display_text != sentence[-1]:
                    sentence.append(display_text)
            else:
                sentence.append(display_text)
        else:
            display_text = "Try Again (Low Confidence)"

        if len(sentence) > 5:
            sentence = sentence[-5:]

    # 4. Visualizing Results
    # Background for prediction display
    cv2.rectangle(frame, (0, 0), (640, 45), (40, 40, 40), -1)
    
    # Show prediction
    status_color = (0, 255, 0) if confidence > threshold else (0, 0, 255)
    cv2.putText(frame, f"Sign: {display_text}", (15, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)
    
    # Show confidence percentage
    conf_pct = int(confidence * 100)
    cv2.putText(frame, f"{conf_pct}%", (580, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

    # Show Sentence history at the bottom
    cv2.rectangle(frame, (0, 440), (640, 480), (245, 117, 16), -1)
    cv2.putText(frame, ' | '.join(sentence), (10, 470), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)

    cv2.imshow('Real-Time Signs', frame)

    # Break gracefully
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
