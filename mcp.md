# EventSphere --- MCP Integration Proposal

**Status:** Optional future integration. No MCP server or client
integration is confirmed in the current project audit.

## 1. What MCP could add

Model Context Protocol (MCP) can provide a standard way for an
AI-enabled client to discover and invoke approved tools or access
selected resources. It is not required for the core EventSphere event
listing or recommendation system.

## 2. Possible future tools

If an MCP integration is justified, narrowly scoped tools might
include: - `list_events`: return published event summaries. -
`get_event`: return public details for one event. - `recommend_events`:
request recommendations using explicit user preferences. -
`list_my_bookmarks`: return the authenticated user's bookmarks, with
proper authorization. - `create_event_draft`: create a draft only for an
authorized organizer.

These are examples, not existing tools.

## 3. Security requirements

-   Expose only the minimum necessary tools and data.
-   Authenticate and authorize every operation.
-   Never expose database credentials or unrestricted SQL execution.
-   Treat tool arguments as untrusted input.
-   Validate event IDs and all supplied fields.
-   Require confirmation for consequential write actions where
    appropriate.
-   Enforce user identity server-side.
-   Log operations without storing secrets or unnecessary personal data.
-   Apply timeouts, rate limits, and error handling.

## 4. Suggested integration boundary

``` text
MCP-capable client
       |
       v
MCP server (future)
       |
       v
Existing authenticated EventSphere API
       |
       +--> MySQL
       +--> Recommendation service
```

Prefer calling the existing API rather than letting an MCP server access
the database directly. This keeps validation and authorization in one
place.

## 5. Decision criteria

Add MCP only if there is a clear use case such as an approved assistant
workflow. It should not be introduced solely because the project
includes AI recommendations. First complete and test the ordinary
frontend, API, database, and authentication flows.
