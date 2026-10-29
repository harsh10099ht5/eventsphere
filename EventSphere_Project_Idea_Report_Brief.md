# EventSphere --- Project Idea and Report Brief

**Purpose:** Share this brief with a friend so they can prepare a
detailed academic project report.\
**Project name:** EventSphere\
**Project type:** Web-based college event discovery and AI-assisted
recommendation platform\
**Status:** Proposed project description based on the current project
discussions. Verify actual implementation before writing that a feature
is completed.

------------------------------------------------------------------------

## 1. Project Summary

EventSphere is a web application intended to make it easier for college
students to discover campus events that match their interests, skills,
and preferred categories. Instead of requiring students to search
through scattered notices, messages, posters, or social media posts, the
platform aims to present event information in one place and help users
identify relevant opportunities.

The main differentiator is an AI-assisted event recommendation feature.
A student can provide an interest such as artificial intelligence, web
development, robotics, coding, or cultural activities. The
recommendation component compares the student's input with event titles,
descriptions, categories, and skills/topics to rank potentially relevant
events. If interaction history is available, views, bookmarks, and
registrations may also be used as personalization signals.

The intended product combines a user-friendly web interface, an API
backend, a relational database, and a Python-based recommendation
service. It is designed as a practical college project that demonstrates
full-stack development, database integration, API communication, and
applied machine-learning concepts.

**Important report-writing rule:** The report author must distinguish
between features that have been implemented and tested, features whose
code has been prepared but not verified, and future enhancements. Do not
claim the system is production-ready or that the recommendation model
has a measured accuracy unless there is test evidence.

## 2. Problem Statement

College event information can be spread across multiple channels, making
it difficult for students to discover all relevant events. Students may
miss technical workshops, hackathons, seminars, cultural programmes, or
sports events because they do not see the announcement in time or cannot
easily filter events by interest.

A conventional event listing can show available events, but it does not
necessarily personalize discovery. EventSphere proposes a centralized
event-discovery interface with a recommendation feature that ranks
events based on the information provided by the student and, where
implemented, their interaction history.

### Problems the project aims to address

1.  Event information may be scattered across different channels.
2.  Students may struggle to find events relevant to their interests and
    skills.
3.  Manually scanning a long list of events can take time.
4.  Organizers need a clear way to present event details in a consistent
    format.
5.  A future personalized system can use explicit preferences and
    voluntary interactions to improve relevance.

## 3. Objectives

-   Provide a central interface for browsing college events.
-   Present event details such as title, description, date, time, venue,
    category, and relevant skills/topics.
-   Allow students to submit interests and optionally specify a category
    or skills.
-   Rank events using a content-based recommendation approach.
-   Explain why an event appears in the recommendation results.
-   Store event data in a relational database.
-   Use an API backend to connect the frontend, database, and
    recommendation service.
-   Optionally use user interaction history for personalization after
    identity and access controls are implemented.
-   Create a maintainable foundation for future authentication, event
    registration, organizer tools, and notifications.

## 4. Intended Users

### Students

-   Browse available events.
-   Explore event details.
-   Enter interests and skills to receive recommendations.
-   Bookmark events or initiate registration if those flows are
    implemented.

### Event organizers (future scope unless verified)

-   Publish and update event information.
-   Maintain event descriptions, dates, venues, categories, and
    skill/topic tags.
-   Review event engagement, subject to appropriate access controls.

### Administrator (future scope unless verified)

-   Manage users and event records.
-   Moderate content.
-   Maintain data quality and system configuration.

Do not describe organizer/admin dashboards as implemented unless they
can be demonstrated in the current application.

## 5. Main Features

### 5.1 Home page and navigation

A landing page introduces EventSphere and guides users toward event
discovery and recommendations. The visible design discussed previously
uses a white background, dark text, red brand accents, and clear
navigation actions.

### 5.2 Event discovery

Events are intended to be displayed as cards or a list. A record may
include: - Event title - Description - Date and time - Venue -
Category - Skills or topics

The frontend should display loading, empty, and error states when event
data is fetched from the API.

### 5.3 AI event recommendations

The user enters an interest, with optional category and skill
preferences. The recommendation engine compares these inputs against
event metadata and returns a ranked list.

The previously discussed design uses a weighted score based on: -
Content similarity: 45% - Category match: 15% - Keyword match: 15% -
Skill match: 15% - Behavior match: 10%

These are design/code values discussed during development and must be
checked against the active source before being presented as the final
implemented algorithm. The match score is a relevance score, not a
probability that a student will attend an event.

### 5.4 Recommendation explanations

A recommendation may include a short explanation such as "matches your
interests" or "matches your skills." If available, a score breakdown can
show the contribution of content, category, keyword, skill, and behavior
signals.

### 5.5 Interaction tracking (planned/needs verification)

The intended design records actions such as: - `view` - `bookmark` -
`register`

Previously discussed interaction weights: - View: 0.20 - Bookmark:
0.50 - Register: 1.00

