# EventSphere --- Feature Inventory

**Status convention** - **Seen/discussed:** referenced in screenshots or
prior project work. - **Needs verification:** current code/runtime must
be inspected. - **Planned:** not confirmed implemented.

## 1. Landing page and navigation

-   Branding: EventSphere wordmark with red accent.
-   Navigation: Home, Events, How It Works, About.
-   Actions: Login and Get Started.
-   Status: UI is visible in the supplied screenshot; verify all click
    behavior.

## 2. Event discovery

-   Event cards/listing.
-   Event metadata: title, description, date, time, venue, category,
    skills.
-   Search/filtering if supported by current code.
-   Status: previously discussed; verify live API integration and UI.

## 3. Event actions

-   View event details.
-   Bookmark.
-   Register interest.
-   Track event views.
-   Status: interaction API and weights were discussed, but current
    backend files and database need verification. An interaction record
    is not a complete registration workflow.

## 4. AI event recommendations

-   Interest input.
-   Optional category and skills.
-   Ranked events.
-   Relevance score and explanation.
-   Optional score breakdown.
-   Intended algorithm: TF-IDF + cosine similarity, with category,
    keyword, skill, and behavior signals.
-   Status: design/code was previously discussed; current Python files
    were not visible in the last expected-folder audit.

## 5. Authentication

-   Login UI.
-   Signup UI.
-   Password visibility and form validation.
-   Status: UI component was prepared separately; real backend
    authentication is planned and not confirmed.

## 6. User history

-   Store views, bookmarks, and registration interactions.
-   Use history for personalization.
-   Status: database design discussed; verify table and service
    behavior.

## 7. Future scope

-   Dedicated event registration records.
-   User activity dashboard.
-   Organizer/admin event management.
-   Notifications and calendar integration only if later required.

## 8. Feature completion rule

Mark a feature **Complete** only after the current source is present,
the feature works locally, failure cases are handled, and relevant
API/database behavior is verified.
