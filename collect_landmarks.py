import cv2
import csv
import os
from hand_tracking.hand_detector import HandDetector

os.makedirs("data", exist_ok=True)

detector = HandDetector()
cap = cv2.VideoCapture(0)

label = input("Enter letter (A-Z): ").strip().upper()

print(f"Collecting data for letter: {label}")
print("Press ESC to stop...")

with open("data/landmarks_data.csv", "a", newline="") as f:
    writer = csv.writer(f)

    while True:
        success, frame = cap.read()

        if not success:
            print("Failed to read from camera.")
            break

        frame, landmarks = detector.detect_hand(frame)

        if landmarks:
            row = []
            for x, y in landmarks:
                row.append(x)
                row.append(y)
            row.append(label)
            writer.writerow(row)
            cv2.putText(frame, f"Collecting: {label}", (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        else:
            cv2.putText(frame, "No hand detected", (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        cv2.imshow("Collecting Data", frame)

        if cv2.waitKey(1) == 27:
            print("Stopped.")
            break

cap.release()
cv2.destroyAllWindows()