An interaction record labelled `register` should not be confused with a
complete registration workflow. A proper registration feature may
require a dedicated table, duplicate-registration prevention, capacity
handling, and confirmation status.

### 5.6 Login and signup (needs verification)

A login/signup interface has been discussed. A real authentication
system requires server endpoints, password hashing, secure session/token
handling, and authorization. The existence of a frontend form alone does
not mean authentication is operational.

## 6. Technology Stack

The following is the intended stack from project discussions. Confirm it
against actual files before final submission.

  -----------------------------------------------------------------------
  Layer                   Intended technology     Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React                   Reusable user interface
                                                  components

  Frontend tooling        Vite                    Local development
                                                  server and build
                                                  tooling

  Styling                 CSS                     Layout, responsive
                                                  styling, and visual
                                                  design

  Backend                 Node.js + Express       API endpoints,
                                                  validation, and
                                                  orchestration

  Database                MySQL                   Store events and
                                                  interaction records

  Local database tooling  XAMPP/phpMyAdmin        Local database
                          (previously used)       management

  Recommendation service  Python + Flask          Expose recommendation
                                                  logic through an HTTP
                                                  API

  ML/data libraries       scikit-learn, pandas,   Text vectorization,
                          NumPy                   similarity scoring, and
                                                  data handling

  Version control         Git + GitHub            Source history and
                                                  collaboration
  -----------------------------------------------------------------------

### Intended architecture

``` text
Student / Browser
       |
       v
React + Vite Frontend
       |
       v
Node.js + Express API
       |                         \
       v                          v
MySQL Database             Python + Flask ML API
(events and interactions)   (recommendation ranking)
```

Previously used local addresses: - Frontend: `http://localhost:5173` -
Backend API: `http://localhost:5000` - Python ML service:
`http://localhost:5001`

These are development addresses, not proof that the services currently
start successfully.

## 7. Recommendation Methodology

### 7.1 Content preparation

The system combines event title, description, category, and
skills/topics into text used for comparison. Text normalization may
convert text to lowercase and remove or standardize unnecessary
characters.

### 7.2 TF-IDF

Term Frequency--Inverse Document Frequency (TF-IDF) converts text
documents into numerical feature vectors. Terms that help distinguish
one event from others can contribute more strongly than very common
terms.

### 7.3 Cosine similarity

Cosine similarity compares the user's interest query with event text
vectors. A higher similarity generally indicates that the text is more
aligned with the query.

### 7.4 Additional signals

The discussed design adds optional: - Category match - Keyword overlap -
Skill overlap - Behavior similarity based on past interactions

### 7.5 Weighted score

The proposed weighted formula is:

``` text
Final Score =
    0.45 × Content Similarity
  + 0.15 × Category Match
  + 0.15 × Keyword Match
  + 0.15 × Skill Match
  + 0.10 × Behavior Match
```

All components should be normalized to a consistent range before
combining them. If no user history exists, behavior personalization may
be zero or unavailable, and the system should still produce
recommendations from the user's stated interests.

### 7.6 Limitations

-   Sparse event data can reduce recommendation quality.
-   New users may have no interaction history.
-   Keyword overlap may miss synonyms or context.
-   TF-IDF is a classical text-based method, not a deep-learning model.
-   Scores should not be described as model accuracy.
-   Quality must be evaluated using a documented test set or relevance
    judgments.

## 8. Database Design

### 8.1 Events table

The previously discussed `events` table includes fields similar to:

  Field           Purpose
  --------------- -----------------------------------------
  `id`            Unique event identifier
  `title`         Event name
  `description`   Event details
  `event_date`    Date of event
  `event_time`    Start time
  `venue`         Location
  `category`      Event category
  `skills`        Skills/topics associated with the event
  `created_at`    Record creation timestamp

Exact data types and constraints must be taken from the active database
schema.

### 8.2 User interaction table

A table named `user_event_interactions` was discussed with fields: -
`id` - `user_id` - `event_id` - `interaction_type` -
`interaction_score` - `created_at`

The event foreign key and indexes were included in the proposed schema.
The existence of the table and any user foreign key must be verified.

### 8.3 Users table

A users table is needed for real authentication, but its existence was
not confirmed in the latest audit. It should store a password hash, not
a plaintext password.

### 8.4 Future registration table

A dedicated registration table is recommended if the system needs
reliable registration status, timestamps, cancellations, capacity
limits, or confirmation details.

## 9. API Design

The following endpoints were discussed as the intended Node backend
contract. Confirm them in the active server source.

  Method   Endpoint                      Purpose
  -------- ----------------------------- -----------------------------
  GET      `/`                           Backend service information
  GET      `/api/health`                 Health/database check
  GET      `/api/events`                 Fetch event list
  GET      `/api/events/:id`             Fetch one event
  POST     `/api/recommend`              Generate recommendations
  POST     `/api/interactions`           Record an interaction
  GET      `/api/interactions/:userId`   Fetch interaction history
  DELETE   `/api/interactions/:id`       Delete an interaction

