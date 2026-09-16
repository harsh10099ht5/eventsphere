import "./Recommendations.css";
import axios from "axios";
import { useState } from "react";

function Recommendations() {
  const [interest, setInterest] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");

  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // ==========================================================
  // GENERATE AI RECOMMENDATIONS
  // ==========================================================

  const getRecommendations = async () => {
    if (!interest.trim()) {
      setError("Please enter at least one interest.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);
      setRecommendations([]);

      // Convert comma-separated skills into array
      const skillList = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await axios.post(
        "http://localhost:5000/api/recommend",
        {
          interest: interest.trim(),

          category: category || null,

          skills: skillList,

          top_n: 5,
        },
        {
          timeout: 15000,
        }
      );

      if (response.data.status === "success") {
        setRecommendations(
          response.data.recommendations || []
        );
      } else {
        setError(
          response.data.message ||
            "Unable to generate recommendations."
        );
      }
    } catch (err) {
      console.error(
        "Recommendation Error:",
        err
      );

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Recommendation service returned an error."
        );
      } else if (err.code === "ECONNABORTED") {
        setError(
          "AI service is taking too long. Please try again."
        );
      } else {
        setError(
          "Unable to connect to EventSphere AI service. Make sure Node and Python servers are running."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // RESET
  // ==========================================================

  const resetSearch = () => {
    setInterest("");
    setCategory("");
    setSkills("");
    setRecommendations([]);
    setError("");
    setSearched(false);
  };


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date TBA";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================================
  // FORMAT SCORE
  // ==========================================================

  const getScoreLabel = (score) => {
    if (score >= 80) {
      return "Excellent Match";
    }

    if (score >= 60) {
      return "Strong Match";
    }

    if (score >= 40) {
      return "Good Match";
    }

    return "Related Event";
  };


  return (
    <div className="recommendations-page">

      {/* ====================================================
          NAVIGATION
      ==================================================== */}

      <nav className="recommendation-navbar">

        <a
          href="/"
          className="recommendation-logo"
        >
          Event<span>Sphere</span>
        </a>

        <a
          href="/"
          className="back-home"
        >
          ← Back to Home
        </a>

      </nav>


      {/* ====================================================
          HERO
      ==================================================== */}

      <section className="recommendation-hero">

        <div className="recommendation-hero-content">

          <span className="recommendation-label">
            AI POWERED DISCOVERY
          </span>

          <h1>
            Find events
            <br />
            <span>made for you.</span>
          </h1>

          <p>
            Tell EventSphere what you are interested
            in. Our recommendation engine analyzes
            event content, categories, keywords and
            skills to find the most relevant events.
          </p>

        </div>

      </section>


      {/* ====================================================
          INPUT SECTION
      ==================================================== */}

      <section className="recommendation-form-section">

        <div className="recommendation-container">

          <div className="recommendation-form-card">

            <div className="form-header">

              <span className="form-number">
                01
              </span>

              <div>

                <h2>
                  Build your preference profile
                </h2>

                <p>
                  Provide your interests and skills
                  for more relevant recommendations.
                </p>

              </div>

            </div>


            {/* INTEREST */}

            <div className="recommendation-input-group">

              <label htmlFor="interest">
                Your interests
              </label>

              <input
                id="interest"
                type="text"
                value={interest}
                onChange={(e) =>
                  setInterest(e.target.value)
                }
                placeholder="e.g. artificial intelligence, Python, robotics"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    getRecommendations();
                  }
                }}
              />

              <small>
                Enter technologies, subjects or
                activities you are interested in.
              </small>

            </div>


            {/* CATEGORY */}

            <div className="recommendation-input-group">

              <label htmlFor="category">
                Preferred category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                <option value="">
                  All Categories
                </option>

                <option value="Technical">
                  Technical
                </option>

                <option value="Workshop">
                  Workshop
                </option>

                <option value="Hackathon">
                  Hackathon
                </option>

                <option value="Cultural">
                  Cultural
                </option>

                <option value="Sports">
                  Sports
                </option>

              </select>

            </div>


            {/* SKILLS */}

            <div className="recommendation-input-group">

              <label htmlFor="skills">
                Your skills
              </label>

              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(e) =>
                  setSkills(e.target.value)
                }
                placeholder="e.g. Python, React, Machine Learning"
              />

              <small>
                Separate multiple skills with commas.
              </small>

            </div>


            {/* ACTIONS */}

            <div className="recommendation-actions">

              <button
                className="recommendation-submit"
                onClick={getRecommendations}
                disabled={loading}
              >
                {loading
                  ? "Analyzing your profile..."
                  : "Generate AI Recommendations →"}
              </button>

              {(interest ||
                category ||
                skills) && (

                <button
                  className="recommendation-reset"
                  onClick={resetSearch}
                  disabled={loading}
                >
                  Reset
                </button>

              )}

            </div>


            {/* ERROR */}

            {error && (

              <div className="recommendation-error">

                <strong>
                  Recommendation Error
                </strong>

                <p>
                  {error}
                </p>

              </div>

            )}

          </div>


          {/* =================================================
              RESULTS
          ================================================= */}

          {searched &&
            !loading &&
            !error &&
            recommendations.length === 0 && (

              <div className="no-recommendations">

                <span className="no-results-icon">
                  —
                </span>

                <h3>
                  No matching events found
                </h3>

                <p>
                  Try broader interests or remove
                  the category filter.
                </p>

              </div>

            )}


          {recommendations.length > 0 && (

            <div className="recommendation-results-section">

              {/* RESULTS HEADER */}

              <div className="results-header">

                <div>

                  <span className="recommendation-label">
                    AI RESULTS
                  </span>

                  <h2>
                    Recommended for you
                  </h2>

                  <p>
                    Based on your interests,
                    skills and category preference.
                  </p>

                </div>

                <div className="results-count">

                  <strong>
                    {recommendations.length}
                  </strong>

                  <span>
                    Matches
                  </span>

                </div>

              </div>


              {/* RESULTS GRID */}

              <div className="recommendation-grid">

                {recommendations.map(
                  (event, index) => (

                    <article
                      className="recommendation-card"
                      key={event.id || index}
                    >

                      {/* TOP */}

                      <div className="recommendation-card-top">

                        <span className="recommendation-rank">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <div className="match-score">

                          <strong>
                            {event.match_score}%
                          </strong>

                          <span>
                            {getScoreLabel(
                              event.match_score
                            )}
                          </span>

                        </div>

                      </div>


                      {/* CATEGORY */}

                      <span className="recommendation-category">
                        {event.category ||
                          "General"}
                      </span>


                      {/* TITLE */}

                      <h3>
                        {event.title}
                      </h3>


                      {/* DESCRIPTION */}

                      <p className="recommendation-description">
                        {event.description ||
                          "No description available."}
                      </p>


                      {/* SCORE BAR */}

                      <div className="match-section">

                        <div className="match-section-header">

                          <span>
                            AI Match Score
                          </span>

                          <strong>
                            {event.match_score}%
                          </strong>

                        </div>

                        <div className="match-bar">

                          <div
                            className="match-progress"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  event.match_score
                                )
                              )}%`,
                            }}
                          />

                        </div>

                      </div>


                      {/* SCORE BREAKDOWN */}

                      {event.score_breakdown && (

                        <div className="score-breakdown">

                          <div>
                            <span>
                              Content
                            </span>

                            <strong>
                              {
                                event
                                  .score_breakdown
                                  .content_similarity
                              }%
                            </strong>
                          </div>

                          <div>
                            <span>
                              Category
                            </span>

                            <strong>
                              {
                                event
                                  .score_breakdown
                                  .category_match
                              }%
                            </strong>
                          </div>

                          <div>
                            <span>
                              Keywords
                            </span>

                            <strong>
                              {
                                event
                                  .score_breakdown
                                  .keyword_match
                              }%
                            </strong>
                          </div>

                          <div>
                            <span>
                              Skills
                            </span>

                            <strong>
                              {
                                event
                                  .score_breakdown
                                  .skill_match
                              }%
                            </strong>
                          </div>

                        </div>

                      )}


                      {/* WHY */}

                      <div className="recommendation-reason">

                        <span>
                          WHY THIS EVENT?
                        </span>

                        <p>
                          {event.reason ||
                            "This event matches your selected interests."}
                        </p>

                      </div>


                      {/* EVENT INFO */}

                      <div className="recommendation-event-info">

                        <div>
                          <span>
                            DATE
                          </span>

                          <strong>
                            {formatDate(
                              event.event_date
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            TIME
                          </span>

                          <strong>
                            {event.event_time ||
                              "TBA"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            VENUE
                          </span>

                          <strong>
                            {event.venue ||
                              "TBA"}
                          </strong>
                        </div>

                      </div>


                      {/* ACTION */}

                      <button
                        className="recommendation-view-btn"
                        onClick={() =>
                          console.log(
                            "Selected event:",
                            event
                          )
                        }
                      >
                        View Event Details →
                      </button>

                    </article>

                  )
                )}

              </div>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Recommendations;