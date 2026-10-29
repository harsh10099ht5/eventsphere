# EventSphere --- Database Design

**Status:** Based on previously discussed schema; verify against the
active MySQL database before applying migrations.

## 1. Database

Previously documented database name: `eventsphere`. MySQL/XAMPP has been
used for local development.

## 2. `events` table

Previously documented fields:

  -----------------------------------------------------------------------
  Column                  Suggested type          Purpose
  ----------------------- ----------------------- -----------------------
  `id`                    integer, primary key,   Unique event identifier
                          auto increment          

  `title`                 varchar                 Event name

  `description`           text                    Event description

  `event_date`            date/datetime           Event date

  `event_time`            time                    Event start time

  `venue`                 varchar                 Location

  `category`              varchar(100)            Event category;
                                                  previously added

  `skills`                text, nullable          Comma-separated
                                                  skills/topics;
                                                  previously added

  `created_at`            timestamp               Record creation time
  -----------------------------------------------------------------------

The types above are a design reference. Inspect the actual schema before
making changes.

## 3. `user_event_interactions` table

Previously discussed schema:

``` sql
CREATE TABLE IF NOT EXISTS user_event_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    interaction_type ENUM('view', 'register', 'bookmark') NOT NULL,
    interaction_score DECIMAL(5,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_user_interaction (user_id, interaction_type)
);
```

Previously discussed interaction weights: - `view`: `0.20` - `bookmark`:
`0.50` - `register`: `1.00`

**Important:** This schema does not show a foreign key from `user_id` to
a users table. Add one only after confirming the user table and
migration strategy. In a production schema, registration records may
deserve a separate table instead of treating `register` as just an
interaction.

## 4. Planned `users` table

Real login/signup requires a users table. Proposed starting point, not
confirmed existing:

``` sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

Never store plaintext passwords. Store only hashes created by a suitable
password-hashing library such as bcrypt or Argon2.

## 5. Relationship overview

``` text
users (planned) 1 ---- many user_event_interactions many ---- 1 events
```

A dedicated `event_registrations` table is recommended if the product
needs registration status, timestamps, capacity limits, cancellation, or
confirmation numbers.

## 6. Data rules

-   Use parameterized queries.
-   Validate event IDs and user IDs on the server.
-   Derive authenticated user identity from verified session/token
    state.
-   Add indexes based on actual query patterns.
-   Use migrations or versioned SQL scripts for schema changes.
-   Back up the database before destructive changes.

## 7. Verification commands

In the MySQL client or phpMyAdmin, inspect:

``` sql
SHOW DATABASES;
USE eventsphere;
SHOW TABLES;
DESCRIBE events;
DESCRIBE user_event_interactions;
```

If a table does not exist, do not assume the previous schema was
applied.
