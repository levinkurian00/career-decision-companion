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

def generate_comparison_explanation(
    top_name,
    second_name,
    top_data,
    second_data
):

    top_contributions = top_data["contributions"]
    second_contributions = second_data["contributions"]

    differences = {}

    for criterion in top_contributions:
        differences[criterion] = (
            top_contributions[criterion] -
            second_contributions[criterion]
        )

    # Find biggest differentiator
    key_factor = max(differences, key=differences.get)

    return (
        f"{second_name} ranked second mainly due to weaker performance in "
        f"{key_factor} compared to {top_name}."
    )

def evaluate(sector_name, raw_weights):
    validate_weights(sector_name, raw_weights)

    normalized_weights = normalize_weights(raw_weights)
    careers = SECTORS[sector_name]["careers"]

    final_scores = calculate_weighted_scores(normalized_weights, careers)
    ranked = rank_careers(final_scores)

    # ----- TOP CAREER -----
    top_career_name = ranked[0][0]
    top_career_data = ranked[0][1]

    explanation = generate_explanation(
        top_career_name,
        top_career_data,
        normalized_weights
    )

    # ----- COMPARISON (Rank 1 vs Rank 2) -----
    comparison_explanation = ""

    if len(ranked) > 1:
        second_career_name = ranked[1][0]
        second_career_data = ranked[1][1]

        comparison_explanation = generate_comparison_explanation(
            top_career_name,
            second_career_name,
            top_career_data,
            second_career_data
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

    tech_score = 0
    finance_score = 0

    for q, value in quiz_answers.items():

        # TECH SIGNALS
        if q in ["q3", "q6"]:
            tech_score += value * 2

        # FINANCE SIGNALS
        elif q in ["q7", "q8", "q9", "q10"]:
            finance_score += value * 2

        # NEUTRAL QUESTIONS
        elif q in ["q1", "q2", "q5"]:
            tech_score += value
            finance_score += value

        # WORK LIFE (slightly finance leaning)
        elif q == "q4":
            finance_score += value * 1.2

    print("Tech:", tech_score)
    print("Finance:", finance_score)

    print("Quiz Answers:", quiz_answers)
    print("Tech Score:", tech_score)
    print("Finance Score:", finance_score)

    if finance_score > tech_score:
        return "Finance"
    else:
        return "Technology"