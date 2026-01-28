package com.hotel.controller;

import com.hotel.model.Bill;
import com.hotel.model.Booking;
import com.hotel.repository.BillRepository;
import com.hotel.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
public class BillController {

    private final BillRepository billRepository;
    private final BookingRepository bookingRepository;
    private final com.hotel.repository.ServiceRequestRepository serviceRequestRepository;

    public BillController(BillRepository billRepository, BookingRepository bookingRepository, com.hotel.repository.ServiceRequestRepository serviceRequestRepository) {
        this.billRepository = billRepository;
        this.bookingRepository = bookingRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    @GetMapping
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Bill> getBillByBooking(@PathVariable Long bookingId) {
        return billRepository.findByBookingId(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate/{bookingId}")
    public ResponseEntity<?> generateBill(@PathVariable Long bookingId) {
        return bookingRepository.findById(bookingId).map(booking -> {
            if (billRepository.findByBookingId(bookingId).isPresent()) {
                return ResponseEntity.badRequest().body("Bill already exists for this booking.");
            }
            
            // Calculate total service charges
            java.math.BigDecimal serviceCharges = java.math.BigDecimal.ZERO;
            List<com.hotel.model.ServiceRequest> services = serviceRequestRepository.findByRoomNumber(booking.getRoom().getRoomNumber());
            
            for (com.hotel.model.ServiceRequest s : services) {
                // Check if date is within booking range (or after checkin)
                java.time.LocalDate sDate = s.getRequestDate();
                if (sDate != null && !sDate.isBefore(booking.getCheckInDate()) && 
                   (booking.getCheckOutDate() == null || !sDate.isAfter(booking.getCheckOutDate()))) {
                    if (s.getCost() != null) {
                        serviceCharges = serviceCharges.add(s.getCost());
                    }
                }
            }

            java.math.BigDecimal totalAmount = booking.getTotalCost().add(serviceCharges);

            Bill bill = new Bill(booking, totalAmount, LocalDate.now(), LocalDate.now().plusDays(7));
            return ResponseEntity.ok(billRepository.save(bill));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Bill> markAsPaid(@PathVariable Long id, @RequestParam(defaultValue = "ONLINE") String method) {
        return billRepository.findById(id).map(bill -> {
            bill.setStatus("PAID");
            bill.setPaymentDate(LocalDate.now());
            bill.setPaymentMethod(method);
            return ResponseEntity.ok(billRepository.save(bill));
        }).orElse(ResponseEntity.notFound().build());
    }
}
