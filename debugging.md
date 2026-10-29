# EventSphere --- Debugging Guide

## 1. First rule: identify the failing layer

Check in this order: 1. Is the correct project folder open? 2. Does the
expected source file exist? 3. Does the service start? 4. Is the
expected port available? 5. Does the API respond? 6. Does the database
connection work? 7. Does the frontend call the correct URL? 8. Does the
browser console show a JavaScript error?

Do not replace large files before finding the cause.

## 2. Confirm project root

In PowerShell:

``` powershell
cd "C:\Users\Harshit Tripathi\Documents\EventSync\eventsphere"
Get-Location
Get-ChildItem -Force
```

## 3. Locate missing source files

``` powershell
Get-ChildItem . -Recurse -File -Include server.js,db.js,app.py,model.py,package.json |
  Where-Object { $_.FullName -notmatch '\\node_modules\\|\\venv\\' } |
  Select-Object -ExpandProperty FullName
```

The last audit did not show `backend/server.js`, `backend/db.js`,
`python-ai/app.py`, or `python-ai/model.py` in their expected folders.
They may exist elsewhere or need restoration. Do not create replacements
until the actual files and Git history have been checked.

## 4. Frontend fails to start

``` powershell
cd "C:\Users\Harshit Tripathi\Documents\EventSync\eventsphere\frontend"
npm install
npm run dev
```

-   Read the first error, not just the final stack trace.
-   Check that `package.json` is in the current directory.
-   Avoid deleting `node_modules` or lock files unless a specific
    diagnosis calls for it.
-   Use the URL printed by Vite.

## 5. Port already in use

Check a port, for example 5000:

``` powershell
netstat -ano | findstr :5000
```

Identify the process before stopping it. Do not terminate unrelated
processes blindly.

## 6. API route not found

-   Confirm the request method and exact path.
-   Confirm the correct Node process is running.
-   Stop only the known EventSphere backend process and restart it from
    the correct folder.
-   Confirm the route exists in the source file actually being executed.
-   Check whether another old process is listening on the same port.

## 7. MySQL connection errors

-   Confirm MySQL is running in XAMPP, if that is the configured
    environment.
-   Verify host, port, database name, username, and password in the
    local environment configuration.
-   Never share `.env` contents publicly.
-   Confirm the database and tables exist.
-   Check terminal logs for the underlying error without exposing
    secrets.

## 8. Recommendation service errors

-   Confirm the Python source files and virtual environment exist.
-   Activate the environment only from the expected project folder.
-   Install dependencies from the project's dependency file if one
    exists.
-   Check the ML health endpoint, if implemented.
-   Confirm the Node API is configured for the correct ML URL.
-   Test the Python service independently before debugging the frontend.

## 9. CORS or network error

-   Verify the frontend origin exactly, including scheme and port.
-   Confirm the backend CORS configuration matches that origin.
-   Check the browser Network tab for the actual URL and response.
-   Distinguish a CORS error from a service-not-running or HTTP error.

## 10. Git safety

Before edits:

``` powershell
git status
git branch --show-current
git remote -v
```

Inspect nested repositories and `git diff` before committing. Never
commit `.env`, credentials, `node_modules`, or Python virtual
environments.

## 11. What to share when asking for help

Share: - The exact command you ran. - The complete error message. - The
current working directory. - The relevant file path. - A redacted
environment/configuration summary. - The output of `git status` when
changes or repository structure are involved.

Do not share passwords, tokens, or full secret-bearing `.env` files.
