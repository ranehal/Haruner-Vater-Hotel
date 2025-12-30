# Hotel Management System

A full-stack Hotel Management System built with Spring Boot (Backend) and React + Vite (Frontend).

## Prerequisites
*   Java 17+
*   Node.js & npm
*   MySQL Server

## Setup Instructions

### 1. Database Setup
Ensure you have a MySQL server running. The application expects the following environment variables (or it will default to `localhost:3306`, user `root`, no password).

*   `MYSQL_HOST`
*   `MYSQL_PORT`
*   `MYSQL_DATABASE` (Default: `hotel_db`)
*   `MYSQL_USER` (Default: `root`)
*   `MYSQL_PASSWORD`

If running locally without environment variables, ensure a MySQL instance is listening on localhost:3306 and create a database named `hotel_db`.

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Run the application:
```bash
./mvnw spring-boot:run
```
(Or use `mvn spring-boot:run` if Maven is installed globally).

The backend will start on `http://localhost:8080`.
It will automatically seed the database with sample rooms if empty.

### 3. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Features
*   **Customer:**
    *   View Rooms (with images and prices)
    *   Book a Room (Calculates total cost)
    *   Order Services (Food, Transport, etc.)
*   **Manager (Admin):**
    *   View Recent Bookings
    *   View Service Requests & Status

## API Endpoints
*   `GET /api/rooms` - List all rooms
*   `POST /api/bookings` - Create a booking
*   `GET /api/bookings` - List bookings
*   `POST /api/services` - Create a service request
*   `GET /api/services` - List service requests
