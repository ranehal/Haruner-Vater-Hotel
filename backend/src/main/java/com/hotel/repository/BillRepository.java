package com.hotel.repository;

import com.hotel.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByBookingId(Long bookingId);
    List<Bill> findByStatus(String status);
}
