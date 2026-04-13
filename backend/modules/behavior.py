import pickle
import numpy as np

model = pickle.load(open("models/behavior_model.pkl", "rb"))

levels = {
    0: "Poor Behaviour",
    1: "Average Behaviour",
    2: "Good Behaviour"
}

def predict_behavior(social_media, decision_making, risk_taking, consistency, impulsive, planning, stress_resistance):
    data = np.array([[social_media, decision_making, risk_taking, consistency, impulsive, planning, stress_resistance]])
    pred = model.predict(data)[0]
    return levels[pred]