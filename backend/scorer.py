def calculate_weighted_scores(weights, careers):
    results = {}

    for career_name, scores in careers.items():
        total_score = 0
        contributions = {}

        for criterion, weight in weights.items():
            contribution = weight * scores[criterion]
            contributions[criterion] = contribution
            total_score += contribution

        results[career_name] = {
            "total_score": total_score,
            "contributions": contributions
        }

    return results


def rank_careers(final_scores):
    ranked = sorted(
        final_scores.items(),
        key=lambda x: x[1]["total_score"],
        reverse=True
    )

    return ranked