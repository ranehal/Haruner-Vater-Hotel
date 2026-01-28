package com.hotel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageUploadController {

    private final Path rootLocation = Paths.get("uploads");

    @PostMapping("/room-image")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Empty file"));
        }

        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }

            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            // Sanitize and ensure unique name if needed, for now using original
            // A timestamp prefix is a good practice to avoid collisions
            String uniqueFilename = System.currentTimeMillis() + "_" + filename;
            
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, this.rootLocation.resolve(uniqueFilename), StandardCopyOption.REPLACE_EXISTING);
            }

            // Return the accessible URL
            String fileUrl = "/images/uploads/" + uniqueFilename;
            return ResponseEntity.ok(Collections.singletonMap("url", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("error", "Failed to upload file: " + e.getMessage()));
        }
    }
}
