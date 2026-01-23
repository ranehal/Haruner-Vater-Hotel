package com.hotel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class MaintenanceTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;
    private String issueDescription;
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private String status; // OPEN, IN_PROGRESS, RESOLVED
    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;

    public MaintenanceTicket() {
        this.reportedAt = LocalDateTime.now();
        this.status = "OPEN";
    }

    public MaintenanceTicket(String roomNumber, String issueDescription, String priority) {
        this.roomNumber = roomNumber;
        this.issueDescription = issueDescription;
        this.priority = priority;
        this.reportedAt = LocalDateTime.now();
        this.status = "OPEN";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
