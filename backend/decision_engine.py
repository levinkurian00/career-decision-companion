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


def evaluate(sector_name, raw_weights):
    validate_weights(sector_name, raw_weights)

    normalized_weights = normalize_weights(raw_weights)
    careers = SECTORS[sector_name]["careers"]

    final_scores = calculate_weighted_scores(normalized_weights, careers)
    ranked = rank_careers(final_scores)

    top_career_name = ranked[0][0]
    top_career_data = ranked[0][1]

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
        "explanation": explanation
    }