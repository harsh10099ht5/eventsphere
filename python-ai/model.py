"""
EventSphere
Behavior-Aware AI Recommendation Engine

Algorithm:
    TF-IDF + Cosine Similarity
    + Category Matching
    + Keyword Matching
    + Skill Matching
    + User Behavior Personalization
"""

import re
from typing import Any, Dict, List

import numpy as np
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ============================================================
# CONFIGURATION
# ============================================================

INTERACTION_WEIGHTS = {
    "view": 0.20,
    "bookmark": 0.50,
    "register": 1.00,
}

CONTENT_WEIGHT = 0.45
CATEGORY_WEIGHT = 0.15
KEYWORD_WEIGHT = 0.15
SKILL_WEIGHT = 0.15
BEHAVIOR_WEIGHT = 0.10


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def normalize_text(value: Any) -> str:
    """
    Convert any value into clean lowercase text.
    """

    if value is None:
        return ""

    text = str(value).lower()

    text = re.sub(
        r"[^a-z0-9\s+#.-]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    return text


def tokenize(value: Any) -> List[str]:
    """
    Convert text into normalized tokens.
    """

    text = normalize_text(value)

    if not text:
        return []

    return text.split()


def parse_skills(value: Any) -> List[str]:
    """
    Convert skills from:
        'Python, AI, Robotics'

    into:
        ['python', 'ai', 'robotics']
    """

    if value is None:
        return []

    if isinstance(value, list):
        raw_skills = value

    else:
        raw_skills = str(value).split(",")

    return [
        normalize_text(skill)
        for skill in raw_skills
        if normalize_text(skill)
    ]


def clamp_score(value: float) -> float:
    """
    Keep score between 0 and 1.
    """

    return max(
        0.0,
        min(1.0, float(value))
    )


def percentage(value: float) -> float:
    """
    Convert 0-1 score to percentage.
    """

    return round(
        clamp_score(value) * 100,
        2
    )


# ============================================================
# RECOMMENDATION ENGINE
# ============================================================

class RecommendationEngine:

    def __init__(self):

        self.events = pd.DataFrame()

        self.vectorizer = None

        self.event_matrix = None

        self.trained = False


    # ========================================================
    # PREPARE EVENT TEXT
    # ========================================================

    def build_event_text(self, event: Dict[str, Any]) -> str:

        title = normalize_text(
            event.get("title", "")
        )

        description = normalize_text(
            event.get("description", "")
        )

        category = normalize_text(
            event.get("category", "")
        )

        skills = normalize_text(
            event.get("skills", "")
        )

        return " ".join(
            [
                title,
                title,
                description,
                category,
                skills,
            ]
        )


    # ========================================================
    # TRAIN MODEL
    # ========================================================

    def train(
        self,
        events: List[Dict[str, Any]]
    ) -> None:

        if not events:
            raise ValueError(
                "No events available for training."
            )

        clean_events = []

        for event in events:

            if not isinstance(
                event,
                dict
            ):
                continue

            clean_events.append({

                "id":
                    event.get("id"),

                "title":
                    event.get(
                        "title",
                        ""
                    ),

                "description":
                    event.get(
                        "description",
                        ""
                    ),

                "category":
                    event.get(
                        "category",
                        "General"
                    ),

                "skills":
                    event.get(
                        "skills",
                        ""
                    ),

                "event_date":
                    event.get(
                        "event_date"
                    ),

                "event_time":
                    event.get(
                        "event_time"
                    ),

                "venue":
                    event.get(
                        "venue",
                        ""
                    ),

            })

        if not clean_events:
            raise ValueError(
                "No valid events available."
            )

        self.events = pd.DataFrame(
            clean_events
        )

        self.events[
            "search_text"
        ] = self.events.apply(
            self.build_event_text,
            axis=1
        )

        documents = (
            self.events[
                "search_text"
            ]
            .fillna("")
            .tolist()
        )

        # ----------------------------------------------------
        # TF-IDF
        # ----------------------------------------------------

        self.vectorizer = TfidfVectorizer(

            lowercase=True,

            stop_words="english",

            ngram_range=(1, 2),

            max_df=1.0,

            min_df=1,

            sublinear_tf=True,

        )

        self.event_matrix = (
            self.vectorizer.fit_transform(
                documents
            )
        )

        self.trained = True


    # ========================================================
    # CATEGORY MATCH
    # ========================================================

    def calculate_category_match(
        self,
        user_category: str,
        event_category: str
    ) -> float:

        if not user_category:
            return 0.0

        user_category = normalize_text(
            user_category
        )

        event_category = normalize_text(
            event_category
        )

        if not user_category:
            return 0.0

        if user_category == event_category:
            return 1.0

        return 0.0


    # ========================================================
    # KEYWORD MATCH
    # ========================================================

    def calculate_keyword_match(
        self,
        interest: str,
        event: Dict[str, Any]
    ) -> float:

        interest_tokens = set(
            tokenize(interest)
        )

        if not interest_tokens:
            return 0.0

        event_text = " ".join(
            [
                normalize_text(
                    event.get(
                        "title",
                        ""
                    )
                ),

                normalize_text(
                    event.get(
                        "description",
                        ""
                    )
                ),

                normalize_text(
                    event.get(
                        "category",
                        ""
                    )
                ),

                normalize_text(
                    event.get(
                        "skills",
                        ""
                    )
                ),
            ]
        )

        event_tokens = set(
            tokenize(event_text)
        )

        if not event_tokens:
            return 0.0

        matched = (
            interest_tokens
            .intersection(
                event_tokens
            )
        )

        return clamp_score(
            len(matched)
            /
            max(
                1,
                len(interest_tokens)
            )
        )


    # ========================================================
    # SKILL MATCH
    # ========================================================

    def calculate_skill_match(
        self,
        user_skills: List[str],
        event: Dict[str, Any]
    ) -> float:

        if not user_skills:
            return 0.0

        user_skill_set = set(
            normalize_text(skill)
            for skill in user_skills
            if normalize_text(skill)
        )

        event_skill_set = set(
            parse_skills(
                event.get(
                    "skills",
                    ""
                )
            )
        )

        if not user_skill_set:
            return 0.0

        if not event_skill_set:
            return 0.0

        matched = (
            user_skill_set
            .intersection(
                event_skill_set
            )
        )

        return clamp_score(
            len(matched)
            /
            max(
                1,
                len(user_skill_set)
            )
        )


    # ========================================================
    # BEHAVIOR PROFILE
    # ========================================================

    def build_behavior_profile(
        self,
        history: List[Dict[str, Any]]
    ) -> Dict[str, float]:

        profile = {}

        if not history:
            return profile

        for interaction in history:

            try:

                event_id = str(
                    interaction.get(
                        "event_id"
                    )
                )

                interaction_type = (
                    interaction.get(
                        "interaction_type",
                        "view"
                    )
                    .lower()
                )

                stored_score = float(
                    interaction.get(
                        "interaction_score",
                        INTERACTION_WEIGHTS.get(
                            interaction_type,
                            0.0
                        )
                    )
                )

                weight = INTERACTION_WEIGHTS.get(
                    interaction_type,
                    stored_score
                )

                # Stronger interaction should
                # dominate weaker interactions.
                score = max(
                    weight,
                    stored_score
                )

                profile[event_id] = (
                    profile.get(
                        event_id,
                        0.0
                    )
                    + score
                )

            except (
                ValueError,
                TypeError
            ):
                continue

        return profile


    # ========================================================
    # BEHAVIOR SIMILARITY
    # ========================================================

    def calculate_behavior_score(
        self,
        candidate_event: Dict[str, Any],
        history: List[Dict[str, Any]]
    ) -> float:

        if not history:
            return 0.0

        behavior_profile = (
            self.build_behavior_profile(
                history
            )
        )

        if not behavior_profile:
            return 0.0

        candidate_text = (
            self.build_event_text(
                candidate_event
            )
        )

        candidate_tokens = set(
            tokenize(candidate_text)
        )

        if not candidate_tokens:
            return 0.0

        weighted_similarity = 0.0

        total_weight = 0.0

        for event_id, weight in (
            behavior_profile.items()
        ):

            matching_rows = self.events[
                self.events["id"].astype(str)
                == str(event_id)
            ]

            if matching_rows.empty:
                continue

            previous_event = (
                matching_rows.iloc[0]
                .to_dict()
            )

            previous_text = (
                self.build_event_text(
                    previous_event
                )
            )

            previous_tokens = set(
                tokenize(previous_text)
            )

            if not previous_tokens:
                continue

            intersection = (
                candidate_tokens
                .intersection(
                    previous_tokens
                )
            )

            union = (
                candidate_tokens
                .union(
                    previous_tokens
                )
            )

            if not union:
                similarity = 0.0

            else:
                similarity = (
                    len(intersection)
                    /
                    len(union)
                )

            weighted_similarity += (
                similarity
                * weight
            )

            total_weight += weight

        if total_weight == 0:
            return 0.0

        return clamp_score(
            weighted_similarity
            /
            total_weight
        )


    # ========================================================
    # GENERATE REASON
    # ========================================================

    def generate_reason(
        self,
        content_score: float,
        category_score: float,
        keyword_score: float,
        skill_score: float,
        behavior_score: float,
        event: Dict[str, Any]
    ) -> str:

        reasons = []

        if content_score >= 0.55:
            reasons.append(
                "strong content similarity"
            )

        if category_score >= 1.0:
            reasons.append(
                "matches your preferred category"
            )

        if keyword_score >= 0.50:
            reasons.append(
                "matches your interests"
            )

        if skill_score >= 0.50:
            reasons.append(
                "matches your skills"
            )

        if behavior_score >= 0.35:
            reasons.append(
                "is similar to events you previously interacted with"
            )

        if not reasons:
            reasons.append(
                "has relevant content based on your profile"
            )

        return (
            "Recommended because it "
            + ", ".join(reasons)
            + "."
        )


    # ========================================================
    # RECOMMEND
    # ========================================================

    def recommend(
        self,
        interest: str,
        category: str = None,
        skills: List[str] = None,
        history: List[Dict[str, Any]] = None,
        top_n: int = 5
    ) -> List[Dict[str, Any]]:

        if not self.trained:

            raise RuntimeError(
                "Recommendation engine is not trained."
            )

        if not interest:

            raise ValueError(
                "Interest is required."
            )

        skills = skills or []

        history = history or []

        try:
            top_n = int(top_n)
        except (
            ValueError,
            TypeError
        ):
            top_n = 5

        top_n = max(
            1,
            min(
                top_n,
                len(self.events)
            )
        )


        # ----------------------------------------------------
        # USER QUERY
        # ----------------------------------------------------

        query_parts = [

            interest,

            category or "",

            " ".join(skills),

        ]

        query_text = " ".join(
            query_parts
        )


        # ----------------------------------------------------
        # QUERY VECTOR
        # ----------------------------------------------------

        query_vector = (
            self.vectorizer.transform(
                [query_text]
            )
        )


        # ----------------------------------------------------
        # COSINE SIMILARITY
        # ----------------------------------------------------

        content_scores = (
            cosine_similarity(
                query_vector,
                self.event_matrix
            )[0]
        )


        results = []


        # ----------------------------------------------------
        # SCORE EACH EVENT
        # ----------------------------------------------------

        for index, event in (
            self.events.iterrows()
        ):

            event_dict = (
                event.to_dict()
            )


            # Content
            content_score = clamp_score(
                float(
                    content_scores[index]
                )
            )


            # Category
            category_score = (
                self.calculate_category_match(
                    category,
                    event_dict.get(
                        "category",
                        ""
                    )
                )
            )


            # Keywords
            keyword_score = (
                self.calculate_keyword_match(
                    interest,
                    event_dict
                )
            )


            # Skills
            skill_score = (
                self.calculate_skill_match(
                    skills,
                    event_dict
                )
            )


            # Behavior
            behavior_score = (
                self.calculate_behavior_score(
                    event_dict,
                    history
                )
            )


            # ------------------------------------------------
            # FINAL WEIGHTED SCORE
            # ------------------------------------------------

            final_score = (

                content_score
                * CONTENT_WEIGHT

                +

                category_score
                * CATEGORY_WEIGHT

                +

                keyword_score
                * KEYWORD_WEIGHT

                +

                skill_score
                * SKILL_WEIGHT

                +

                behavior_score
                * BEHAVIOR_WEIGHT

            )


            final_score = clamp_score(
                final_score
            )


            # ------------------------------------------------
            # SCORE BREAKDOWN
            # ------------------------------------------------

            score_breakdown = {

                "content_similarity":
                    percentage(
                        content_score
                    ),

                "category_match":
                    percentage(
                        category_score
                    ),

                "keyword_match":
                    percentage(
                        keyword_score
                    ),

                "skill_match":
                    percentage(
                        skill_score
                    ),

                "behavior_match":
                    percentage(
                        behavior_score
                    ),

            }


            # ------------------------------------------------
            # REASON
            # ------------------------------------------------

            reason = (
                self.generate_reason(
                    content_score,
                    category_score,
                    keyword_score,
                    skill_score,
                    behavior_score,
                    event_dict
                )
            )


            # ------------------------------------------------
            # RESULT
            # ------------------------------------------------

            results.append({

                "id":
                    event_dict.get(
                        "id"
                    ),

                "title":
                    event_dict.get(
                        "title",
                        ""
                    ),

                "category":
                    event_dict.get(
                        "category",
                        "General"
                    ),

                "description":
                    event_dict.get(
                        "description",
                        ""
                    ),

                "event_date":
                    event_dict.get(
                        "event_date"
                    ),

                "event_time":
                    event_dict.get(
                        "event_time"
                    ),

                "venue":
                    event_dict.get(
                        "venue",
                        ""
                    ),

                "match_score":
                    percentage(
                        final_score
                    ),

                "reason":
                    reason,

                "score_breakdown":
                    score_breakdown,

            })


        # ----------------------------------------------------
        # SORT
        # ----------------------------------------------------

        results.sort(
            key=lambda item:
                item["match_score"],
            reverse=True
        )


        return results[:top_n]


# ============================================================
# GLOBAL ENGINE
# ============================================================

recommendation_engine = (
    RecommendationEngine()
)