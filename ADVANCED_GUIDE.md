# Advanced Indian Sign Language Recognition Guide

This guide explains how to use the upgraded 2-hand sequence-based recognition system.

## 1. Architecture Explanation
The system uses a **Bi-Directional Long Short-Term Memory (Bi-LSTM)** network. Unlike single-frame classification, this model processes a sequence of 30 frames (approx. 1 second of video) to understand the **motion** and **temporal dynamics** of a sign.

*   **Input**: 126 features (21 landmarks × 2 hands × 3 coordinates [x, y, z]).
*   **Tracking**: MediaPipe Hands (robust 2-hand tracking).
*   **Smoothing**: A sliding window of 30 frames is used for real-time inference, with a confidence threshold and temporal averaging to prevent jitter.

## 2. Dataset Collection
To train the model for your own signs:
1.  Open `collect_sequences.py`.
2.  Update the `actions` array with the signs you want to collect (e.g., `['hello', 'thanks', 'iloveyou']`).
3.  Run the script: `python collect_sequences.py`.
4.  The webcam will open. For each "Video Number":
    *   Wait for the "STARTING COLLECTION" overlay.
    *   Perform the gesture consistently for about 1-2 seconds (30 frames).
    *   Repeat for all 30 sequences per sign.

## 3. Training the Model
Once you have collected data in the `MP_Data` folder:
1.  Run the training script: `python train_sequence_model.py`.
2.  The script will:
    *   Load all `.npy` files.
    *   Preprocess and split the data.
    *   Train a Bi-LSTM model with Early Stopping to prevent overfitting.
3.  The trained model will be saved at `models/isl_sequence_model.h5`.

## 4. Real-Time Verification
To test your model:
1.  Run the inference script: `python inference_webcam.py`.
2.  Perform the signs in front of the webcam.
3.  The predicted sign will appear in a blue bar at the top of the screen.

## Suggestions for Improving Accuracy
1.  **Data Augmentation**: Collect data in different lighting, backgrounds, and at slightly different distances/angles.
2.  **Coordinate Normalization**: Modify `get_landmarks` to return coordinates relative to the wrist or a bounding box to make the model scale-invariant.
3.  **Extended Sequences**: If signs are long, increase `sequence_length` to 60 or 90 frames.
4.  **More Data**: Increase `no_sequences` to 60 or 100 for more robust training.
5.  **Hand Visibility**: If a hand is missing in a 2-hand sign, the model receives zeros. This is normal, but ensure the "no-hand" state is also represented during collection of single-hand signs.

---
**Note**: Ensure you have `opencv-python`, `mediapipe`, `tensorflow`, and `scikit-learn` installed in your environment.
