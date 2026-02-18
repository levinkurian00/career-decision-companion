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

Normalization ensures that differences in score ranges across criteria do not unfairly influence the final ranking.

---

## Assumptions

- Criteria are independent of each other.
- Users provide honest and informed scores.
- The 1–10 scale is consistent across all criteria.