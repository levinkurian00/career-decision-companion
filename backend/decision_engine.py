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


def evaluate(sector_name: str, raw_weights: dict):
    """
    Main evaluation function.

    Steps:
    1. Validate sector and weights
    2. Normalize importance values
    3. Calculate weighted scores
    4. Rank careers
    """

    # Validate sector + weights
    validate_weights(sector_name, raw_weights)

    # Normalize user importance ratings
    normalized_weights = normalize_weights(raw_weights)

    # Get career data for selected sector
    careers = SECTORS[sector_name]["careers"]

    # Calculate final weighted scores
    final_scores = calculate_weighted_scores(normalized_weights, careers)

    # Rank careers
    ranked = rank_careers(final_scores)

    return ranked