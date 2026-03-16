import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import glob

os.makedirs("models", exist_ok=True)

# Find all CSV files in the data directory
csv_files = glob.glob("data/*.csv")
print(f"Found {len(csv_files)} CSV files: {csv_files}")

# Read and combine all CSV files
dfs = []
for file in csv_files:
    df = pd.read_csv(file, header=None)
    dfs.append(df)

if not dfs:
    print("No CSV files found in 'data/' directory.")
    exit()

data = pd.concat(dfs, ignore_index=True)

X = data.iloc[:, :-1]
y = data.iloc[:, -1]

print(f"Total samples: {len(data)}")
print(f"Classes found: {sorted(y.unique())}")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy * 100:.2f}%")

pickle.dump(model, open("models/gesture_model.pkl", "wb"))
print("Model saved to models/gesture_model.pkl")

