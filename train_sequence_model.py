import numpy as np
import os
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Bidirectional, Input
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping

# Path for exported data, numpy arrays
DATA_PATH = os.path.join('dataset') 

# UPDATED Actions List
actions = np.array([
    "HELP", "STOP", "CALL", "POLICE", "DOCTOR", "HOSPITAL",
    "EMERGENCY", "FIRE", "SAFE", "WAIT",
    "PAIN", "MEDICINE", "SICK", "INJURY", "FEVER",
    "WATER", "FOOD", "HUNGRY", "THIRSTY",
    "YES", "NO", "PLEASE", "SORRY", "THANK YOU",
    "ME", "YOU", "HOME", "HERE"
])

# Videos are going to be 30 frames in length
sequence_length = 30

label_map = {label:num for num, label in enumerate(actions)}

sequences, labels = [], []
for action in actions:
    action_path = os.path.join(DATA_PATH, action)
    if not os.path.exists(action_path):
        print(f"Skipping action '{action}' as no data was found.")
        continue
        
    # Get all sequence folders that exist
    available_sequences = [int(s) for s in os.listdir(action_path) if s.isdigit()]
    print(f"Loading {len(available_sequences)} sequences for action: {action}")
    
    for sequence in available_sequences:
        window = []
        # Check if all 30 frames exist for this sequence
        valid_sequence = True
        for frame_num in range(sequence_length):
            frame_path = os.path.join(DATA_PATH, action, str(sequence), "{}.npy".format(frame_num))
            if os.path.exists(frame_path):
                res = np.load(frame_path)
                window.append(res)
            else:
                valid_sequence = False
                break
        
        if valid_sequence:
            sequences.append(window)
            labels.append(label_map[action])
        else:
            print(f"Skipping sequence {sequence} for {action} (incomplete frames)")

if not sequences:
    print("Error: No valid sequences found in 'dataset/'. Please collect data first.")
    exit()

X = np.array(sequences)

# --- NEW: Only use actions that actually have data ---
unique_labels = np.unique(labels)
num_classes = len(unique_labels)
print(f"Total classes found with data: {num_classes}")

label_remapper = {old_idx: new_idx for new_idx, old_idx in enumerate(unique_labels)}
remapped_labels = [label_remapper[l] for l in labels]
actual_action_names = [actions[i] for i in unique_labels]

y = to_categorical(remapped_labels, num_classes=num_classes).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1)

# --- Build Improved Model Architecture ---
model = Sequential()
model.add(Input(shape=(30, 126)))
model.add(Bidirectional(LSTM(64, return_sequences=True, activation='relu')))
model.add(Dropout(0.2)) # ADDED Dropout for generalization
model.add(Bidirectional(LSTM(128, return_sequences=True, activation='relu')))
model.add(Dropout(0.2))
model.add(Bidirectional(LSTM(64, return_sequences=False, activation='relu')))
model.add(Dropout(0.2))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.2))
model.add(Dense(32, activation='relu'))
model.add(Dense(num_classes, activation='softmax'))

model.compile(optimizer='Adam', loss='categorical_crossentropy', metrics=['categorical_accuracy'])

# --- Train Model with Early Stopping ---
early_stopping = EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True)

print("Starting training...")
model.fit(X_train, y_train, epochs=300, callbacks=[early_stopping], validation_data=(X_test, y_test))

model.summary()

# --- Save Model & Action Labels ---
os.makedirs('models', exist_ok=True)
model.save('models/isl_sequence_model.h5')
np.save('models/actions.npy', actual_action_names)

print("Model successfully trained and saved to models/isl_sequence_model.h5")
print(f"Trained Actions: {actual_action_names}")
