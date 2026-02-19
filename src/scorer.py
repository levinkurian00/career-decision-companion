def calculate_weighted_scores(weights, scores):
    final_scores = {}

    for career, criteria_scores in scores.items():
        total_score = 0
        for criterion, score in criteria_scores.items():
            weight = weights.get(criterion, 0)
            total_score += weight * score

        final_scores[career] = round(total_score, 2)

    return final_scores


def rank_careers(final_scores):
    return sorted(final_scores.items(), key=lambda x: x[1], reverse=True)
