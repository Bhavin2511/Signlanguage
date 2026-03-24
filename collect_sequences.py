import cv2
import os
import numpy as np
from hand_tracking.advanced_hand_detector import AdvancedHandDetector

# --- Configuration ---
DATA_PATH = os.path.join('dataset') 
actions = [
    "HELP", "STOP", "CALL", "POLICE", "DOCTOR", "HOSPITAL",
    "EMERGENCY", "FIRE", "SAFE", "WAIT",
    "PAIN", "MEDICINE", "SICK", "INJURY", "FEVER",
    "WATER", "FOOD", "HUNGRY", "THIRSTY",
    "YES", "NO", "PLEASE", "SORRY", "THANK YOU",
    "ME", "YOU", "HOME", "HERE"
]
sequence_length = 30 # Number of frames per gesture sequence
STABLE_DETECTION_THRESHOLD = 8 # Number of consecutive frames both hands must be detected to start

# --- Initialization ---
detector = AdvancedHandDetector()
cap = cv2.VideoCapture(0)

current_action_idx = 0
frame_num = 0
stable_counter = 0
is_collecting = False
show_saved_counter = 0 # To show "SAVED" message briefly

def get_next_sequence_num(action):
    """Checks the dataset folder and returns the next available sequence number."""
    action_path = os.path.join(DATA_PATH, action)
    if not os.path.exists(action_path):
        return 0
    sequences = [int(s) for s in os.listdir(action_path) if s.isdigit()]
    return max(sequences) + 1 if sequences else 0

# Initial sequence number for the first word
sequence_num = get_next_sequence_num(actions[current_action_idx])

# Ensure base directory exists
os.makedirs(DATA_PATH, exist_ok=True)

print("--- Auto-Recording Collection Started ---")
print("Controls:")
print("  N     : Move to NEXT Word")
print("  Q     : QUIT and Save")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Flip frame for mirror effect
    frame = cv2.flip(frame, 1)
    
    # 1. Detect Hands & Extract Landmarks
    frame = detector.find_hands(frame)
    keypoints = detector.get_landmarks()

    # Get results from detector directly to check hand count
    results = detector.results
    hand_count = len(results.multi_hand_landmarks) if results and results.multi_hand_landmarks else 0
    
    # 2. State Machine Logic
    action = actions[current_action_idx]
    status_text = "WAITING (Detecting both hands...)"
    status_color = (0, 165, 255) # Orange

    if not is_collecting:
        if show_saved_counter > 0:
            status_text = "SAVED! Get ready..."
            status_color = (255, 255, 0) # Cyan
            show_saved_counter -= 1
        elif hand_count == 2:
            stable_counter += 1
            status_text = f"STABILIZING... ({stable_counter}/{STABLE_DETECTION_THRESHOLD})"
            status_color = (0, 255, 255) # Yellow
            if stable_counter >= STABLE_DETECTION_THRESHOLD:
                is_collecting = True
                stable_counter = 0
                sequence_num = get_next_sequence_num(action)
                print(f"Auto-Triggered: Starting '{action}' Seq {sequence_num}")
        else:
            stable_counter = 0
    else:
        # Saving landmark data
        save_dir = os.path.join(DATA_PATH, action, str(sequence_num))
        os.makedirs(save_dir, exist_ok=True)
        
        npy_path = os.path.join(save_dir, f"{frame_num}.npy")
        np.save(npy_path, keypoints)
        
        status_text = "RECORDING..."
        status_color = (0, 0, 255) # Red
        frame_num += 1
        
        if frame_num >= sequence_length:
            is_collecting = False
            frame_num = 0
            show_saved_counter = 20 # Show "SAVED" for 15-20 frames
            print(f"Successfully captured sequence {sequence_num} for '{action}'")

    # 3. Handle Keyboard Inputs
    key = cv2.waitKey(1) & 0xFF
    if key == ord('n'): # 'N': Next word
        is_collecting = False
        frame_num = 0
        stable_counter = 0
        current_action_idx = (current_action_idx + 1) % len(actions)
        sequence_num = get_next_sequence_num(actions[current_action_idx])
        print(f"Switched to next word: '{actions[current_action_idx]}'")
        
    elif key == ord('q'): # 'Q': Quit
        print("Quitting...")
        break

    # 4. Display UI Overlay
    # Header bar
    cv2.rectangle(frame, (0, 0), (640, 80), (30, 30, 30), -1)
    
    cv2.putText(frame, f"WORD: {action}", (15, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    cv2.putText(frame, f"Seq: {sequence_num} | Frame: {frame_num}/{sequence_length}", (15, 65), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
    cv2.putText(frame, status_text, (300, 45), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, status_color, 2)

    # Footnote
    cv2.putText(frame, "N: Next Word | Q: Quit", (450, 470), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100, 100, 100), 1)

    cv2.imshow('Auto-Recording Data Collection', frame)

cap.release()
cv2.destroyAllWindows()
