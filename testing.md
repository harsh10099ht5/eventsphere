# EventSphere --- Testing Strategy

**Status:** Test plan; no test suite or passing results are claimed by
this document.

## 1. Test levels

### Unit tests

-   Validate input-normalization helpers.
-   Test recommendation scoring with controlled event records.
-   Test API validation and utility functions.

### API integration tests

-   Event list and event detail.
-   Invalid event ID and missing event.
-   Recommendation request validation.
-   ML service unavailable behavior.
-   Interaction type validation and persistence.
-   Authentication and authorization once implemented.

### Frontend tests

-   Navigation and modal behavior.
-   Form validation.
-   Loading, empty, success, and error states.
-   Recommendation result rendering.
-   Mobile layout and keyboard navigation.

### End-to-end tests

-   Browse events.
-   Request recommendations.
-   Sign up and sign in after auth is implemented.
-   Bookmark an event and verify persistence.
-   Confirm users cannot access another user's private history.

## 2. Example manual test matrix

  ----------------------------------------------------------------------------
  Test                    Input/action                 Expected result
  ----------------------- ---------------------------- -----------------------
  Frontend start          `npm run dev` in frontend    Vite starts and page
                                                       renders

  Event listing           Request `GET /api/events`    JSON event list or
                                                       clear error

  Invalid event ID        `GET /api/events/abc`        Validation error

  Missing interest        Send recommendation request  `400`-style validation
                          without interest             response

  Unknown interaction     `interaction_type: "like"`   Request rejected
  type                                                 

  Unknown event           Use a nonexistent event ID   Not found response

  ML service down         Stop Python service and      Controlled service
                          request recommendations      error

  Signup duplicate email  Submit an existing email     Rejected without
                                                       duplicate account

  Wrong password          Login with invalid           Generic authentication
                          credentials                  failure

  Authorization           User A requests User B's     Access denied
                          history                      
  ----------------------------------------------------------------------------

## 3. Recommendation quality

Use a labeled evaluation set where possible. Consider Precision@K,
Recall@K, NDCG@K, coverage, diversity, latency, and cold-start behavior.
Do not claim model accuracy without a reproducible evaluation method and
data.

## 4. Security tests

-   Passwords are never returned or logged.
-   SQL injection attempts are safely handled.
-   Authentication endpoints are rate-limited.
-   Protected routes reject unauthenticated requests.
-   User IDs cannot be spoofed to access another user's data.
-   `.env` and credentials are excluded from commits.

## 5. Regression checklist

Before each major commit: - Confirm the existing landing page still
works. - Confirm navigation still works. - Confirm event cards render. -
Confirm recommendation UI remains functional if its service is
available. - Check browser console and terminal for errors. - Review
`git diff` for accidental file deletions or secrets.
