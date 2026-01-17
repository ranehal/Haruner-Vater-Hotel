package com.hotel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // FOOD, TRANSPORT, CLEANING, TRIP
    private String description;
    private BigDecimal cost;
    private String status; // PENDING, COMPLETED, CANCELLED
    private java.time.LocalDate requestDate;
    
    // Optional: link to a booking or room if needed, simple string for now
    private String roomNumber;

    public ServiceRequest() {}

    public ServiceRequest(String type, String description, BigDecimal cost, String status, String roomNumber) {
        this.type = type;
        this.description = description;
        this.cost = cost;
        this.status = status;
        this.roomNumber = roomNumber;
        this.requestDate = java.time.LocalDate.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public java.time.LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(java.time.LocalDate requestDate) { this.requestDate = requestDate; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
}
