# EventSphere --- Integration Guide

**Status:** Step-by-step integration plan. Confirm current files before
editing.

## 1. Integration map

``` text
React frontend
   |
   | HTTP/JSON
   v
Node/Express API
   |             \
   | SQL          \ HTTP/JSON
   v               v
MySQL          Python/Flask recommender
```

## 2. Frontend to backend

-   Use a single configured API base URL rather than scattering
    hardcoded URLs across components.
-   Confirm CORS allows the actual frontend origin.
-   Check `response.ok`/HTTP errors and show user-safe messages.
-   Include loading, empty, and error states.
-   Do not display success before the server confirms it.

## 3. Backend to MySQL

-   Keep database configuration in environment variables.
-   Use a connection pool if supported by the current implementation.
-   Use parameterized queries.
-   Confirm tables and columns exist before relying on them.
-   Avoid returning internal SQL errors to the browser in production.

## 4. Backend to Python ML

Expected development address previously discussed:
`http://127.0.0.1:5001`.

Recommended request data: - `interest` - `category` - `skills` -
`events` - `history` - `top_n`

Recommended handling: - Set a request timeout. - Validate the response
shape. - Handle connection failures and non-2xx responses. - Do not
block ordinary event listing if the ML service is unavailable. - Keep
the scoring algorithm and weight configuration documented.

## 5. Frontend to authentication

1.  User opens Login or Get Started.
2.  Frontend validates basic field formatting.
3.  Frontend submits credentials over HTTPS in production.
4.  Backend verifies credentials and creates the configured
    session/token.
5.  Frontend updates the signed-in state only after confirmation.
6.  Protected API requests use the chosen authentication mechanism.
7.  Backend derives the user ID from verified identity.

## 6. Environment and ports

Previously used local addresses: - Vite: `http://localhost:5173` - Node
API: `http://localhost:5000` - Python ML: `http://localhost:5001`

Verify actual ports in source/configuration. Avoid conflicting processes
and do not expose development services publicly.

## 7. Integration test order

1.  Frontend starts.
2.  MySQL starts and schema is verified.
3.  Backend health check succeeds.
4.  Event API returns records.
5.  Python health check succeeds.
6.  Recommendation API returns a valid response.
7.  Interaction API persists a record.
8.  Authentication succeeds only after secure endpoints are implemented.
9.  End-to-end UI shows correct loading and error states.
