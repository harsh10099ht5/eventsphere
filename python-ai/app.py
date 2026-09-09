from flask import Flask, request, jsonify
from flask_cors import CORS

from model import recommendation_engine


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# ROOT
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "service":
            "EventSphere AI Recommendation Service",

        "status":
            "active",

        "model":
            "TF-IDF + Cosine Similarity + Behavior Personalization",

        "version":
            "3.0.0",

    })


# ============================================================
# HEALTH
# ============================================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({

        "status":
            "healthy",

        "service":
            "EventSphere ML",

        "model":
            "Behavior-Aware Recommendation Engine",

    })


# ============================================================
# RECOMMENDATION API
# ============================================================

@app.route(
    "/recommend",
    methods=["POST"]
)
def recommend():

    try:

        data = (
            request.get_json(
                silent=True
            )
            or {}
        )


        # ----------------------------------------------------
        # INPUT
        # ----------------------------------------------------

        interest = (
            data.get(
                "interest",
                ""
            )
            .strip()
        )

        category = data.get(
            "category"
        )

        skills = data.get(
            "skills",
            []
        )

        events = data.get(
            "events",
            []
        )

        history = data.get(
            "history",
            []
        )

        top_n = data.get(
            "top_n",
            5
        )


        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        if not interest:

            return jsonify({

                "status":
                    "error",

                "message":
                    "Interest is required",

            }), 400


        if not isinstance(
            events,
            list
        ) or not events:

            return jsonify({

                "status":
                    "error",

                "message":
                    "No events available",

            }), 400


        if not isinstance(
            skills,
            list
        ):

            skills = []


        if not isinstance(
            history,
            list
        ):

            history = []


        # ----------------------------------------------------
        # TRAIN / UPDATE MODEL
        # ----------------------------------------------------

        recommendation_engine.train(
            events
        )


        # ----------------------------------------------------
        # GENERATE RECOMMENDATIONS
        # ----------------------------------------------------

        recommendations = (
            recommendation_engine.recommend(

                interest=
                    interest,

                category=
                    category,

                skills=
                    skills,

                history=
                    history,

                top_n=
                    top_n,

            )
        )


        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return jsonify({

            "status":
                "success",

            "interest":
                interest,

            "category":
                category,

            "skills":
                skills,

            "history_analyzed":
                len(history),

            "events_analyzed":
                len(events),

            "recommendations":
                recommendations,

            "model": {

                "algorithm":
                    "TF-IDF + Cosine Similarity",

                "personalization":
                    "Behavior-Aware",

                "weights": {

                    "content_similarity":
                        45,

                    "category_match":
                        15,

                    "keyword_match":
                        15,

                    "skill_match":
                        15,

                    "behavior_match":
                        10,

                },

            },

        })


    except Exception as error:

        print(
            "ML ERROR:",
            str(error)
        )

        return jsonify({

            "status":
                "error",

            "message":
                "Recommendation engine failed.",

            "error":
                str(error),

        }), 500


# ============================================================
# APPLICATION START
# ============================================================

if __name__ == "__main__":

    print("")
    print(
        "============================================================"
    )

    print(
        "          EVENTSPHERE AI RECOMMENDATION SERVICE"
    )

    print(
        "============================================================"
    )

    print(
        "Model : TF-IDF + Cosine Similarity"
    )

    print(
        "       + Category + Keywords + Skills"
    )

    print(
        "       + Behavior Personalization"
    )

    print(
        "Host  : 127.0.0.1"
    )

    print(
        "Port  : 5001"
    )

    print(
        "============================================================"
    )

    print("")


    app.run(

        host="127.0.0.1",

        port=5001,

        debug=True,

    )