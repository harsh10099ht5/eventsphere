# EventSphere --- Authentication Design

**Status:** Requirements and design proposal. Real authentication is not
confirmed implemented.

## 1. Goal

Allow students to create accounts and sign in securely so that
bookmarks, interaction history, and future registrations can be
associated with the correct user.

## 2. UI fields

### Signup

-   Full name.
-   Email.
-   Password.
-   Confirm password.

### Login

-   Email.
-   Password.

The previously prepared frontend modal supports switching modes and
basic client-side validation. It must not display success until a
backend response confirms the operation.

## 3. Suggested endpoints

  Method   Endpoint             Purpose
  -------- -------------------- -----------------------------------
  POST     `/api/auth/signup`   Create an account
  POST     `/api/auth/login`    Authenticate credentials
  POST     `/api/auth/logout`   End the session, if session-based
  GET      `/api/auth/me`       Return current authenticated user

These endpoints are proposed and must be implemented and tested.

## 4. Database

Suggested `users` table:

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

Apply only after checking the existing schema and migration plan.

## 5. Password and session security

-   Hash passwords using bcrypt or Argon2.
-   Never store or log plaintext passwords.
-   Never return password hashes.
-   Use parameterized SQL.
-   Validate inputs on the server.
-   Use rate limiting for login/signup.
-   Use HTTPS in production.
-   If using cookie sessions, set appropriate `HttpOnly`, `Secure`, and
    `SameSite` attributes and implement CSRF protection as appropriate.
-   If using tokens, define expiry, storage, rotation, and revocation
    behavior carefully.
-   Use generic login failure messages to reduce account enumeration.
-   Do not store sensitive authentication tokens in local storage by
    default.

## 6. Authorization

-   Protected routes must identify users from verified authentication
    state.
-   Do not trust a browser-supplied `user_id`.
-   Users must not read/delete another user's interactions.
-   Admin-only operations must be checked on the server.

## 7. Acceptance criteria

-   Signup validates fields and rejects duplicate email addresses.
-   Passwords are stored only as hashes.
-   Correct credentials authenticate successfully.
-   Incorrect credentials fail safely.
-   Logout invalidates the session/token as designed.
-   Protected endpoints reject unauthenticated requests.
-   One user cannot access another user's private history.
