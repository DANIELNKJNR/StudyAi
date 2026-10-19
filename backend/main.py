from pathlib import Path

import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

# Allow requests from our React frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Find the saved model file relative to this Python file.
MODEL_PATH = Path(__file__).parent / "student_grade_model.joblib"
model = joblib.load(MODEL_PATH)


class StudentData(BaseModel):
    studytime: int = Field(ge=1, le=4)
    absences: int = Field(ge=0)
    G1: float = Field(ge=0, le=20)
    G2: float = Field(ge=0, le=20)


@app.get("/")
def home():
    return {"message": "StudyAi API is running!"}


@app.post("/predict")
def predict(student: StudentData):
    features = [[
        student.studytime,
        student.absences,
        student.G1,
        student.G2,
    ]]

    prediction = model.predict(features)[0]


    return {
        "predicted_grade": round(float(prediction), 2)
    }