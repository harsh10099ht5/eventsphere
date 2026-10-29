# EventSphere --- Local Setup and Audit

## 1. Known local path

Previously used project path:

``` text
C:\Users\Harshit Tripathi\Documents\EventSync\eventsphere
```

The last audit showed: - `frontend/src/App.jsx`, `app.css`, and
`main.jsx` exist. - `frontend/package.json` exists. - `backend/.env` and
`backend/node_modules` exist. - `python-ai/venv` exists. -
`backend/server.js`, `backend/db.js`, `python-ai/app.py`, and
`python-ai/model.py` were not visible in the expected folders during
that audit. - A nested `eventsphere/` directory contains `.gitignore`,
`LICENSE`, and `README.md`.

The audit may be incomplete if files are open from another project
location. Verify paths before restoring anything.

## 2. Inspect project files (PowerShell)

``` powershell
cd "C:\Users\Harshit Tripathi\Documents\EventSync\eventsphere"

Get-ChildItem -Force
Get-ChildItem .\backend -Force
Get-ChildItem .\frontend -Force
Get-ChildItem .\frontend\src -Force
Get-ChildItem .\python-ai -Force

Get-ChildItem . -Recurse -File -Include server.js,db.js,app.py,model.py,package.json |
  Where-Object { $_.FullName -notmatch '\\node_modules\\|\\venv\\' } |
  Select-Object -ExpandProperty FullName
```

## 3. Frontend startup

``` powershell
cd "C:\Users\Harshit Tripathi\Documents\EventSync\eventsphere\frontend"
npm install
npm run dev
```

Use the URL printed by Vite. The previously used URL was
`http://localhost:5173`.

## 4. MySQL

1.  Open XAMPP if it is installed and used by this project.
2.  Start MySQL.
3.  Open phpMyAdmin or a MySQL client.
4.  Check the database and schema:

``` sql
SHOW DATABASES;
USE eventsphere;
SHOW TABLES;
DESCRIBE events;
```

Only inspect `user_event_interactions` if the table exists.

## 5. Backend and ML startup

Do not run commands against missing files. First locate or restore the
correct entry points and check the relevant `package.json` and Python
dependency file.

Previously documented service addresses: - Node API:
`http://localhost:5000` - Python ML service: `http://localhost:5001`

## 6. Environment variables

-   Keep database credentials and secrets in `.env`.
-   Do not paste secrets into chat or commit them.
-   Verify `.gitignore` excludes `.env`, `node_modules`, and Python
    virtual environments.
-   Share only redacted configuration when troubleshooting.

## 7. Baseline checks

-   Frontend opens without a compile error.
-   API health endpoint responds, if backend exists.
-   Database connection succeeds.
-   Events can be fetched.
-   ML health endpoint responds, if ML source exists.
-   No secrets are printed in logs.
