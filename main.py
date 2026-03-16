import cv2
from hand_tracking.hand_detector import HandDetector
from gesture_detection.gesture_classifier import GestureClassifier

def main():

    cap = cv2.VideoCapture(0)
    detector = HandDetector()
    classifier = GestureClassifier()

    while True:
        success, frame = cap.read()

        if not success:
            break

        frame = cv2.flip(frame, 1)
        frame, landmarks = detector.detect_hand(frame)

        if landmarks:
            gesture = classifier.classify(landmarks)
            cv2.putText(frame, f"Gesture: {gesture}", (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        else:
            cv2.putText(frame, "No hand detected", (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        cv2.imshow("Sign Language Detection", frame)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
