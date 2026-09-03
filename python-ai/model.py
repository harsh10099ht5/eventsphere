import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ============================================================
# EVENT DATASET
# ============================================================

events = [
    {
        "id": 1,
        "title": "Tech Fest 2026",
        "category": "Technical",
        "description": "Technology, innovation, coding, robotics and emerging technologies.",
        "skills": "technology coding robotics innovation programming",
    },
    {
        "id": 2,
        "title": "Coding Competition",
        "category": "Technical",
        "description": "Competitive programming, algorithms, problem solving and software development.",
        "skills": "coding programming algorithms problem solving software development",
    },
    {
        "id": 3,
        "title": "AI & Machine Learning Workshop",
        "category": "Workshop",
        "description": "Artificial intelligence, machine learning, data science and practical projects.",
        "skills": "AI artificial intelligence machine learning data science python deep learning",
    },
    {
        "id": 4,
        "title": "Python Workshop",
        "category": "Workshop",
        "description": "Python programming, automation, development and practical coding sessions.",
        "skills": "python programming coding automation development",
    },
    {
        "id": 5,
        "title": "Campus Hackathon",
        "category": "Hackathon",
        "description": "Build innovative software solutions and solve real world problems with a team.",
        "skills": "hackathon coding innovation software development teamwork problem solving",
    },
    {
        "id": 6,
        "title": "Innovation Challenge",
        "category": "Hackathon",
        "description": "Create innovative solutions using technology, creativity and entrepreneurship.",
        "skills": "innovation technology startup entrepreneurship creativity problem solving",
    },
    {
        "id": 7,
        "title": "Cultural Fest",
        "category": "Cultural",
        "description": "Music, dance, drama, art and cultural activities.",
        "skills": "music dance drama art culture performance creativity",
    },
    {
        "id": 8,
        "title": "Sports Meet",
        "category": "Sports",
        "description": "Inter-college sports competition including athletics, cricket and football.",
        "skills": "sports cricket football athletics fitness competition",
    },
]


# ============================================================
# DATAFRAME
# ============================================================

df = pd.DataFrame(events)


# ============================================================
# FEATURE ENGINEERING
# ============================================================

df["features"] = (
    df["title"]
    + " "
    + df["category"]
    + " "
    + df["description"]
    + " "
    + df["skills"]
)


# ============================================================
# TF-IDF MODEL
# ============================================================

vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2)
)

event_vectors = vectorizer.fit_transform(df["features"])


# ============================================================
# CATEGORY KEYWORDS
# ============================================================

category_keywords = {
    "technical": [
        "technical",
        "technology",
        "coding",
        "programming",
        "software",
        "computer",
        "development",
    ],
    "workshop": [
        "workshop",
        "learning",
        "training",
        "python",
        "ai",
        "machine learning",
    ],
    "hackathon": [
        "hackathon",
        "innovation",
        "startup",
        "problem solving",
        "competition",
    ],
    "cultural": [
        "cultural",
        "music",
        "dance",
        "drama",
        "art",
        "performance",
    ],
    "sports": [
        "sports",
        "cricket",
        "football",
        "athletics",
        "fitness",
    ],
}


# ============================================================
# RECOMMENDATION FUNCTION
# ============================================================

def recommend_events(
    interest,
    preferred_category=None,
    top_n=3
):
    """
    Recommend events using TF-IDF + cosine similarity.

    Parameters:
        interest: Student's interest text
        preferred_category: Optional event category
        top_n: Number of recommendations

    Returns:
        List of recommended events
    """

    if not interest or not interest.strip():
        return []

    interest = interest.strip()

    # --------------------------------------------------------
    # Convert student interest into vector
    # --------------------------------------------------------

    user_vector = vectorizer.transform([interest])

    # --------------------------------------------------------
    # Calculate similarity
    # --------------------------------------------------------

    similarity_scores = cosine_similarity(
        user_vector,
        event_vectors
    )[0]

    # --------------------------------------------------------
    # Create result dataframe
    # --------------------------------------------------------

    results = df.copy()

    results["score"] = similarity_scores

    # --------------------------------------------------------
    # Category boost
    # --------------------------------------------------------

    if preferred_category:
        category = preferred_category.lower().strip()

        results.loc[
            results["category"].str.lower() == category,
            "score"
        ] += 0.20

    # --------------------------------------------------------
    # Keyword boost
    # --------------------------------------------------------

    interest_lower = interest.lower()

    for category, keywords in category_keywords.items():

        if any(keyword in interest_lower for keyword in keywords):

            results.loc[
                results["category"].str.lower() == category,
                "score"
            ] += 0.15

    # --------------------------------------------------------
    # Sort recommendations
    # --------------------------------------------------------

    results = results.sort_values(
        by="score",
        ascending=False
    )

    results = results.head(top_n)

    # --------------------------------------------------------
    # Format API response
    # --------------------------------------------------------

    recommendations = []

    for _, row in results.iterrows():

        score = float(row["score"])

        # Keep score between 0 and 1
        score = min(score, 1.0)

        recommendations.append({
            "id": int(row["id"]),
            "title": row["title"],
            "category": row["category"],
            "description": row["description"],
            "match_score": round(score * 100, 2),
            "reason": generate_reason(
                interest,
                row["category"],
                score
            )
        })

    return recommendations


# ============================================================
# RECOMMENDATION REASON
# ============================================================

def generate_reason(
    interest,
    category,
    score
):
    """
    Generate a simple human-readable explanation.
    """

    if score >= 0.70:
        level = "Very strong match"
    elif score >= 0.40:
        level = "Strong match"
    elif score >= 0.20:
        level = "Good match"
    else:
        level = "Possible match"

    return (
        f"{level} based on your interest in "
        f"{interest} and the {category} event category."
    )


# ============================================================
# TESTING
# ============================================================

if __name__ == "__main__":

    print("=" * 60)
    print("EVENTSPHERE AI RECOMMENDATION ENGINE")
    print("=" * 60)

    interest = input(
        "\nEnter your interest: "
    )

    recommendations = recommend_events(
        interest=interest,
        top_n=3
    )

    print("\nRecommended Events")
    print("-" * 60)

    if not recommendations:

        print("No suitable events found.")

    else:

        for index, event in enumerate(
            recommendations,
            start=1
        ):

            print(
                f"\n{index}. {event['title']}"
            )

            print(
                f"   Category: {event['category']}"
            )

            print(
                f"   Match: {event['match_score']}%"
            )

            print(
                f"   Reason: {event['reason']}"
            )