import pickle
import numpy as np
import os

class GestureClassifier:

    def __init__(self, model_path="models/gesture_model.pkl"):

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at '{model_path}'. Please run train_model.py first.")

        self.model = pickle.load(open(model_path, "rb"))
        print("Model loaded successfully!")

    def classify(self, landmarks):

        if len(landmarks) != 21:
            return "Unknown"

        data = []

        for x, y in landmarks:
            data.append(x)
            data.append(y)

        data = np.array(data).reshape(1, -1)
        prediction = self.model.predict(data)

        return prediction[0]
