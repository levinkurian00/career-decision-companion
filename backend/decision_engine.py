from scorer import calculate_weighted_scores, rank_careers

DEFAULT_SCORES = {
    "Web Development": {
        "Salary Potential": 7,
        "Job Demand": 8,
        "Learning Curve Difficulty": 8,
        "Personal Interest": 9,
        "Work-Life Balance": 7
    },
    "Data Science": {
        "Salary Potential": 9,
        "Job Demand": 8,
        "Learning Curve Difficulty": 6,
        "Personal Interest": 7,
        "Work-Life Balance": 6
    },
    "AI/ML Engineering": {
        "Salary Potential": 9,
        "Job Demand": 7,
        "Learning Curve Difficulty": 5,
        "Personal Interest": 6,
        "Work-Life Balance": 6
    },
    "Cybersecurity": {
        "Salary Potential": 8,
        "Job Demand": 9,
        "Learning Curve Difficulty": 5,
        "Personal Interest": 6,
        "Work-Life Balance": 8
    },
    "Cloud/DevOps": {
        "Salary Potential": 8,
        "Job Demand": 8,
        "Learning Curve Difficulty": 6,
        "Personal Interest": 7,
        "Work-Life Balance": 7
    }
}

def normalize_weights(raw_weights):
    total = sum(raw_weights.values())
    return {k: v / total for k, v in raw_weights.items()}

def evaluate(raw_weights):
    weights = normalize_weights(raw_weights)
    final_scores = calculate_weighted_scores(weights, DEFAULT_SCORES)
    ranked = rank_careers(final_scores)
    return ranked
