# EventSphere --- Development Plan

**Goal:** Restart development in a controlled way without overwriting
working functionality.

## Phase 0 --- Audit and backup

-   [ ] Confirm the actual project root.
-   [ ] Inspect Git status, branch, remotes, and nested repositories.
-   [ ] Locate frontend, backend, Python, SQL, and environment files.
-   [ ] Back up uncommitted work before moving or replacing files.
-   [ ] Do not delete the nested `eventsphere/` directory until its
    purpose is known.

**Exit criteria:** Source-file inventory and backup exist.

## Phase 1 --- Restore the baseline

-   [ ] Start the frontend and record the actual URL.
-   [ ] Confirm the landing page and navigation still work.
-   [ ] Locate/restore Node API source.
-   [ ] Locate/restore Python ML source.
-   [ ] Verify MySQL schema and data.
-   [ ] Test each service independently.

**Exit criteria:** Existing working features are recorded and each
available service starts.

## Phase 2 --- Event data

-   [ ] Confirm the `events` schema.
-   [ ] Verify `GET /api/events` against MySQL.
-   [ ] Connect the UI to real API data.
-   [ ] Add loading, empty, and error states.
-   [ ] Verify event IDs match database records.

## Phase 3 --- Interaction tracking

-   [ ] Verify the interactions table.
-   [ ] Test view/bookmark/register interactions.
-   [ ] Confirm records persist.
-   [ ] Separate tracking events from actual event registrations where
    needed.

## Phase 4 --- Recommendations

-   [ ] Restore and test the Python service.
-   [ ] Verify TF-IDF/cosine similarity.
-   [ ] Test category, keyword, skill, and behavior signals.
-   [ ] Test users with no history and users with history.
-   [ ] Verify explanations and score breakdowns.

## Phase 5 --- Authentication

-   [ ] Design and migrate the users table.
-   [ ] Implement signup and duplicate-email validation.
-   [ ] Hash passwords with bcrypt or Argon2.
-   [ ] Implement login and secure session/token handling.
-   [ ] Protect authenticated routes.
-   [ ] Associate activity with verified user identity.

## Phase 6 --- Quality and release

-   [ ] Add API and UI tests.
-   [ ] Test mobile and desktop layouts.
-   [ ] Review accessibility and error handling.
-   [ ] Update documentation.
-   [ ] Review `.gitignore` and repository boundaries.
-   [ ] Commit verified changes in small, descriptive commits.

## Working rules

1.  One logical change at a time.
2.  Inspect before replacing files.
3.  Keep a known-good checkpoint.
4.  Do not commit secrets or generated dependency folders.
5.  Never claim a feature works until it has been tested.
