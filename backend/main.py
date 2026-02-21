from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict

from decision_engine import evaluate
from domain_config import SECTORS

app = FastAPI(title="Career Decision Companion API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Request Model
# -----------------------------
class EvaluationRequest(BaseModel):
    sector: str
    weights: Dict[str, float]


# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/")
def root():
    return {
        "message": "Career Decision Companion API Running",
        "available_endpoints": [
            "/sectors",
            "/criteria/{sector_name}",
            "/evaluate"
        ]
    }


# -----------------------------
# Get All Available Sectors
# -----------------------------
@app.get("/sectors")
def get_sectors():
    return {"sectors": list(SECTORS.keys())}


# -----------------------------
# Get Criteria for Selected Sector
# -----------------------------
@app.get("/criteria/{sector_name}")
def get_criteria(sector_name: str):
    sector = SECTORS.get(sector_name)

    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")

    return {"criteria": sector["criteria"]}


# -----------------------------
# Evaluate Careers
# -----------------------------
@app.post("/evaluate")
def evaluate_career(request: EvaluationRequest):
    try:
        result = evaluate(request.sector, request.weights)
        return {"ranking": result}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))