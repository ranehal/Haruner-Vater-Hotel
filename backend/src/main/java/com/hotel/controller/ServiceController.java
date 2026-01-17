package com.hotel.controller;

import com.hotel.model.ServiceRequest;
import com.hotel.repository.ServiceRequestRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    private final ServiceRequestRepository repository;

    public ServiceController(ServiceRequestRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ServiceRequest createRequest(@RequestBody ServiceRequest request) {
        request.setStatus("PENDING");
        request.setRequestDate(java.time.LocalDate.now());
        return repository.save(request);
    }
    
    @GetMapping
    public List<ServiceRequest> getAllRequests() {
        return repository.findAll();
    }

    @PutMapping("/{id}/complete")
    public ServiceRequest completeRequest(@PathVariable Long id) {
        return repository.findById(id).map(request -> {
            request.setStatus("COMPLETED");
            return repository.save(request);
        }).orElseThrow(() -> new RuntimeException("Service request not found"));
    }
}
