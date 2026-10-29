import pypandoc

prd = r"""# EventSphere — Product Requirements Document (PRD)

**Document status:** Working draft  
**Project:** EventSphere  
**Last updated:** 29 October 2026  
**Product type:** College event discovery and recommendation web application

> This PRD is based on the EventSphere project details shared in conversation. Items described as planned or requiring verification are not claimed to be implemented.

## 1. Product Overview

EventSphere is a web application intended to help college students discover campus events, explore event details, bookmark events, register their interest, and receive relevant event recommendations. The project is intended to combine a React frontend, a Node.js/Express API, a MySQL database, and a Python-based recommendation service.

The current frontend branding and interface include a navigation bar with Home, Events, How It Works, About, Login, and Get Started controls.

## 2. Problem Statement

Students may have difficulty finding campus events relevant to their interests, skills, and learning goals. A centralized event discovery experience with searchable event information and personalized recommendations can make it easier to discover useful technical, cultural, and extracurricular activities.

## 3. Product Goals

1. Provide a centralized interface for discovering college events.
2. Display useful event information, including title, description, date, time, venue, category, and skills.
3. Allow users to record event activity such as views, bookmarks, and registrations.
4. Recommend events based on stated interests and event metadata.
5. Evolve toward behavior-aware recommendations using a user's interaction history.
6. Add real account registration and login so activity can be associated with individual users.
7. Maintain a modular architecture that can be tested and extended.

## 4. Target Users

### 4.1 Students
Students browse events, search for topics, bookmark events, register their interest, and view recommendations.

### 4.2 Event administrators — future scope
An administrator role may allow authorized staff to create, update, and remove events. This role is not confirmed as implemented in the current project.

## 5. Core User Journeys

### 5.1 Discover events
1. User opens EventSphere.
2. User navigates to the Events section.
3. The application displays available events.
4. User reviews event information and filters or searches when supported.

### 5.2 Bookmark an event
1. User selects Bookmark on an event.
2. The frontend sends the interaction to the backend.
3. The backend validates the request and records the interaction in MySQL.
4. The interface reflects the bookmark state.

**Implementation note:** Interaction API and persistence have been described in earlier project work. Current local implementation must be verified before this journey is considered complete.

### 5.3 Register for an event
1. User selects Register on an event.
2. The application records a registration interaction.
3. The user receives clear feedback.

**Scope note:** Recording an interaction is not the same as a complete event registration workflow. Confirmation, capacity management, and registration records may need separate implementation.

### 5.4 Get AI recommendations
1. User enters an interest and optionally selects a category or skills.
2. The frontend sends the request to the Node.js API.
3. The API retrieves event data from MySQL.
4. The API forwards event data and, when available, interaction history to the Python recommendation service.
5. The service ranks events and returns scores and explanations.
6. The frontend displays recommended events.

## 6. Functional Requirements

| ID | Requirement | Priority | Status based on current evidence |
|---|---|---|---|
| FR-01 | Display the EventSphere landing page and navigation | High | Frontend is present; verify current runtime |
| FR-02 | Display event listings | High | Previously implemented; current local state needs verification |
| FR-03 | Display event details, including date, time, venue, category, and skills when available | High | Data fields have been defined; verify UI/API integration |
| FR-04 | Search or filter events | Medium | Existing UI has been discussed; verify current behavior |
| FR-05 | Record view, bookmark, and register interactions | High | Backend route was previously designed; current backend files need locating or restoring |
| FR-06 | Save interaction history in MySQL | High | Database schema was previously defined; verify actual database |
| FR-07 | Generate interest-based event recommendations | High | Python recommendation approach was designed; current service files need locating or restoring |
| FR-08 | Return recommendation scores and explanations | Medium | Included in previously described model design; verify output |
| FR-09 | Register a new user account | High | Planned; not confirmed implemented |
| FR-10 | Authenticate a user with email and password | High | Planned; not confirmed implemented |
| FR-11 | Hash passwords securely on the server | High | Required for real authentication; not confirmed implemented |
| FR-12 | Associate bookmarks and activity with the authenticated user | High | Requires real user identity and authentication integration |
| FR-13 | Provide a user activity dashboard | Medium | Proposed future step; not confirmed implemented |
| FR-14 | Provide administrative event management | Future | Proposed future scope |

## 7. Proposed Technical Architecture

### Frontend
- **Technology:** React with Vite
- **Responsibilities:** Landing page, event discovery, forms, event interactions, recommendation display, and user feedback.
- **Known local files:** `frontend/src/App.jsx`, `frontend/src/app.css`, and `frontend/src/main.jsx`.
- **Authentication UI:** A login/signup modal was prepared separately, but it is not proof of backend authentication.

### Backend API
- **Technology:** Node.js and Express (intended architecture)
- **Responsibilities:** Validate requests, expose event and interaction APIs, communicate with MySQL, and call the Python recommendation service.
- **Previously documented development port:** `5000`
- **Current status:** The most recent folder audit showed `backend/.env` and `backend/node_modules`, but did not show `backend/server.js` or `backend/db.js` in that directory. Locate or restore the actual source files before treating the backend as runnable.

### Database
- **Technology:** MySQL (intended architecture; XAMPP has been used for local development)
- **Previously documented database name:** `eventsphere`
- **Previously documented tables:** `events` and `user_event_interactions`
- **Current status:** Schema and connectivity need verification against the local database.

Previously documented event fields:
- `id`
- `title`
- `description`
- `event_date`
- `event_time`
- `venue`
- `category`
- `skills`
- `created_at`

Previously documented interaction fields:
- `id`
- `user_id`
- `event_id`
- `interaction_type` (`view`, `bookmark`, `register`)
- `interaction_score`
- `created_at`

Previously discussed interaction weights:
- View: `0.20`
- Bookmark: `0.50`
- Register: `1.00`

### Recommendation service
- **Technology:** Python and Flask (intended architecture)
- **Previously documented development port:** `5001`
- **Algorithm design:** TF-IDF vectorization and cosine similarity, with category, keyword, skill, and behavior signals.
- **Previously discussed score weights:**
  - Content similarity: 45%
  - Category match: 15%
  - Keyword match: 15%
  - Skill match: 15%
  - Behavior match: 10%
- **Current status:** The most recent folder audit did not show `python-ai/app.py` or `python-ai/model.py` in the expected directory. The Python source files must be located or restored before the service can be verified.

## 8. API Contract — Intended/Previously Documented

These are routes described in prior project work. Confirm that the actual source code implements them before relying on them.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend/database health |
| GET | `/api/events` | Retrieve events |
| GET | `/api/events/:id` | Retrieve one event |
| POST | `/api/recommend` | Request ranked event recommendations |
| POST | `/api/interactions` | Record a view, bookmark, or register interaction |
| GET | `/api/interactions/:userId` | Retrieve a user's interaction history |
| DELETE | `/api/interactions/:id` | Delete an interaction |

Authentication endpoints still need to be designed and implemented, for example:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (if required by the chosen session/token approach)
- `POST /api/auth/logout` (if required by the chosen session/token approach)

Do not expose passwords, password hashes, tokens, or secrets in API responses or logs.

## 9. Authentication and Security Requirements

1. Validate all input on the server, not only in the browser.
2. Hash passwords using a well-maintained password-hashing library such as bcrypt or Argon2.
3. Never store plaintext passwords.
4. Use parameterized SQL queries.
5. Use a secure session or token strategy and protect authenticated endpoints.
6. Enforce authorization on the server; hiding a UI button is not access control.
7. Keep credentials and signing secrets in environment variables; do not commit `.env`.
8. Configure CORS for known development/production origins.
9. Add rate limiting and safe error messages to authentication endpoints.
10. Associate interactions with the authenticated user's server-verified ID, rather than trusting an arbitrary `user_id` supplied by the browser.

## 10. Non-Functional Requirements

- **Usability:** Clear navigation, readable event information, understandable errors, and responsive layouts.
- **Reliability:** Fail gracefully when MySQL or the recommendation service is unavailable.
- **Performance:** Avoid unnecessary repeated database and ML requests; establish measurable targets after baseline testing.
- **Security:** Validate input, protect credentials, and enforce user-level authorization.
- **Maintainability:** Keep frontend, API, database, and recommendation responsibilities separated.
- **Accessibility:** Use semantic forms, labels, keyboard-accessible controls, visible focus states, and accessible error messages.
- **Observability:** Log operational errors without logging passwords, tokens, or other secrets.

## 11. UI and UX Requirements

- Preserve the existing EventSphere visual identity and current landing-page styling where possible.
- Provide clear loading, empty, success, and error states.
- Make event actions explicit: View Details, Bookmark, and Register.
- Display recommendation reasons and score breakdowns only when returned by the API.
- Authentication UI should support login/signup mode switching, password visibility, and client-side validation.
- The UI must not claim login or signup succeeded until the backend confirms it.

## 12. Acceptance Criteria

The project should not be considered ready for a demonstration until the following checks pass:

1. Frontend starts successfully and loads without browser-console errors.
2. Event list data comes from the configured API rather than unintended hardcoded fallback data.
3. Backend health check confirms database connectivity.
4. Events can be retrieved from MySQL.
5. Valid interaction requests are stored and invalid requests are rejected.
6. Recommendation requests return ranked events for a valid interest.
7. Recommendation behavior with no history and with interaction history is tested separately.
8. Signup rejects invalid input and duplicate email addresses.
9. Passwords are stored as hashes, never plaintext.
10. Login succeeds only for valid credentials.
11. Authenticated user activity cannot be read or modified by another user without authorization.
12. Failures in the backend, database, or ML service produce understandable error states.

## 13. Current Known Risks and Open Questions

- The latest local folder audit showed the expected backend and Python source files were not present in their expected directories. They may exist elsewhere, be open in VS Code from another location, or need restoration.
- The project contains a nested `eventsphere` directory with `.gitignore`, `LICENSE`, and `README.md`; its relationship to the root repository is not yet established.
- The root and frontend Git repository structure must be checked before committing changes.
- The actual MySQL schema and event data need verification.
- The login/signup UI is separate from a real authentication implementation.
- A `register` interaction does not by itself establish a full event registration workflow.
- The identity strategy (session cookie versus token-based authentication) remains to be selected.
- The admin/event-management scope remains unconfirmed.

## 14. Recommended Implementation Roadmap

### Phase 0 — Audit and protect existing work
- Locate all source files.
- Inspect Git status, branches, remotes, and nested repositories.
- Preserve uncommitted changes and back up the current state.

### Phase 1 — Restore a working baseline
- Verify frontend startup and current UI.
- Locate or restore backend source.
- Locate or restore Python recommendation source.
- Verify MySQL schema and connectivity.
- Test each service independently.

### Phase 2 — Complete event discovery
- Connect event listings to MySQL-backed API data.
- Verify event details, search, and filters.
- Add robust loading and error states.

### Phase 3 — Complete interaction tracking
- Verify view, bookmark, and register API behavior.
- Confirm interactions persist in MySQL.
- Remove reliance on a fixed demo user ID once authentication exists.

### Phase 4 — Complete recommendation integration
- Verify TF-IDF/cosine similarity ranking.
- Verify category, keyword, skill, and behavior signals.
- Display recommendation reasons and score breakdowns.
- Test cold-start behavior when a user has no history.

### Phase 5 — Implement real authentication
- Create the users schema.
- Implement signup, login, logout/session handling, and server-side authorization.
- Hash passwords securely.
- Associate user activity with the authenticated identity.

### Phase 6 — User dashboard and quality
- Build My Activity for views, bookmarks, and registrations.
- Add tests for API validation and authorization.
- Test responsive layout and accessibility.
- Document local setup and environment variables.

### Phase 7 — Release preparation
- Review `.gitignore` and ensure secrets and virtual environments are excluded.
- Commit verified changes in small, descriptive commits.
- Document known limitations and demonstration steps.

## 15. Out of Scope for the Initial Version

Unless explicitly added to the requirements, the initial version does not promise:
- Payment processing or paid event tickets.
- Email/SMS notifications.
- Calendar synchronization.
- QR-based attendance.
- Production hosting or production-grade monitoring.
- A fully operational admin console.
- A trained deep-learning recommendation model; the described recommendation approach is primarily content-based TF-IDF and similarity scoring with additional signals.

## 16. Definition of Done

A feature is done only when:
- Its behavior is implemented in the correct layer.
- The relevant API/database integration works.
- Invalid and failure cases are handled.
- It has been tested locally.
- Existing working functionality remains intact.
- Configuration and documentation are updated when needed.
- The change is committed without secrets or unrelated files.
"""

output = "/mnt/data/PRD.md"
pypandoc.convert_text(prd, "md", format="md", outputfile=output, extra_args=["--standalone"])
print(f"Created PRD: {output}")
