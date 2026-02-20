# 🎯 Career Decision Companion System

> A structured, data-driven tool to help engineering graduates evaluate and choose careers — transparently, personally, and without guesswork.

---

### Problem Understanding

Career decision-making is inherently multi-dimensional. Engineering graduates must evaluate conflicting factors such as salary potential, job demand, learning curve difficulty, lifestyle balance, and long-term growth. These factors vary in importance from person to person, making purely emotional or trend-driven decisions unreliable.

The **Career Decision Companion System** models career selection as a structured **multi-criteria decision problem**, enabling users to evaluate trade-offs transparently and quantitatively.

---

### Career Options

The system evaluates five career paths — **Web Development**, **Data Science**, **AI/ML Engineering**, **Cybersecurity**, and **Cloud/DevOps** — each scored across six criteria: Salary Potential, Job Demand, Learning Curve Difficulty, Personal Interest, Work-Life Balance, and Future Growth. Every criterion is rated on a scale of **1–10**.

---

### Evaluation Criteria

| Criterion | What It Measures | Scale |
|---|---|---|
| Salary Potential | Expected compensation levels | 1–10 |
| Job Demand | Current and projected hiring activity | 1–10 |
| Learning Curve Difficulty | Effort required to reach proficiency | 1–10 |
| Personal Interest | Subjective engagement and passion | 1–10 |
| Work-Life Balance | Typical hours, flexibility, and stress | 1–10 |
| Future Growth | Long-term career trajectory and relevance | 1–10 |

---

### Input Model

Users rate the **importance** of each criterion on a 1–10 scale using sliders in the frontend. Instead of requiring weights to manually sum to 1, the system automatically normalizes the importance values:

```
weight_i = importance_i / Σ importance
```

This ensures **proportional influence**, **mathematical correctness**, and an improved user experience with no manual balancing required. Career performance scores are predefined within the system and represent structured domain assumptions.

---

### Scoring Methodology

#### Decision Model

The system evaluates careers using **deterministic weighted aggregation**. After normalizing user-provided importance values, the system computes:

```
Final Score = Σ (normalized_weight × career_score)
```

Careers are then ranked in descending order of final score. This approach ensures **personalization** (users control importance), **transparency** (no black-box logic), **reproducibility** (same input → same output), and **structured trade-off evaluation**.

**Example normalized weights:**

```python
weights = {
    "Salary Potential":          0.30,
    "Job Demand":                0.25,
    "Learning Curve Difficulty": 0.15,
    "Personal Interest":         0.20,
    "Work-Life Balance":         0.10,
    "Future Growth":             0.00  # dynamically computed from user input
}
```

**Example API request/response:**

```json
// POST /evaluate
{
  "importance": {
    "Salary Potential": 9,
    "Job Demand": 7,
    "Learning Curve Difficulty": 5,
    "Personal Interest": 8,
    "Work-Life Balance": 6,
    "Future Growth": 9
  }
}

// Response
{
  "rankings": [
    { "career": "AI/ML Engineering", "score": 8.42 },
    { "career": "Data Science",      "score": 8.15 },
    { "career": "Cloud/DevOps",      "score": 7.90 },
    { "career": "Cybersecurity",     "score": 7.45 },
    { "career": "Web Development",   "score": 7.12 }
  ]
}
```

---

### Assumptions

- Criteria are treated as **independent dimensions** (no interaction effects modeled).
- Career performance scores are **structured domain approximations**, not sourced from live data.
- The model simplifies qualitative emotional factors into numerical form.
- The system provides **structured guidance**, not absolute truth, and does not account for regional job market variation or individual educational background.

---

### System Overview

The system is implemented as a full-stack web application built with **React + Vite** on the frontend and **FastAPI (Python)** on the backend, with a custom Python decision engine handling all weighted scoring and ranking. To run it locally:

```bash
# Backend (FastAPI)
pip install -r requirements.txt
uvicorn app.main:app --reload
# API at http://localhost:8000 | Docs at http://localhost:8000/docs

# Frontend (React)
cd frontend && npm install && npm run dev
# App at http://localhost:5173
```

The stack is divided into four components: **Frontend (React)** collects user preferences through slider-based inputs and displays ranked results. **Backend (FastAPI)** exposes a REST API, normalizes importance values, and delegates computation to the decision engine. The **Decision Engine** performs deterministic weighted aggregation and produces ranked output. The **Domain Configuration Layer** defines career options, evaluation criteria, and stores default performance scores. The architecture ensures clean separation of concerns between presentation, computation, and domain configuration.

---

### System Design

The Career Decision Companion System is designed as a modular, deterministic decision engine that evaluates career options using weighted multi-criteria decision analysis. The system prioritizes **transparency**, **flexibility**, **explainability**, and **extensibility**.

#### 1. Architectural Overview

The system is logically divided into five components: the **Input Handler** collects user-defined importance values; the **Normalization Module** converts importance ratings into proportional weights; the **Scoring Engine** computes final weighted scores for each career; the **Ranking Module** sorts careers based on computed scores; and the **API Layer** exposes evaluation functionality via REST endpoint. This modular structure ensures clean separation of responsibilities and future scalability.

#### 2. Data Model

The system internally stores structured data using dictionary-based models. Weight values are dynamically computed from user-provided importance ratings at runtime — the example above shows a representative normalized output. Career scores follow the same structure, with each career mapped to its scores across all six criteria.

---

*Built to help engineers make smarter career decisions — one weighted score at a time.*