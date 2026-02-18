## Problem Understanding

Many engineering students struggle to choose a career path because multiple factors influence the decision, such as salary expectations, job demand, personal interest, and long-term growth. These factors often conflict, leading to confusion or emotional decision-making.

This system provides a structured, quantitative approach using weighted multi-criteria decision analysis to help users evaluate career paths logically and transparently.

---

## Career Options

- Web Development
- Data Science
- AI/ML Engineering
- Cybersecurity
- Cloud/DevOps

---

## Evaluation Criteria

- Salary Potential
- Job Demand
- Learning Curve Difficulty
- Personal Interest
- Work-Life Balance
- Future Growth

Each criterion will be evaluated on a scale of 1–10.

---

## Input Model

The system requires:

1. The user to assign a weight to each criterion (e.g., Salary = 0.3).
    
    The total of all weights must equal 1.
    
2. The user to assign a score (1–10) for each career under each criterion.

---

## Scoring Methodology

Step 1: Normalize all criterion scores to a range of 0–1 to ensure comparability.

Step 2: Multiply each normalized score by its corresponding weight.

Step 3: Sum all weighted values to calculate a final score for each career.

Step 4: Rank careers based on total score.

---

## Why Weighted Scoring?

Weighted scoring is used because different users prioritize criteria differently. This approach allows personalization while maintaining transparency.

---

## Why Normalization?

Normalization ensures that all criteria are scaled uniformly, preventing any single criterion from disproportionately influencing the final ranking due to scale differences.

---

## Assumptions

- Criteria are independent of each other.
- Users provide honest and informed scores.
- The 1–10 scale is consistent across all criteria.
- The decision model does not capture qualitative emotional factors beyond the defined criteria.

## System Design

The Career Decision Companion System is designed as a modular, deterministic decision engine that evaluates career options using weighted multi-criteria decision analysis.

The system prioritizes transparency, flexibility, and explainability over complexity.

---

### 1. Architectural Overview

The system is divided into the following logical components:

1. Input Handler  
   Collects user-defined weights and scores for each career option.

2. Validator  
   Ensures:
   - Weights are valid numbers
   - Weights sum to 1
   - Scores are within the allowed range (1–10)
   - No missing inputs

3. Normalization Engine  
   Scales all scores between 0 and 1 to ensure fair comparison across criteria.

4. Scoring Engine  
   Computes the final weighted score for each career.

5. Sensitivity Analyzer  
   Tests the stability of rankings by slightly modifying the most important criterion.

6. Explanation Generator  
   Produces a transparent explanation of why a particular career ranked highest.

This modular structure ensures separation of concerns and makes the system easy to extend or convert into an API in future iterations.

---

### 2. Data Model

The system internally stores information using structured dictionary-based models.

#### Weights Structure

```python
weights = {
    "Salary Potential": 0.3,
    "Job Demand": 0.25,
    "Learning Curve Difficulty": 0.15,
    "Personal Interest": 0.2,
    "Work-Life Balance": 0.1
}

These values are illustrative examples. In the actual implementation, weights are dynamically provided by the user.