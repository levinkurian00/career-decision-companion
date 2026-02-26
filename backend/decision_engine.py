from domain_config import SECTORS
from scorer import calculate_weighted_scores, rank_careers


def normalize_weights(raw_weights: dict) -> dict:
    """
    Converts user-provided importance values into proportional weights.
    """
    total = sum(raw_weights.values())

    if total == 0:
        raise ValueError("Total importance cannot be zero.")

    return {criterion: value / total for criterion, value in raw_weights.items()}


def validate_weights(sector_name: str, raw_weights: dict):
    """
    Ensures that:
    - Sector exists
    - All required criteria are present
    - No extra criteria are included
    """
    if sector_name not in SECTORS:
        raise ValueError("Invalid sector selected.")

    expected_criteria = set(SECTORS[sector_name]["criteria"])
    provided_criteria = set(raw_weights.keys())

    if expected_criteria != provided_criteria:
        raise ValueError("Mismatch between required criteria and provided weights.")


def generate_explanation(top_career_name, career_data, weights):
    contributions = career_data["contributions"]

    # Sort criteria by contribution
    sorted_criteria = sorted(
        contributions.items(),
        key=lambda x: x[1],
        reverse=True
    )

    top_criteria = sorted_criteria[:2]

    explanation = f"{top_career_name} ranked highest mainly because of strong performance in "

    explanation += " and ".join([criterion for criterion, _ in top_criteria])
    explanation += " based on your importance preferences."

    return explanation

def generate_comparison_explanation(top_career, second_career, weights):
    """
    Compare top two careers and explain why second ranked lower.
    """

    top_contrib = top_career["contributions"]
    second_contrib = second_career["contributions"]

    differences = {}

    for criterion in top_contrib:
        differences[criterion] = top_contrib[criterion] - second_contrib.get(criterion, 0)

    # Sort by largest difference
    sorted_diff = sorted(
        differences.items(),
        key=lambda x: x[1],
        reverse=True
    )

    # Take top 2 differentiators
    top_reasons = [crit for crit, val in sorted_diff[:2] if val > 0]

    if not top_reasons:
        return "The top two careers performed very similarly across most criteria."

    return (
        f"The second-ranked career scored lower mainly due to weaker performance in "
        f"{' and '.join(top_reasons)} compared to the top-ranked option."
    )

def evaluate(sector_name, raw_weights):
    validate_weights(sector_name, raw_weights)

    normalized_weights = normalize_weights(raw_weights)
    careers = SECTORS[sector_name]["careers"]

    final_scores = calculate_weighted_scores(normalized_weights, careers)
    ranked = rank_careers(final_scores)

    top_career_name = ranked[0][0]
    top_career_data = ranked[0][1]

    comparison_explanation = ""
    if len(ranked) > 1:
        second_career_data = ranked[1][1]
        comparison_explanation = generate_comparison_explanation(
        top_career_data,
        second_career_data,
        normalized_weights
    )

    explanation = generate_explanation(
        top_career_name,
        top_career_data,
        normalized_weights
    )

    return {
    "ranking": [
        (career, data["total_score"])
        for career, data in ranked
    ],
    "explanation": explanation,
    "comparison_explanation": comparison_explanation
}

def generate_weights_from_quiz(sector_name, quiz_answers):
    """
    Converts abstract quiz preferences into sector-specific weight vector.
    """

    sector = SECTORS[sector_name]
    criteria = sector["criteria"]

    # Initialize base weights
    weights = {criterion: 1 for criterion in criteria}

    # Abstract preference signals
    abstract_mapping = {
        "q1": "financial_growth",
        "q2": "market_opportunity",
        "q3": "challenge_tolerance",
        "q4": "work_life_balance",
        "q5": "long_term_growth",
        "q6": "intellectual_stimulation"
    }

    # Sector-specific mapping
    sector_mapping = {
        "Technology": {
            "financial_growth": "Salary Potential",
            "market_opportunity": "Market Vacancy (India)",
            "challenge_tolerance": "Learning Curve Difficulty",
            "work_life_balance": "Work-Life Balance",
            "long_term_growth": "Job Demand",
            "intellectual_stimulation": "Learning Curve Difficulty"
        },
        "Finance": {
            "financial_growth": "Compensation Growth",
            "market_opportunity": "Market Vacancy (India)",
            "challenge_tolerance": "Work Pressure",
            "work_life_balance": "Market Stability",
            "long_term_growth": "Compensation Growth",
            "intellectual_stimulation": "Work Pressure"
        },
        "Government Services": {
            "financial_growth": "Salary Growth",
            "market_opportunity": "Market Vacancy (India)",
            "challenge_tolerance": "Competitive Difficulty",
            "work_life_balance": "Work-Life Balance",
            "long_term_growth": "Job Security",
            "intellectual_stimulation": "Social Impact"
        },
        "Management & Business": {
            "financial_growth": "Income Potential",
            "market_opportunity": "Market Vacancy (India)",
            "challenge_tolerance": "Work Pressure",
            "work_life_balance": "Career Flexibility",
            "long_term_growth": "Leadership Growth",
            "intellectual_stimulation": "Entrepreneurial Exposure"
        }
    }

    for question_id, answer in quiz_answers.items():
        abstract_signal = abstract_mapping.get(question_id)

        if abstract_signal:
            mapped_criterion = sector_mapping[sector_name].get(abstract_signal)

            if mapped_criterion in weights:
                weights[mapped_criterion] += answer

    return weights

def determine_sector_from_quiz(quiz_answers):
    """
    Determine best-fit sector based on abstract preference signals.
    """

    sector_scores = {
        "Technology": 0,
        "Finance": 0,
        "Government Services": 0,
        "Management & Business": 0
    }

    for q, value in quiz_answers.items():

        if q == "q1":  # Financial Growth
            sector_scores["Technology"] += value
            sector_scores["Finance"] += value
            sector_scores["Management & Business"] += value

        elif q == "q2":  # Market Opportunity
            sector_scores["Technology"] += value
            sector_scores["Finance"] += value

        elif q == "q3":  # Challenge
            sector_scores["Technology"] += value
            sector_scores["Management & Business"] += value

        elif q == "q4":  # Work-life balance
            sector_scores["Government Services"] += value
            sector_scores["Finance"] += value

        elif q == "q5":  # Long-term growth
            sector_scores["Technology"] += value
            sector_scores["Management & Business"] += value

        elif q == "q6":  # Intellectual stimulation
            sector_scores["Technology"] += value
            sector_scores["Finance"] += value

    return max(sector_scores, key=sector_scores.get)