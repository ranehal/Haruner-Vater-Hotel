# Haruner Vater Hotel Management System

[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange)](https://www.mysql.com/)

A comprehensive full-stack Hotel Management System designed to streamline operations for both guests and administrative staff. This project features a robust Spring Boot backend and a modern, responsive React frontend.

## 🚀 Technologies Used

### Backend
- **Java 17**
- **Spring Boot 3.x**
  - Spring Data JPA (Hibernate)
  - Spring Web
  - Spring Security (JWT-ready)
- **MySQL** (Database)
- **Maven** (Build Tool)

### Frontend
- **React 18**
- **Vite** (Next-generation frontend tool)
- **Bootstrap / Custom CSS** (Styling)
- **Lucide React** (Icons)
- **React Router** (Navigation)

## ✨ Features

### 👤 Guest Experience
- **Interactive Room Catalog:** Browse through various room categories with high-quality images and detailed amenities.
- **Dynamic Booking System:** Real-time room availability and price calculation.
- **Service Requests:** Seamlessly order room service, transportation, or laundry.
- **Account Management:** Secure login and signup for tracking bookings and requests.
- **Reviews:** Share feedback on your stay and view others' experiences.

### 🛠️ Administrative & Management
- **Admin Dashboard:** High-level overview of hotel stats and system health.
- **Manager Dashboard:** Manage bookings, update room statuses, and handle service requests.
- **Maintenance Tracking:** Create and track maintenance tickets for room upkeep.
- **Coupon System:** Generate and manage discount codes for promotional offers.
- **Stats & Reporting:** Visualize key metrics like occupancy rates and revenue.

## 📂 Project Structure

```text
AOP/
├── backend/            # Spring Boot Application
│   ├── src/main/java/  # Java Source Code
│   ├── src/resources/  # Configuration & Static Assets
│   └── pom.xml         # Maven Dependencies
└── frontend/           # React + Vite Application
    ├── src/            # React Components & Context
    ├── index.html      # Entry Point
    └── package.json    # Node Dependencies
```

## 🛠️ Setup Instructions

### 1. Database Setup
Ensure you have a MySQL server running.
```sql
CREATE DATABASE hotel_db;
```
Configure environment variables if necessary (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`).

### 2. Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
The API will be available at `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Developed as part of the Haruner Vater Hotel Project.*