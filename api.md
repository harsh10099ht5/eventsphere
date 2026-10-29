# EventSphere --- API Contract

**Status:** Intended contract based on prior project work. Confirm each
route in the current backend source before relying on it.

## 1. Local service addresses

-   Frontend: `http://localhost:5173`
-   Node API: `http://localhost:5000`
-   Python recommendation service: `http://localhost:5001`

These are previously used development addresses, not a guarantee that
the services currently run.

## 2. Intended endpoints

  Method     Endpoint                      Purpose
  ---------- ----------------------------- -------------------------------
  `GET`      `/`                           Backend service information
  `GET`      `/api/health`                 Check backend/database health
  `GET`      `/api/events`                 List events
  `GET`      `/api/events/:id`             Fetch one event
  `POST`     `/api/recommend`              Generate recommendations
  `POST`     `/api/interactions`           Record an interaction
  `GET`      `/api/interactions/:userId`   Read interaction history
  `DELETE`   `/api/interactions/:id`       Delete an interaction

## 3. Event listing

### Request

`GET /api/events`

### Intended response

An array of event records containing fields such as `id`, `title`,
`description`, `event_date`, `event_time`, `venue`, `category`, and
`skills`.

## 4. Recommendation request

### Request

`POST /api/recommend`

``` json
{
  "interest": "artificial intelligence",
  "category": "Technical",
  "skills": ["Python", "Machine Learning"],
  "top_n": 5,
  "user_id": 1
}
```

The `user_id` field appeared in prior development examples. For real
authenticated use, the backend should derive the user identity from
verified authentication state rather than trust a client-supplied ID.

### Intended response shape

``` json
{
  "status": "success",
  "events_analyzed": 10,
  "recommendations": [
    {
      "id": 1,
      "title": "Example event",
      "match_score": 72.5,
      "reason": "Recommended because it matches your interests.",
      "score_breakdown": {
        "content_similarity": 70,
        "category_match": 100,
        "keyword_match": 50,
        "skill_match": 50,
        "behavior_match": 0
      }
    }
  ]
}
```

This is an illustrative contract, not a guaranteed live response. The
actual service may use different field names or values.

## 5. Interaction request

`POST /api/interactions`

``` json
{
  "user_id": 1,
  "event_id": 2,
  "interaction_type": "bookmark"
}
```

Allowed interaction types previously discussed: `view`, `bookmark`,
`register`.

Expected validation: - Valid integer user/event IDs. - Event exists. -
Interaction type is allowed. - Server derives user identity from
authentication when auth is implemented.

## 6. Planned authentication endpoints

These are proposed, not confirmed implemented:

-   `POST /api/auth/signup`
-   `POST /api/auth/login`
-   `POST /api/auth/logout`
-   `GET /api/auth/me`

Use generic login errors, secure password hashing, and a secure session
or token design. Never return password hashes or secrets.

## 7. Error response convention

Suggested consistent format:

``` json
{
  "status": "error",
  "message": "A concise user-safe explanation"
}
```

Use appropriate HTTP status codes such as `400` for invalid input, `401`
for unauthenticated requests, `403` for forbidden actions, `404` for
missing resources, and `500` for unexpected server errors.

## 8. API verification

Use browser/PowerShell/Postman to test one endpoint at a time. Confirm
the actual backend source and route behavior before assuming these
contracts are active.
