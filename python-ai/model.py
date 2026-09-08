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
        "description": (
            "Technology, innovation, coding, robotics "
            "and emerging technologies."
        ),
        "skills": (
            "technology coding robotics innovation programming"
        ),
    },

    {
        "id": 2,
        "title": "Coding Competition",
        "category": "Technical",
        "description": (
            "Competitive programming, algorithms, problem "
            "solving and software development."
        ),
        "skills": (
            "coding programming algorithms problem solving "
            "software development"
        ),
    },

    {
        "id": 3,
        "title": "AI & Machine Learning Workshop",
        "category": "Workshop",
        "description": (
            "Artificial intelligence, machine learning, "
            "data science and practical projects."
        ),
        "skills": (
            "AI artificial intelligence machine learning "
            "data science python deep learning"
        ),
    },

    {
        "id": 4,
        "title": "Python Workshop",
        "category": "Workshop",
        "description": (
            "Python programming, automation, development "
            "and practical coding sessions."
        ),
        "skills": (
            "python programming coding automation development"
        ),
    },

    {
        "id": 5,
        "title": "Campus Hackathon",
        "category": "Hackathon",
        "description": (
            "Build innovative software solutions and solve "
            "real world problems with a team."
        ),
        "skills": (
            "hackathon coding innovation software development "
            "teamwork problem solving"
        ),
    },

    {
        "id": 6,
        "title": "Innovation Challenge",
        "category": "Hackathon",
        "description": (
            "Create innovative solutions using technology, "
            "creativity and entrepreneurship."
        ),
        "skills": (
            "innovation technology startup entrepreneurship "
            "creativity problem solving"
        ),
    },

    {
        "id": 7,
        "title": "Cultural Fest",
        "category": "Cultural",
        "description": (
            "Music, dance, drama, art and cultural activities."
        ),
        "skills": (
            "music dance drama art culture performance creativity"
        ),
    },

    {
        "id": 8,
        "title": "Sports Meet",
        "category": "Sports",
        "description": (
            "Inter-college sports competition including "
            "athletics, cricket and football."
        ),
        "skills": (
            "sports cricket football athletics fitness competition"
        ),
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
    ngram_range=(1, 2),
)

event_vectors = vectorizer.fit_transform(
    df["features"]
)


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
# RECOMMENDATION REASON
# ============================================================

def generate_reason(
    interest,
    category,
    score,
):
    """
    Generate a human-readable explanation
    for the recommendation.
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
# RECOMMENDATION FUNCTION
# ============================================================

def recommend_events(
    interest,
    preferred_category=None,
    top_n=3,
):
    """
    Recommend events using:

    1. TF-IDF vectorization
    2. Cosine similarity
    3. Category boosting
    4. Keyword boosting

    Parameters
    ----------
    interest : str
        Student's interest text.

    preferred_category : str, optional
        Preferred event category.

    top_n : int
        Number of recommendations.

    Returns
    -------
    list
        List of recommended events.
    """

    # --------------------------------------------------------
    # Validate interest
    # --------------------------------------------------------

    if not interest or not interest.strip():
        return []

    interest = interest.strip()


    # --------------------------------------------------------
    # Validate top_n
    # --------------------------------------------------------

    try:
        top_n = int(top_n)
    except (TypeError, ValueError):
        top_n = 3

    top_n = max(1, min(top_n, len(df)))


    # --------------------------------------------------------
    # Convert student interest into vector
    # --------------------------------------------------------

    user_vector = vectorizer.transform(
        [interest]
    )


    # --------------------------------------------------------
    # Calculate cosine similarity
    # --------------------------------------------------------

    similarity_scores = cosine_similarity(
        user_vector,
        event_vectors,
    )[0]


    # --------------------------------------------------------
    # Create result dataframe
    # --------------------------------------------------------

    results = df.copy()

    results["score"] = similarity_scores


    # --------------------------------------------------------
    # Preferred category boost
    # --------------------------------------------------------

    if preferred_category:

        category = preferred_category.strip().lower()

        results.loc[
            results["category"].str.lower() == category,
            "score",
        ] += 0.20


    # --------------------------------------------------------
    # Interest keyword category boost
    # --------------------------------------------------------

    interest_lower = interest.lower()

    for category, keywords in category_keywords.items():

        keyword_found = any(
            keyword in interest_lower
            for keyword in keywords
        )

        if keyword_found:

            results.loc[
                results["category"].str.lower() == category,
                "score",
            ] += 0.15


    # --------------------------------------------------------
    # Sort recommendations
    # --------------------------------------------------------

    results = results.sort_values(
        by="score",
        ascending=False,
    )


    # --------------------------------------------------------
    # Get top N
    # --------------------------------------------------------

    results = results.head(top_n)


    # --------------------------------------------------------
    # Format API response
    # --------------------------------------------------------

    recommendations = []

    for _, row in results.iterrows():

        raw_score = float(row["score"])


        # Keep score between 0 and 1

        score = max(
            0.0,
            min(raw_score, 1.0),
        )


        recommendations.append(
            {
                "id": int(row["id"]),

                "title": str(row["title"]),

                "category": str(row["category"]),

                "description": str(
                    row["description"]
                ),

                "match_score": round(
                    score * 100,
                    2,
                ),

                "reason": generate_reason(
                    interest,
                    row["category"],
                    score,
                ),
            }
        )


    return recommendations


# ============================================================
# TESTING
# ============================================================

if __name__ == "__main__":

    print("=" * 60)

    print(
        "EVENTSPHERE AI RECOMMENDATION ENGINE"
    )

    print("=" * 60)


    interest = input(
        "\nEnter your interest: "
    )


    recommendations = recommend_events(
        interest=interest,
        top_n=3,
    )


    print(
        "\nRecommended Events"
    )

    print("-" * 60)


    if not recommendations:

        print(
            "No suitable events found."
        )

    else:

        for index, event in enumerate(
            recommendations,
            start=1,
        ):

            print(
                f"\n{index}. {event['title']}"
            )

            print(
                f"   Category: "
                f"{event['category']}"
            )

            print(
                f"   Match: "
                f"{event['match_score']}%"
            )

            print(
                f"   Reason: "
                f"{event['reason']}"
            )