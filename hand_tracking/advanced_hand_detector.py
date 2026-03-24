import cv2
import mediapipe as mp
import numpy as np

class AdvancedHandDetector:
    def __init__(self, max_hands=2, detection_confidence=0.5, tracking_confidence=0.5):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=max_hands,
            min_detection_confidence=detection_confidence,
            min_tracking_confidence=tracking_confidence
        )
        self.mp_draw = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        self.results = None

    def find_hands(self, img, draw=True):
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(img_rgb)

        if self.results.multi_hand_landmarks:
            for hand_lms in self.results.multi_hand_landmarks:
                if draw:
                    self.mp_draw.draw_landmarks(
                        img,
                        hand_lms,
                        self.mp_hands.HAND_CONNECTIONS,
                        self.mp_drawing_styles.get_default_hand_landmarks_style(),
                        self.mp_drawing_styles.get_default_hand_connections_style()
                    )
        return img

    def get_landmarks(self):
        """
        Returns a flat list of 126 landmarks (21 lms * 2 hands * 3 coords).
        Pads with zeros if hands are missing.
        Ensures Left hand is always first if detected, then Right.
        """
        landmarks = np.zeros(126) # 21 * 2 * 3
        
        if not self.results or not self.results.multi_hand_landmarks:
            return landmarks

        # Sort hands by label (Left/Right) to ensure consistent ordering
        # Note: MediaPipe labels are from the camera's perspective (mirrored usually)
        # result.multi_handedness is a list of handedness for each hand in multi_hand_landmarks
        
        hand_data = []
        for i, hand_lms in enumerate(self.results.multi_hand_landmarks):
            handedness = self.results.multi_handedness[i].classification[0].label
            # label is 'Left' or 'Right'
            lms = []
            # First landmark is the wrist (index 0)
            wrist = hand_lms.landmark[0]
            for lm in hand_lms.landmark:
                # Store coordinates relative to the wrist
                lms.extend([lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z])
            hand_data.append((handedness, lms))

        # We want a consistent order. Let's say: Left hand first (first 63 values), Right hand second (next 63 values)
        # If only one hand is detected, we check which one it is.
        for handedness, lms in hand_data:
            if handedness == 'Left':
                landmarks[0:63] = lms
            elif handedness == 'Right':
                landmarks[63:126] = lms

        return landmarks

if __name__ == "__main__":
    # Test script
    cap = cv2.VideoCapture(0)
    detector = AdvancedHandDetector()
    while True:
        success, img = cap.read()
        if not success:
            break
        img = detector.find_hands(img)
        lms = detector.get_landmarks()
        cv2.putText(img, f"Landmarks: {len(lms)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow("Test", img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
