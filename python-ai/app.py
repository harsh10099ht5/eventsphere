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

        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400

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

        # Generate recommendations
        recommendations = recommendation_engine.recommend(
            interest,
            top_n=3
        )

        return jsonify({
            "status": "success",
            "interest": interest,
            "recommendations": recommendations
        })

    except Exception as e:
        print("ML Error:", str(e))

        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "EventSphere ML API"
    })


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=True
    )