from validator import validate_weights, validate_scores
from scorer import calculate_weighted_scores, rank_careers


def get_weights(criteria):
    raw_weights = {}

    print("\nRate the importance of each criterion (1–10 scale):")

    for criterion in criteria:
        value = float(input(f"Importance for {criterion} (1–10): "))
        raw_weights[criterion] = value

    # Normalize automatically
    total = sum(raw_weights.values())

    if total == 0:
        raise ValueError("Total importance cannot be zero.")

    normalized_weights = {
        criterion: round(value / total, 4)
        for criterion, value in raw_weights.items()
    }

    print("\nNormalized Weights Used Internally:")
    for k, v in normalized_weights.items():
        print(f"{k}: {v}")

    return normalized_weights


def modify_scores(scores):
    print("\nCurrent default scores:")
    for career, criteria_scores in scores.items():
        print(f"\n{career}")
        for criterion, score in criteria_scores.items():
            print(f"  {criterion}: {score}")

    choice = input("\nDo you want to modify any scores? (y/n): ").lower()

    if choice == 'y':
        career_name = input("Enter career name to modify: ")

        if career_name in scores:
            criterion_name = input("Enter criterion to modify: ")

            if criterion_name in scores[career_name]:
                new_score = float(input("Enter new score (1–10): "))
                scores[career_name][criterion_name] = new_score
            else:
                print("Invalid criterion.")
        else:
            print("Invalid career.")

    return scores


def main():
    careers = [
        "Web Development",
        "Data Science",
        "AI/ML Engineering",
        "Cybersecurity",
        "Cloud/DevOps"
    ]

    criteria = [
        "Salary Potential",
        "Job Demand",
        "Learning Curve Difficulty",
        "Personal Interest",
        "Work-Life Balance"
    ]

    # Default reference scores
    scores = {
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

    try:
        weights = get_weights(criteria)
        validate_weights(weights)

        scores = modify_scores(scores)
        validate_scores(scores)

        final_scores = calculate_weighted_scores(weights, scores)
        ranked = rank_careers(final_scores)

        print("\nFinal Ranking:")
        for i, (career, score) in enumerate(ranked, start=1):
            print(f"{i}. {career} – {score}")

    except ValueError as e:
        print(f"\nError: {e}")


if __name__ == "__main__":
    main()
