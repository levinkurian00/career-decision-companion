from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from decision_engine import evaluate

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WeightInput(BaseModel):
    weights: Dict[str, float]

@app.get("/")
def root():
    return {"message": "Career Decision Companion API Running"}

@app.post("/evaluate")
def evaluate_career(data: WeightInput):
    result = evaluate(data.weights)
    return {"ranking": result}
