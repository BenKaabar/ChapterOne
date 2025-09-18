package com.example.chapterone.L1_Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.chapterone.L2_Service.BookCollections.BookCollectionsService;
import com.example.chapterone.L4_Model.Entites.BookCollections;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@RestController
@CrossOrigin("*")
@RequestMapping(path = "/bookCollections")
@Slf4j
public class BookCollectionsController {
    private final BookCollectionsService bookCollectionsService;

    // ---------------- CREATE BOOK COLLECTION ----------------
    @PostMapping
    public ResponseEntity<String> createBookCollection(@RequestBody BookCollections bookCollection) {
        try {
            bookCollectionsService.createBookCollection(bookCollection);
            log.info("BookCollection created successfully: {}", bookCollection.getName());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("BookCollection created successfully: " + bookCollection.getName());
        } catch (IllegalArgumentException e) {
            log.warn("Failed to create BookCollection: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while creating BookCollection", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    // ---------------- UPDATE BOOK COLLECTION ----------------
    @PutMapping("/{idBookCollection}")
    public ResponseEntity<String> updateBookCollection(@RequestBody BookCollections bookCollection, @PathVariable String idBookCollection) {
        try {
            log.info("BookCollection updated: {}", idBookCollection);
            bookCollectionsService.updateBookCollection(bookCollection, idBookCollection);
            return ResponseEntity.ok("BookCollection updated successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- DELETE BOOK COLLECTION ----------------
    @DeleteMapping("/{idBookCollection}")
    public ResponseEntity<String> deleteBookCollection(@PathVariable String idBookCollection) {
        try {
            log.info("BookCollection deleted: {}", idBookCollection);
            bookCollectionsService.deleteBookCollection(idBookCollection);
            return ResponseEntity.ok("BookCollection deleted successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- GET ALL BOOK COLLECTION ----------------
    @GetMapping
    public ResponseEntity<?> getAllBookCollections() {
        try {
            List<BookCollections> BookCollections = bookCollectionsService.getAllBookCollections();
            log.info("Retrieved {} BookCollections", BookCollections.size());
            return ResponseEntity.ok(BookCollections);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