Proposed authentication endpoints, not confirmed implemented: -
`POST /api/auth/signup` - `POST /api/auth/login` -
`POST /api/auth/logout` - `GET /api/auth/me`

## 10. Security and Privacy

-   Validate all input on the server.
-   Use parameterized SQL queries.
-   Hash passwords with an appropriate password-hashing library.
-   Do not commit `.env` files or credentials.
-   Do not trust a client-supplied `user_id` for authorization.
-   Ensure users cannot access another user's private interaction
    history.
-   Use HTTPS in production.
-   Limit and sanitize logs; never log passwords or tokens.
-   Keep CORS configuration limited to intended origins.
-   Use rate limiting and appropriate session/token protections for
    authentication.
-   Store only the personal data needed for the product.

## 11. Non-Functional Requirements

### Performance

Event listing and recommendation requests should respond within an
acceptable time under the expected project demo workload. Measure actual
latency rather than inventing benchmark results.

### Usability

The UI should use clear labels, readable typography, responsive layouts,
and understandable error messages.

### Reliability

The app should handle unavailable APIs, database errors, and ML service
failures without crashing the entire frontend.

### Maintainability

Separate frontend, backend, database scripts, and recommendation logic.
Keep API contracts and configuration documented.

### Accessibility

Use semantic HTML, keyboard-accessible controls, visible focus
indicators, form labels, and adequate contrast.

## 12. Testing and Evaluation

The report should document tests actually performed. Suggested test
cases: 1. Frontend starts and renders the home page. 2. Event API
returns records from MySQL. 3. Invalid event IDs produce a controlled
error. 4. Recommendation input validation rejects an empty interest. 5.
Recommendation results are ranked in descending order. 6. The
recommender works when no interaction history exists. 7. Valid
interaction records persist to the database. 8. Invalid interaction
types are rejected. 9. The UI displays loading, empty, and error states
correctly. 10. Authentication tests are run only after the backend
authentication flow exists. 11. Mobile and desktop layouts are checked.
12. Secrets are excluded from Git commits.

For recommendation evaluation, consider Precision@K, Recall@K, NDCG@K,
event coverage, diversity, and latency if suitable labelled data is
available. Do not invent accuracy percentages or evaluation outcomes.

## 13. Known Project Status and Risks

A prior local folder audit reported: - `frontend/src/App.jsx`,
`frontend/src/app.css`, and `frontend/src/main.jsx` were present. - A
`backend/.env` and `backend/node_modules` directory were present. - A
`python-ai/venv` directory was present. - `backend/server.js`,
`backend/db.js`, `python-ai/app.py`, and `python-ai/model.py` were not
visible in their expected directories at that time. - A nested
`eventsphere/` directory existed inside the project root.

This may reflect an incomplete audit or source files located elsewhere.
Before preparing a final report, the project owner should locate the
actual files, check Git branches/history, and run the application. Do
not treat missing files as definitively deleted without further
inspection.

## 14. Future Scope

Potential future improvements: - Secure login and signup. - Student
profiles and saved preferences. - Organizer/admin event management. -
Dedicated event registration workflow. - Email or in-app reminders. -
Calendar integration. - Better synonym/semantic matching. -
Feedback-based recommendation evaluation. - Recommendation diversity and
freshness. - Deployment to a production hosting environment. - Analytics
for event organizers with appropriate privacy safeguards. - Optional MCP
integration only if a clear assistant/tool use case is identified.

## 15. Expected Project Outcomes

If implemented and tested, EventSphere can demonstrate: - Full-stack web
application development. - REST API design. - Relational database
integration. - Text feature extraction using TF-IDF. - Similarity-based
ranking. - Optional behavior-aware personalization. -
Frontend/backend/ML service integration. - Practical software testing
and documentation.

Do not claim all outcomes are achieved until the relevant functionality
is working and demonstrated.

## 16. Suggested Report Structure for the Friend

1.  Title page
2.  Certificate/declaration (follow the institution's required format)
3.  Acknowledgement
4.  Abstract
5.  Table of contents
6.  Introduction
7.  Problem statement
8.  Objectives and scope
9.  Existing system and proposed system
10. Requirement analysis
11. Technology stack
12. System architecture
13. UML diagrams (use cases, activity, sequence, and class/component
    diagrams as appropriate)
14. Database design and ER diagram
15. API design
16. Recommendation methodology
17. UI design and screenshots from the real running application
18. Implementation details with verified code snippets
19. Testing methodology and actual results
20. Limitations
21. Future scope
22. Conclusion
23. References

The report should use screenshots and results from the real project. Any
diagram should match the implementation, and every metric should have a
reproducible source.

## 17. Message to the Report Writer

Please use this brief as the starting point for the EventSphere project
report. Write the report in formal academic English, explain the problem
and proposed solution clearly, and include architecture, database, API,
recommendation methodology, testing, limitations, and future scope. Do
not invent implementation details, screenshots, performance numbers, or
accuracy metrics. Label any unimplemented feature as proposed/future
work. Before finalizing, confirm the actual source code and run the
application so the report reflects the current project rather than only
the intended design.
