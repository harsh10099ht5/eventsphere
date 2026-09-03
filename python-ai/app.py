from flask import Flask, request, jsonify
from model import recommendation_engine

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({
        "message": "EventSphere Professional ML API is running",
        "status": "active",
        "model": "TF-IDF + Cosine Similarity"
    })


@app.route("/recommend", methods=["POST"])
def recommend():

    try:

        data = request.get_json()

        interest = data.get("interest")
        events = data.get("events", [])

        if not interest:
            return jsonify({
                "error": "Interest is required"
            }), 400

        if not events:
            return jsonify({
                "error": "No events available"
            }), 400

        # Train/update recommendation engine
        recommendation_engine.train(events)

        recommendations = recommendation_engine.recommend(
            interest,
            top_n=3
        )

        return jsonify({
            "interest": interest,
            "recommendations": recommendations
        })

    except Exception as e:

        print("ML Error:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5001,
        debug=True
    )