import pickle
import numpy as np
import os

model_path = os.path.join("models", "model.pkl")
model = pickle.load(open("models/model.pkl", "rb"))

levels = {
    0: "Low",
    1: "Moderate",
    2: "High",
    3: "Critical"
}

def predict_burnout(sleep, study, screen, exercise, social, assignments, mood):

    input_data = np.array([[sleep, study, screen, exercise, social, assignments, mood]])

    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)
    score = int(max(probability[0]) * 100)

    suggestion = generate_suggestion(sleep, study, exercise, mood, prediction)

    return levels[prediction], score, suggestion


def generate_suggestion(sleep, study, exercise, mood, prediction):

    if prediction == 3:
        return "Critical burnout detected. Immediate rest and workload reduction required."

    if sleep < 5:
        return "Low sleep detected. Improve sleep schedule."

    if study > 9:
        return "High academic load detected. Consider better time management."

    if exercise == 0:
        return "No physical activity detected. Add light exercise."

    if mood < 4:
        return "Low mood detected. Increase social interaction."

    return "Balanced lifestyle. Maintain current routine."
