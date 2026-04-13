from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from modules.burnout import predict_burnout
from modules.focus import predict_focus
from modules.digital import calculate_digital_addiction
from modules.sleep import predict_sleep_risk
from modules.database import insert_report
from modules.behavior import predict_behavior

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BurnoutInput(BaseModel):
    sleep: int
    study: int
    screen: int
    exercise: int
    social: int
    assignments: int
    mood: int

class FocusInput(BaseModel):
    typing_speed: float
    error_rate: float
    task_switching: float
    focus_duration: float
    distractions: float
    reaction_time: float

class BehaviorInput(BaseModel):
    social_media: float
    decision_making: float
    risk_taking: float
    consistency: float
    impulsive: float
    planning: float
    stress_resistance: float

class FullInput(BaseModel):
    sleep: int
    study: int
    screen: int
    exercise: int
    social: int
    assignments: int
    mood: int

@app.post("/burnout")
def burnout(data: BurnoutInput):
    level, score, suggestion = predict_burnout(
        data.sleep,
        data.study,
        data.screen,
        data.exercise,
        data.social,
        data.assignments,
        data.mood
    )
    return {
        "level": level,
        "score": score,
        "suggestion": suggestion
    }

@app.post("/focus")
def focus(data: FocusInput):
    level, score = predict_focus(
        data.typing_speed,
        data.error_rate,
        data.task_switching,
        data.focus_duration,
        data.distractions,
        data.reaction_time
    )
    return {
        "level": level,
        "score": score
    }

@app.post("/behavior")
def behavior(data: BehaviorInput):
    level = predict_behavior(
        data.social_media,
        data.decision_making,
        data.risk_taking,
        data.consistency,
        data.impulsive,
        data.planning,
        data.stress_resistance
    )
    return {
        "level": level
    }

@app.post("/analyze")
def analyze(data: FullInput):
    burnout_level, burnout_score, suggestion = predict_burnout(
        data.sleep,
        data.study,
        data.screen,
        data.exercise,
        data.social,
        data.assignments,
        data.mood
    )

    sleep_level, sleep_msg = predict_sleep_risk(
        data.sleep,
        data.screen
    )

    digital_level, digital_score, digital_msg = calculate_digital_addiction(
        data.screen,
        data.sleep,
        data.social,
        data.exercise
    )

    insert_report({
        "Burnout Level": burnout_level,
        "Burnout Score": burnout_score,
        "Sleep Risk": sleep_level,
        "Digital Addiction Level": digital_level,
        "Digital Addiction Score": digital_score
    })

    return {
        "burnout": {
            "level": burnout_level,
            "score": burnout_score,
            "suggestion": suggestion
        },
        "sleep": {
            "level": sleep_level,
            "message": sleep_msg
        },
        "digital": {
            "level": digital_level,
            "score": digital_score,
            "message": digital_msg
        }
    }