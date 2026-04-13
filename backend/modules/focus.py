import pickle
import numpy as np

model = pickle.load(open("models/focus_model.pkl", "rb"))

levels = {
    0: "Low Focus",
    1: "Moderate Focus",
    2: "High Focus"
}

def predict_focus(sleep, study, breaks, caffeine, pressure, attention, mood):

    data = np.array([[sleep, study, breaks, caffeine, pressure, attention, mood]])

    prediction = model.predict(data)[0]
    confidence = model.predict_proba(data).max()

    return levels[prediction], int(confidence * 100)