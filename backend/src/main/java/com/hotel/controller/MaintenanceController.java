package com.hotel.controller;

import com.hotel.model.MaintenanceTicket;
import com.hotel.repository.MaintenanceTicketRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:5173")
public class MaintenanceController {

    private final MaintenanceTicketRepository repository;

    public MaintenanceController(MaintenanceTicketRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<MaintenanceTicket> getAllTickets() {
        return repository.findAll();
    }

    @PostMapping
    public MaintenanceTicket createTicket(@RequestBody MaintenanceTicket ticket) {
        ticket.setReportedAt(LocalDateTime.now());
        ticket.setStatus("OPEN");
        return repository.save(ticket);
    }

    @PutMapping("/{id}/resolve")
    public MaintenanceTicket resolveTicket(@PathVariable Long id) {
        MaintenanceTicket ticket = repository.findById(id).orElseThrow();
        ticket.setStatus("RESOLVED");
        ticket.setResolvedAt(LocalDateTime.now());
        return repository.save(ticket);
    }
}
