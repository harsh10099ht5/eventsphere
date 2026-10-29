# EventSphere --- Agents and AI Responsibilities

**Status:** Conceptual design. EventSphere is not confirmed to use
autonomous agents.

## 1. Current AI capability

The recommendation approach previously discussed is a conventional
recommendation pipeline, not necessarily an autonomous agent. It
combines: - TF-IDF text vectorization. - Cosine similarity. - Category
matching. - Keyword overlap. - Skill overlap. - Optional
interaction-history signals.

Previously discussed score weights: - Content similarity: 45%. -
Category match: 15%. - Keyword match: 15%. - Skill match: 15%. -
Behavior match: 10%.

These weights should be treated as configuration/design notes until
verified in the current source.

## 2. Recommended component responsibilities

### Recommendation engine

Input: interest, optional category, skills, event records, and optional
history.

Output: ranked events, a relevance score, score breakdown, and a
human-readable reason.

### API orchestration layer

-   Validate request shape.
-   Retrieve event records.
-   Retrieve authorized user history when available.
-   Call the recommendation service.
-   Return a stable API response.
-   Handle service timeouts/errors.

### Optional future assistant/agent

A future agent could help an event organizer draft event descriptions or
help a student refine interests. This is optional future scope and
should not be implied to exist today.

## 3. Recommendation flow

``` text
User preferences + event records + optional history
                         |
                         v
                 Text normalization
                         |
                         v
                   TF-IDF vectors
                         |
                         v
                 Cosine similarity
                         |
                         +--> category match
                         +--> keyword match
                         +--> skill match
                         +--> behavior signal
                         |
                         v
                 Weighted final score
                         |
                         v
             Ranked events + explanations
```

## 4. Safety and quality requirements

-   Do not invent event data or claim events are available if the
    database says otherwise.
-   Explain that `match_score` is a relevance score, not a probability.
-   Handle missing history as a cold-start case.
-   Avoid using another user's interaction history.
-   Keep user-provided text and database fields as untrusted input.
-   Do not expose credentials or private user data in logs.
-   Evaluate recommendation quality with a documented test set before
    making accuracy claims.

## 5. Evaluation

Recommended evaluation measures: - Precision@K and Recall@K, where
ground-truth relevance labels exist. - NDCG@K for ranking quality. -
Coverage: how many available events can be recommended. - Diversity:
whether recommendations are overly repetitive. - Cold-start behavior for
users without history. - Latency and error rate.

Do not claim the recommender is trained with deep learning unless such a
model is actually implemented and evaluated.
