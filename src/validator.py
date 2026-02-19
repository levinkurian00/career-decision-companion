def validate_weights(weights):
    for key, value in weights.items():
        if value < 0:
            raise ValueError(f"Weight for {key} cannot be negative.")


def validate_scores(scores):
    for career, criteria_scores in scores.items():
        for criterion, score in criteria_scores.items():
            if score < 1 or score > 10:
                raise ValueError(
                    f"Score for {career} under {criterion} must be between 1 and 10."
                )
