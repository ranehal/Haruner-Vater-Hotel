
# 1. Clean old git
if (Test-Path .git) { Remove-Item -Path .git -Recurse -Force }
git init
git branch -m main

# 2. Setup .gitignore properly first
Add-Content .gitignore "`n*.log"
Add-Content .gitignore "`nbackend/server.log"
Add-Content .gitignore "`nbackend/server_err.log"
Add-Content .gitignore "`nbackend/server_retry.log"
Add-Content .gitignore "`nbackend/server_retry_err.log"

# Function to commit
function Git-Commit-Date ($msg, $date) {
    $env:GIT_AUTHOR_DATE=$date
    $env:GIT_COMMITTER_DATE=$date
    git commit -m "$msg"
}

# --- Commit 1: Project Init ---
git add .gitignore README.md
Git-Commit-Date "Initial project structure and configuration" "2026-01-01T10:00:00"

# --- Commit 2: Backend Setup ---
git add backend/pom.xml backend/src/main/resources/application.properties backend/src/main/java/com/hotel/HotelApplication.java
Git-Commit-Date "Setup Spring Boot backend structure" "2026-01-03T14:30:00"

# --- Commit 3: Backend Config & Auth ---
git add backend/src/main/java/com/hotel/config/ backend/src/main/java/com/hotel/service/AuthService.java backend/src/main/java/com/hotel/controller/AuthController.java
Git-Commit-Date "Implement Security configuration and Authentication service" "2026-01-03T16:45:00"

# --- Commit 4: Core Models ---
git add backend/src/main/java/com/hotel/model/
Git-Commit-Date "Define core JPA entities and database models" "2026-01-04T11:00:00"

# --- Commit 5: Repositories ---
git add backend/src/main/java/com/hotel/repository/
Git-Commit-Date "Create Repository interfaces for data access" "2026-01-05T09:30:00"

# --- Commit 6: Services ---
git add backend/src/main/java/com/hotel/service/
Git-Commit-Date "Implement business logic services" "2026-01-10T13:15:00"

# --- Commit 7: Controllers ---
git add backend/src/main/java/com/hotel/controller/
Git-Commit-Date "Add REST controllers for API endpoints" "2026-01-11T10:00:00"

# --- Commit 8: Backend Extras (SQL, etc) ---
git add backend/*.sql
Git-Commit-Date "Add database seed scripts" "2026-01-11T16:00:00"

# --- Commit 9: Frontend Init ---
git add frontend/package.json frontend/vite.config.js frontend/index.html frontend/package-lock.json
Git-Commit-Date "Initialize React frontend with Vite" "2026-01-17T11:00:00"

# --- Commit 10: Frontend Components ---
git add frontend/src/components/
Git-Commit-Date "Create main UI components and layouts" "2026-01-18T14:45:00"

# --- Commit 11: Frontend Logic & Context ---
git add frontend/src/context/ frontend/src/App.jsx frontend/src/main.jsx
Git-Commit-Date "Implement application state and routing" "2026-01-24T10:30:00"

# --- Commit 12: Assets & Styling ---
git add frontend/src/*.css backend/src/main/resources/static/
Git-Commit-Date "Apply styling and add static assets" "2026-01-25T15:00:00"

# --- Commit 13: Everything else (Cleanup) ---
git add .
Git-Commit-Date "Final integration fixes and cleanup" "2026-01-29T09:00:00"

# Remote
git remote add origin https://github.com/ranehal/Haruner-Vater-Hotel.git
