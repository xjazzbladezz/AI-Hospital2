import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import pickle

df = pd.read_csv("data/focus_behavior_advanced.csv")

df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

X = df.drop("behavior_score", axis=1)
y = df["behavior_score"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

pickle.dump(model, open("models/behavior_model.pkl", "wb"))

print("Behavior model trained")