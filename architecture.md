# EventSphere --- Architecture

**Status:** Proposed architecture; verify against current source code.

## 1. Overview

EventSphere is intended to provide campus event discovery and
AI-assisted event recommendations. The planned architecture separates
the web UI, API, relational database, and recommendation service.

``` text
Browser
  |
  v
React + Vite frontend
  |
  v
Node.js + Express API (planned port: 5000)
  |                       \
  v                        v
MySQL database       Python + Flask ML service
                       (planned port: 5001)
```

## 2. Components

### Frontend

-   React with Vite.
-   Known files from the local audit: `frontend/src/App.jsx`,
    `frontend/src/app.css`, `frontend/src/main.jsx`.
-   Responsibilities: navigation, event discovery, login/signup UI, and
    recommendation results.

### Backend API

-   Intended stack: Node.js and Express.
-   Responsibilities: validate requests, access MySQL, expose
    event/interaction endpoints, and call the Python recommendation
    service.
-   The last folder audit did not show `backend/server.js` or
    `backend/db.js` in the expected folder. Locate or restore them
    before assuming the API is runnable.

### Database

-   Intended engine: MySQL, locally managed through XAMPP in prior
    development.
-   Previously documented database name: `eventsphere`.
-   Previously documented tables: `events`, `user_event_interactions`. A
    users table is required for real authentication but is not confirmed
    to exist.

### Recommendation service

-   Intended stack: Python, Flask, scikit-learn, pandas, and NumPy.
-   Planned local port: `5001`.
-   Planned approach: TF-IDF and cosine similarity, augmented by
    category, keyword, skill, and interaction-history signals.
-   The last folder audit did not show `python-ai/app.py` or
    `python-ai/model.py` in the expected folder.

## 3. Request flows

### Event listing

1.  Browser requests events from the frontend's configured API.
2.  API queries MySQL.
3.  API returns event records.
4.  Frontend renders event cards and handles loading/error states.

### Recommendation

1.  User enters an interest and optional category/skills.
2.  Frontend calls the Node API.
3.  Node API retrieves event data and optional interaction history.
4.  Node API calls the Python service.
5.  Python ranks events and returns scores/reasons.
6.  Node API returns results to the frontend.

### Authentication (planned)

1.  User submits signup or login form.
2.  Backend validates input and hashes/checks passwords.
3.  Backend establishes a secure session or issues an appropriate token.
4.  Protected endpoints identify the user from verified authentication
    state.
5.  Interactions are associated with that verified identity, not a
    client-supplied arbitrary ID.

## 4. Reliability boundaries

-   Frontend should display clear errors when the API is unavailable.
-   Backend should report database failures without leaking secrets.
-   Recommendation requests should fail gracefully if the ML service is
    unavailable.
-   A successful interaction log must not be presented as a confirmed
    event registration unless a registration workflow exists.

## 5. Architecture decisions to confirm

-   Exact current service entry points and ports.
-   Whether frontend and root folders are separate Git repositories.
-   Authentication strategy: secure cookie-based session or token-based
    approach.
-   Whether event registration requires a dedicated registrations table.
-   Whether ML inference should retrain TF-IDF for each request or cache
    a fitted model.
-   Production deployment and environment configuration.

## 6. Definition of done

Architecture is considered verified only after the actual source files,
API contracts, database schema, and local service startup have been
inspected and tested.
