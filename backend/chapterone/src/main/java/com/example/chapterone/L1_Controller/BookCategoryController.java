package com.example.chapterone.L1_Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.chapterone.L2_Service.BookCategory.BookCategoryService;
import com.example.chapterone.L4_Model.Models.BookCategory;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@RestController
@CrossOrigin("*")
@RequestMapping(path = "/bookCategory")
@Slf4j

public class BookCategoryController {
    private final BookCategoryService bookCategoryService;

    // ---------------- CREATE BOOKCATEGORY ----------------
    @PostMapping
    public ResponseEntity<String> createbookCategory(@RequestBody BookCategory bookCategory) {
        try {
            bookCategoryService.createCategory(bookCategory);
            log.info("bookCategory created successfully: {}", bookCategory.getName());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("bookCategory created successfully: " + bookCategory.getName());
        } catch (IllegalArgumentException e) {
            log.warn("Failed to create bookCategory: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while creating bookCategory", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    // ---------------- UPDATE BOOKCATEGORY ----------------
    @PutMapping("/{idBookCategory}")
    public ResponseEntity<String> updatebookCategory(@RequestBody BookCategory bookCategory,
            @PathVariable String idBookCategory) {
        try {
            log.info("bookCategory updated: {}", idBookCategory);
            bookCategoryService.updateCategory(bookCategory, idBookCategory);
            return ResponseEntity.ok("bookCategory updated successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- GET ALL BOOKCATEGORY ----------------
    @GetMapping
    public ResponseEntity<?> getAllbookCategorys() {
        try {
            List<BookCategory> bookCategorys = bookCategoryService.getAllBookCategories();
            log.info("Retrieved {} bookCategorys", bookCategorys.size());
            return ResponseEntity.ok(bookCategorys);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
