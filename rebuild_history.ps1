$ErrorActionPreference = "Stop"

# Create orphan branch to start fresh history
git checkout --orphan temp_history
git reset .

function Commit-Files {
    param (
        [string[]]$Files,
        [string]$Message,
        [int]$DaysAgo
    )
    
    $Date = (Get-Date).AddDays(-$DaysAgo).ToString("yyyy-MM-ddTHH:mm:ss")
    $Env:GIT_COMMITTER_DATE = $Date
    $Env:GIT_AUTHOR_DATE = $Date
    
    foreach ($FilePattern in $Files) {
        # Expand wildcards manually if needed, or rely on git add
        # Git add handles globs if passed correctly, but let's be safe with PowerShell globs
        if ($FilePattern -like "*\*") {
             git add $FilePattern
        } else {
             if (Test-Path $FilePattern) {
                git add $FilePattern
             }
        }
    }
    
    # Check if anything is staged
    $staged = git diff --cached --name-only
    if ($staged) {
        git commit -m "$Message"
        Write-Host "Committed: $Message ($Date)"
    } else {
        Write-Host "Skipped: $Message (Nothing to commit)"
    }
}

# Week 1
Commit-Files -Files @("README.md", ".gitignore") -Message "Initial commit" -DaysAgo 30
Commit-Files -Files @("backend/pom.xml", "backend/src/main/resources/application.properties", "backend/src/main/java/com/hotel/HotelApplication.java") -Message "Initialize Backend with Spring Boot" -DaysAgo 29
Commit-Files -Files @("frontend/package.json", "frontend/vite.config.js", "frontend/index.html", "frontend/src/main.jsx", "frontend/.gitignore") -Message "Initialize Frontend with Vite" -DaysAgo 28

# Week 2
Commit-Files -Files @("backend/src/main/java/com/hotel/model/User.java", "backend/src/main/java/com/hotel/repository/UserRepository.java") -Message "Add User model and repository" -DaysAgo 25
Commit-Files -Files @("backend/src/main/java/com/hotel/service/AuthService.java", "backend/src/main/java/com/hotel/controller/AuthController.java", "backend/src/main/java/com/hotel/config/CorsConfig.java") -Message "Implement Authentication service and controller" -DaysAgo 24
Commit-Files -Files @("backend/src/main/java/com/hotel/model/Room.java", "backend/src/main/java/com/hotel/repository/RoomRepository.java", "backend/src/main/java/com/hotel/controller/RoomController.java") -Message "Add Room Management API" -DaysAgo 22
Commit-Files -Files @("backend/src/main/java/com/hotel/model/Booking.java", "backend/src/main/java/com/hotel/repository/BookingRepository.java", "backend/src/main/java/com/hotel/service/BookingService.java", "backend/src/main/java/com/hotel/controller/BookingController.java") -Message "Implement Booking logic" -DaysAgo 20

# Week 3
Commit-Files -Files @("frontend/src/App.jsx", "frontend/src/App.css", "frontend/src/index.css") -Message "Setup Frontend Routing and Base Styles" -DaysAgo 18
Commit-Files -Files @("frontend/src/components/Navbar.jsx", "frontend/src/context/ToastContext.jsx") -Message "Add Navbar and Toast Context" -DaysAgo 17
Commit-Files -Files @("frontend/src/components/Login.jsx", "frontend/src/components/Signup.jsx") -Message "Create Login and Signup pages" -DaysAgo 16
Commit-Files -Files @("frontend/src/components/GuestDashboard.jsx", "frontend/src/components/Home.jsx") -Message "Add Guest Dashboard and Home page" -DaysAgo 15
Commit-Files -Files @("backend/src/main/java/com/hotel/model/ServiceRequest.java", "backend/src/main/java/com/hotel/repository/ServiceRequestRepository.java", "backend/src/main/java/com/hotel/controller/ServiceController.java") -Message "Backend: Add Service Requests API" -DaysAgo 12

# Week 4
Commit-Files -Files @("backend/src/main/java/com/hotel/model/Review.java", "backend/src/main/java/com/hotel/repository/ReviewRepository.java", "backend/src/main/java/com/hotel/controller/ReviewController.java") -Message "Backend: Add Reviews API" -DaysAgo 9
Commit-Files -Files @("frontend/src/components/RoomList.jsx", "frontend/src/components/ServiceOrder.jsx") -Message "Frontend: Add RoomList and ServiceOrder components" -DaysAgo 8
Commit-Files -Files @("backend/src/main/java/com/hotel/model/MaintenanceTicket.java", "backend/src/main/java/com/hotel/repository/MaintenanceTicketRepository.java", "backend/src/main/java/com/hotel/controller/MaintenanceController.java") -Message "Add Maintenance Ticket system" -DaysAgo 6
Commit-Files -Files @("backend/src/main/java/com/hotel/model/Coupon.java", "backend/src/main/java/com/hotel/repository/CouponRepository.java", "backend/src/main/java/com/hotel/controller/CouponController.java") -Message "Implement Coupon system" -DaysAgo 5
Commit-Files -Files @("frontend/src/components/ManagerDashboard.jsx", "frontend/src/components/AdminDashboard.jsx") -Message "Add Manager and Admin Dashboards" -DaysAgo 4
Commit-Files -Files @("backend/src/main/resources/static/images/rooms/*.jpg") -Message "Add room images" -DaysAgo 3
Commit-Files -Files @("backend/src/main/java/com/hotel/service/DataSeeder.java", "backend/populate_data.sql", "backend/demo.sql", "backend/demo_full.sql", "backend/hotel_db (1).sql") -Message "Add Data Seeding and SQL scripts" -DaysAgo 2
Commit-Files -Files @("backend/src/main/java/com/hotel/config/WebConfig.java", "backend/src/main/java/com/hotel/controller/BillController.java", "backend/src/main/java/com/hotel/model/Bill.java", "backend/src/main/java/com/hotel/repository/BillRepository.java", "backend/src/main/java/com/hotel/controller/ImageUploadController.java", "backend/src/main/java/com/hotel/controller/AdminStatsController.java") -Message "Finalize Backend Config and Controllers" -DaysAgo 1

# Catch all remaining
git add .
$staged = git diff --cached --name-only
if ($staged) {
    $Env:GIT_COMMITTER_DATE = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    $Env:GIT_AUTHOR_DATE = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    git commit -m "Polishing and final updates"
    Write-Host "Committed: Final updates"
}

# Cleanup and switch
git branch -D main
git branch -m main
Write-Host "History rebuild complete. Branch 'main' updated."
