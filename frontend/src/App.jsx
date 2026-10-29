<<<<<<< HEAD
import "./App.css";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [bookmarkedEvents, setBookmarkedEvents] = useState(() => new Set());
  const [interactionMessage, setInteractionMessage] = useState("");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // ============================================================
  // FETCH EVENTS
  // ============================================================

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      setEventError("");

      const response = await axios.get(
        "http://localhost:5000/api/events"
      );

      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Event API Error:", error);

      setEventError(
        "Unable to load events. Please make sure the backend is running."
      );
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const savedBookmarks = window.localStorage.getItem("eventsphere_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedEvents(new Set(JSON.parse(savedBookmarks)));
      } catch (error) {
        console.warn("Unable to restore bookmarks:", error);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "eventsphere_bookmarks",
      JSON.stringify([...bookmarkedEvents])
    );
  }, [bookmarkedEvents]);

  // ============================================================
  // USER INTERACTION TRACKING
  // ============================================================

  const trackInteraction = async (eventId, interactionType) => {
    if (!eventId) return;

    try {
      await axios.post("http://localhost:5000/api/interactions", {
        user_id: 1,
        event_id: eventId,
        interaction_type: interactionType,
      });

      if (interactionType === "bookmark") {
        setBookmarkedEvents((previous) => {
          const next = new Set(previous);
          next.add(Number(eventId));
          return next;
        });
        setInteractionMessage("Event bookmarked successfully.");
      }

      if (interactionType === "register") {
        setInteractionMessage("Registration activity recorded.");
      }

      if (interactionType === "view") {
        setInteractionMessage("Event view recorded for personalization.");
      }

      window.setTimeout(() => setInteractionMessage(""), 2500);
    } catch (error) {
      console.error("Interaction tracking error:", error);
    }
  };

  const toggleBookmark = async (event) => {
    const eventId = Number(event.id);
    if (!eventId) return;

    const alreadyBookmarked = bookmarkedEvents.has(eventId);

    if (alreadyBookmarked) {
      setBookmarkedEvents((previous) => {
        const next = new Set(previous);
        next.delete(eventId);
        return next;
      });
      setInteractionMessage("Bookmark removed.");
      window.setTimeout(() => setInteractionMessage(""), 2500);
      return;
    }

    await trackInteraction(eventId, "bookmark");
  };

  // ============================================================
  // AI RECOMMENDATION
  // ============================================================

  const getRecommendation = async () => {
    if (events.length === 0) {
      setRecommendation({
        type: "error",
        message: "No events are currently available."
      });
      return;
    }

    try {
      setRecommendationLoading(true);
      setRecommendation(null);

      const response = await axios.post(
        "http://localhost:5000/api/recommend",
        {
          interest: searchQuery || activeCategory || "college events",
          category:
            activeCategory !== "All Events"
              ? activeCategory
              : null,
          skills: [],
          user_id: 1,
          top_n: 5,
          events,
        }
      );

      if (
        response.data?.status === "success" &&
        response.data?.recommendations?.length > 0
      ) {
        setRecommendation({
          type: "success",
          event: response.data.recommendations[0]
        });
      } else {
        setRecommendation({
          type: "error",
          message: "No suitable event was found."
        });
      }
    } catch (error) {
      console.error("ML API Error:", error);

      setRecommendation({
        type: "error",
        message:
          "Unable to generate recommendations. Please check the backend and ML service."
      });
    } finally {
      setRecommendationLoading(false);
    }
  };

  // ============================================================
  // DATE & TIME FORMATTERS
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "Date TBA";

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime())) {
      return date;
    }

    return eventDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (time) => {
    if (!time) return "Time TBA";
    return time;
  };

  const getDay = (date) => {
    if (!date) return "--";

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime())) {
      return "--";
    }

    return eventDate
      .toLocaleDateString("en-IN", {
        day: "2-digit"
      })
      .replace(/^0/, "");
  };

  const getMonth = (date) => {
    if (!date) return "---";

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime())) {
      return "---";
    }

    return eventDate
      .toLocaleDateString("en-IN", {
        month: "short"
      })
      .toUpperCase();
  };

  // ============================================================
  // CATEGORY FILTERING + SEARCH
  // ============================================================

  const categories = [
    "All Events",
    "Technical",
    "Workshops",
    "Cultural",
    "Sports"
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const categoryMatch =
        activeCategory === "All Events" ||
        event.category?.toLowerCase() ===
          activeCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();

      const searchMatch =
        !query ||
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.category?.toLowerCase().includes(query) ||
        event.venue?.toLowerCase().includes(query);

      return categoryMatch && searchMatch && bookmarkMatch;
    });
  }, [events, activeCategory, searchQuery, showBookmarkedOnly, bookmarkedEvents]);

  // ============================================================
  // SCROLL FUNCTION
  // ============================================================

  const scrollToEvents = () => {
    document
      .getElementById("events")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="app">

      {/* ========================================================
          NAVBAR
      ======================================================== */}

      <nav className="navbar">

        <a href="#home" className="logo">
          Event<span>Sphere</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button className="login-btn">
            Login
          </button>

          <button className="signup-btn">
            Get Started
          </button>
        </div>

      </nav>

      {/* ========================================================
          HERO SECTION
      ======================================================== */}

      <section className="hero" id="home">

        <div className="hero-content">

          <div className="badge">
            COLLEGE EVENT MANAGEMENT PLATFORM
          </div>

          <h1>
            Discover.
            <br />
            <span>Connect. Participate.</span>
          </h1>

          <p className="hero-description">
            Discover upcoming college events, register instantly,
            connect with your campus community, and never miss
            an opportunity to participate.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={getRecommendation}
              disabled={recommendationLoading}
            >
              {recommendationLoading
                ? "Finding Events..."
                : "Get Personalized Recommendations"}
            </button>

            <button
              className="secondary-btn"
              onClick={scrollToEvents}
            >
              Explore Events →
            </button>

          </div>

          {/* HERO STATS */}

          <div className="hero-stats">

            <div className="stat">
              <strong>{events.length}+</strong>
              <span>Events</span>
            </div>

            <div className="stat">
              <strong>2K+</strong>
              <span>Students</span>
            </div>

            <div className="stat">
              <strong>25+</strong>
              <span>Organizers</span>
            </div>

          </div>

        </div>

        {/* HERO EVENT CARD */}

        <div className="hero-card">

          <div className="floating-label">
            FEATURED EVENT
          </div>

          {events.length > 0 ? (

            <div className="event-preview">

              <div className="preview-date">
                <span>
                  {getMonth(events[0].event_date)}
                </span>

                <strong>
                  {getDay(events[0].event_date)}
                </strong>
              </div>

              <div className="preview-content">

                <p className="small-text">
                  {events[0].category || "Campus Event"}
                </p>

                <h3>
                  {events[0].title}
                </h3>

                <p className="preview-meta">
                  {formatTime(events[0].event_time)}
                  <span>•</span>
                  {events[0].venue || "Venue TBA"}
                </p>

              </div>

            </div>

          ) : (

            <div className="empty-preview">
              <div className="empty-icon">◎</div>

              <h3>No upcoming events</h3>

              <p>
                New campus experiences will appear here.
              </p>
            </div>

          )}

          <button
            className="preview-btn"
            onClick={scrollToEvents}
          >
            View All Events
          </button>

        </div>

      </section>

      {/* ========================================================
          RECOMMENDATION RESULT
      ======================================================== */}

      {recommendation && (
        <section className="recommendation-section">

          <div className="recommendation-card">

            <div className="recommendation-icon">
              ✦
            </div>

            <div className="recommendation-content">

              <span className="recommendation-label">
                AI RECOMMENDATION
              </span>

              {recommendation.type === "success" ? (
                <>
                  <h3>
                    {recommendation.event.title}
                  </h3>

                  <p>
                    Based on your interests, this event appears
                    to be a strong match for you.
                  </p>

                  {recommendation.event.match_score !==
                    undefined && (
                    <span className="match-score">
                      {recommendation.event.match_score}%
                      Match
                    </span>
                  )}
                </>
              ) : (
                <p>{recommendation.message}</p>
              )}

            </div>

            {recommendation.type === "success" && (
              <button
                className="recommendation-btn"
                onClick={() => {
                  setSelectedEvent(recommendation.event);
                  trackInteraction(recommendation.event.id, "view");
                }}
              >
                View Event →
              </button>
            )}

          </div>

        </section>
      )}

      {interactionMessage && (
        <div className="interaction-toast" role="status">
          {interactionMessage}
        </div>
      )}

      {/* ========================================================
          EVENTS SECTION
      ======================================================== */}

      <section
        className="events-section"
        id="events"
      >

        <div className="section-heading">

          <div>
            <p className="section-label">
              EXPLORE
            </p>

            <h2>
              Upcoming Events
            </h2>

            <p className="section-subtitle">
              Find experiences that match your interests
              and make the most of your campus life.
            </p>
          </div>

          <button
            className="view-all"
            onClick={fetchEvents}
          >
            Refresh Listings ↻
          </button>

        </div>

        {/* SEARCH */}

        <div className="event-toolbar">

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search events, categories or venues..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />

          </div>

          <button
            className={showBookmarkedOnly ? "active-category" : "view-all"}
            onClick={() => setShowBookmarkedOnly((previous) => !previous)}
          >
            {showBookmarkedOnly ? "Showing Bookmarks" : "My Bookmarks"}
          </button>

        </div>

        {/* CATEGORY BAR */}

        <div className="category-bar">

          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category
                  ? "active-category"
                  : ""
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>
          ))}

        </div>

        {/* LOADING */}

        {loadingEvents && (
          <div className="events-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading upcoming events...
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loadingEvents && eventError && (
          <div className="events-error">

            <div className="error-icon">
              !
            </div>

            <h3>
              Unable to load events
            </h3>

            <p>
              {eventError}
            </p>

            <button
              onClick={fetchEvents}
              className="primary-btn"
            >
              Try Again
            </button>

          </div>
        )}

        {/* EVENTS GRID */}

        {!loadingEvents &&
          !eventError &&
          filteredEvents.length > 0 && (

            <div className="events-grid">

              {filteredEvents.map((event) => (

                <article
                  className="event-card"
                  key={event.id}
                >

                  <div className="card-top">

                    <span className="category">
                      {event.category || "General"}
                    </span>

                    <span className="calendar">
                      ◷
                    </span>

                  </div>

                  <div className="date-box">

                    <span>
                      {getMonth(event.event_date)}
                    </span>

                    <strong>
                      {getDay(event.event_date)}
                    </strong>

                  </div>

                  <h3>
                    {event.title}
                  </h3>

                  <p className="event-description">
                    {event.description ||
                      "Event information will be available soon."}
                  </p>

                  <div className="event-info">

                    <span>
                      ◷ {formatTime(event.event_time)}
                    </span>

                    <span>
                      ⌖ {event.venue || "Venue TBA"}
                    </span>

                  </div>

                  <div className="event-card-actions">
                    <button
                      className="bookmark-btn"
                      onClick={() => toggleBookmark(event)}
                    >
                      {bookmarkedEvents.has(Number(event.id))
                        ? "♥ Bookmarked"
                        : "♡ Bookmark Event"}
                    </button>

                    <button
                      className="register-btn"
                      onClick={() => {
                        setSelectedEvent(event);
                        trackInteraction(event.id, "view");
                      }}
                    >
                      View Event Details →
                    </button>
                  </div>

                </article>

              ))}

            </div>
          )}

        {/* NO SEARCH RESULTS */}

        {!loadingEvents &&
          !eventError &&
          events.length > 0 &&
          filteredEvents.length === 0 && (

            <div className="events-error">

              <div className="error-icon">
                ⌕
              </div>

              <h3>
                No matching events
              </h3>

              <p>
                Try another search term or category.
              </p>

              <button
                className="secondary-btn"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All Events");
                }}
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* NO EVENTS */}

        {!loadingEvents &&
          !eventError &&
          events.length === 0 && (

            <div className="events-error">

              <div className="error-icon">
                ◎
              </div>

              <h3>
                No events available
              </h3>

              <p>
                Organizers can publish upcoming events
                from the organizer dashboard.
              </p>

            </div>
          )}

      </section>

      {/* ========================================================
          HOW IT WORKS
      ======================================================== */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="center-heading">

          <p className="section-label">
            HOW IT WORKS
          </p>

          <h2>
            Everything you need, in one place.
          </h2>

          <p>
            EventSphere simplifies the entire journey
            from discovering an event to participating in it.
          </p>

        </div>

        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>
              Discover
            </h3>

            <p>
              Browse upcoming college events based
              on your interests and preferred categories.
            </p>

          </div>

          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>
              Register
            </h3>

            <p>
              Register for events quickly and keep
              your participation organized.
            </p>

          </div>

          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>
              Participate
            </h3>

            <p>
              Attend events, compete, learn and
              engage with your campus community.
            </p>

          </div>

          <div className="step">

            <div className="step-number">
              04
            </div>

            <h3>
              Track
            </h3>

            <p>
              Manage registrations and discover
              new opportunities through your dashboard.
            </p>

          </div>

        </div>

      </section>

      {/* ========================================================
          ABOUT
      ======================================================== */}

      <section
        className="about-section"
        id="about"
      >

        <div className="about-heading">

          <p className="section-label">
            WHY EVENTSPHERE
          </p>

          <h2>
            A smarter way to connect your campus.
          </h2>

        </div>

        <div className="about-text">

          <p>
            EventSphere brings students, organizers and
            college events together through one centralized
            digital platform.
          </p>

          <p>
            Instead of relying on scattered messages,
            posters and multiple communication channels,
            students can discover events, explore details
            and manage their participation from one place.
          </p>

        </div>

      </section>

      {/* ========================================================
          CTA
      ======================================================== */}

      <section className="cta">

        <p className="section-label">
          READY TO GET INVOLVED?
        </p>

        <h2>
          Your next campus experience starts here.
        </h2>

        <p>
          Explore what's happening on your campus
          and find your next opportunity.
        </p>

        <button
          className="primary-btn"
          onClick={scrollToEvents}
        >
          Explore Upcoming Events →
        </button>

      </section>

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <footer>

        <div className="footer-main">

          <div>
            <div className="footer-logo">
              Event<span>Sphere</span>
            </div>

            <p>
              One platform. Every campus experience.
            </p>
          </div>

          <div className="footer-links">

            <a href="#home">
              Home
            </a>

            <a href="#events">
              Events
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

            <a href="#about">
              About
            </a>

          </div>

        </div>

        <div className="footer-bottom">
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Event<span className="text-blue-500">Sphere</span>
            </h1>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm text-white transition hover:text-blue-400"
            >
              Home
            </a>

            <a
              href="#events"
              className="text-sm text-slate-300 transition hover:text-blue-400"
            >
              Events
            </a>

            <a
              href="#about"
              className="text-sm text-slate-300 transition hover:text-blue-400"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-sm text-slate-300 transition hover:text-blue-400"
            >
              Contact
            </a>
          </div>

          {/* Login */}
          <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-700">
            Login
          </button>

        </div>
      </nav>

      {/* Hero Section */}
      <main id="home">

        <section className="relative overflow-hidden">

          {/* Background Glow */}
          <div className="absolute left-1/2 top-0 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">

            <div className="max-w-4xl">

              {/* Label */}
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                AI-Powered College Event Platform
              </p>

              {/* Heading */}
              <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                Discover Events.
                <br />
                <span className="text-blue-500">
                  Build Your Future.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                Discover college events, workshops, hackathons and
                competitions. Register instantly, track your participation,
                earn certificates and receive personalized recommendations
                powered by Artificial Intelligence.
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-wrap gap-4">

                <button className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-700">
                  Explore Events
                </button>

                <button className="rounded-lg border border-white/15 bg-white/5 px-7 py-3.5 font-semibold transition hover:bg-white/10">
                  Host an Event
                </button>

              </div>

            </div>

          </div>
        </section>

        {/* Features */}
        <section
          id="events"
          className="border-t border-white/10 bg-slate-900/50"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Platform Features
              </p>

              <h3 className="mt-3 text-3xl font-bold md:text-4xl">
                Everything for your campus events
              </h3>

              <p className="mt-4 max-w-2xl text-slate-400">
                EventSphere brings students, organizers and colleges together
                on one centralized platform.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {/* Feature 1 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  📅
                </div>

                <h4 className="text-xl font-semibold">
                  Discover Events
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Find hackathons, workshops, seminars, competitions and
                  cultural events from one platform.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  🤖
                </div>

                <h4 className="text-xl font-semibold">
                  AI Recommendations
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Receive personalized event recommendations based on your
                  interests, skills and participation history.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  🎓
                </div>

                <h4 className="text-xl font-semibold">
                  Digital Certificates
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Automatically receive and manage verified digital
                  certificates after participating in events.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  QR
                </div>

                <h4 className="text-xl font-semibold">
                  QR Attendance
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Simplify event attendance using secure QR-based
                  verification.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  📊
                </div>

                <h4 className="text-xl font-semibold">
                  Event Analytics
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Organizers can monitor registrations, attendance and
                  participant feedback.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  👥
                </div>

                <h4 className="text-xl font-semibold">
                  Student Engagement
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Build a participation history and discover opportunities
                  that match your academic and career interests.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="max-w-3xl">

              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                About EventSphere
              </p>

              <h3 className="mt-3 text-3xl font-bold md:text-4xl">
                One platform for the complete event experience.
              </h3>

              <p className="mt-5 leading-8 text-slate-400">
                EventSphere is designed to centralize college events and
                student participation. The platform connects students,
                organizers and administrators while using AI to improve event
                discovery and engagement.
              </p>

            </div>

          </div>
        </section>

        {/* CTA */}
        <section
          id="contact"
          className="border-t border-white/10 bg-blue-600"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

              <div>
                <h3 className="text-3xl font-bold">
                  Ready to explore your next opportunity?
                </h3>

                <p className="mt-3 text-blue-100">
                  Discover events and start building your experience.
                </p>
              </div>

              <button className="rounded-lg bg-white px-7 py-3.5 font-semibold text-blue-700 transition hover:bg-slate-100">
                Explore Events
              </button>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
>>>>>>> origin/feature/frontend

          <p>
            © 2026 EventSphere. All rights reserved.
          </p>

          <p>
<<<<<<< HEAD
            College Event Management Platform
          </p>

        </div>

      </footer>

      {/* ========================================================
          EVENT DETAILS MODAL
      ======================================================== */}

      {selectedEvent && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedEvent(null)}
        >

          <div
            className="event-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </button>

            <span className="category">
              {selectedEvent.category || "General"}
            </span>

            <h2>
              {selectedEvent.title}
            </h2>

            <p className="modal-description">
              {selectedEvent.description ||
                "No description available."}
            </p>

            {selectedEvent.skills && (
              <div className="modal-skills">
                <span>Skills & Topics</span>
                <p>{selectedEvent.skills}</p>
              </div>
            )}

            <div className="modal-details">

              <div>
                <span>Date</span>
                <strong>
                  {formatDate(
                    selectedEvent.event_date
                  )}
                </strong>
              </div>

              <div>
                <span>Time</span>
                <strong>
                  {formatTime(
                    selectedEvent.event_time
                  )}
                </strong>
              </div>

              <div>
                <span>Venue</span>
                <strong>
                  {selectedEvent.venue ||
                    "Venue TBA"}
                </strong>
              </div>

            </div>

            <button
              className="primary-btn modal-register"
              onClick={() => {
                trackInteraction(selectedEvent.id, "register");
                alert(
                  `Registration selected for: ${selectedEvent.title}`
                );
              }}
            >
              Register for Event →
            </button>

          </div>

        </div>
      )}

=======
            AI-Powered College Event Platform
          </p>

        </div>
      </footer>

>>>>>>> origin/feature/frontend
    </div>
  );
}

<<<<<<< HEAD
=======
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}

>>>>>>> origin/feature/frontend
export default App;