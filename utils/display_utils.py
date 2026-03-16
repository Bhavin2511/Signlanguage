import cv2

def draw_text(frame, text, position=(20, 50), color=(0, 255, 0), scale=1, thickness=2):
    cv2.putText(frame, text, position, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thickness, cv2.LINE_AA)

def draw_box(frame, landmarks, color=(255, 0, 0), padding=20):
    if not landmarks:
        return
    x_list = [point[0] for point in landmarks]
    y_list = [point[1] for point in landmarks]
    x_min = min(x_list) - padding
    x_max = max(x_list) + padding
    y_min = min(y_list) - padding
    y_max = max(y_list) + padding
    cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), color, 2)

def display_gesture(frame, gesture):
    draw_text(frame, f"Gesture: {gesture}", position=(20, 50), color=(0, 255, 0), scale=1, thickness=2)

def draw_fps(frame, fps):
    draw_text(frame, f"FPS: {int(fps)}", position=(20, 90), color=(255, 255, 0), scale=0.8, thickness=2)
