package com.hotel.controller;

import com.hotel.model.Coupon;
import com.hotel.repository.CouponRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class CouponController {

    private final CouponRepository couponRepository;

    public CouponController(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validateCoupon(@PathVariable String code) {
        Optional<Coupon> couponOpt = couponRepository.findByCode(code.toUpperCase());

        if (couponOpt.isPresent()) {
            Coupon coupon = couponOpt.get();
            if (coupon.isActive() && (coupon.getExpiryDate() == null || coupon.getExpiryDate().isAfter(LocalDate.now()))) {
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "discountPercentage", coupon.getDiscountPercentage(),
                    "message", "Coupon applied successfully!"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Coupon is expired or inactive."
                ));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "message", "Invalid coupon code."
            ));
        }
    }
}
