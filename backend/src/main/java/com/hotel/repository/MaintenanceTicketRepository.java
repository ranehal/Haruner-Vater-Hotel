package com.hotel.repository;

import com.hotel.model.MaintenanceTicket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceTicketRepository extends JpaRepository<MaintenanceTicket, Long> {
}
