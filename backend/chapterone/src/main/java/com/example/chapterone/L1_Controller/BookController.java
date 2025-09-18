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

import com.example.chapterone.L2_Service.Book.BookService;
import com.example.chapterone.L4_Model.Entites.Book;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@RestController
@CrossOrigin("*")
@RequestMapping(path = "/books")
@Slf4j
public class BookController {
    private final BookService bookService;

    // ---------------- ADD BOOK ----------------
    @PostMapping
    public ResponseEntity<String> addBook(@RequestBody Book book) {
        try {
            bookService.addBook(book);
            log.info("Book created successfully: {}", book.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Book created successfully: " + book.getTitle());
        } catch (IllegalArgumentException e) {
            log.warn("Failed to create Book: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NotFoundException e) {
            log.warn("Failed to create Book: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while creating Book", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    // ---------------- UPDATE BOOK ----------------
    @PutMapping("/{idBook}")
    public ResponseEntity<String> updateBook(@RequestBody Book book, @PathVariable String idBook) {
        try {
            bookService.updateBook(book, idBook);
            log.info("Book updated successfully: {}", idBook);
            return ResponseEntity.ok("Book updated successfully");
        } catch (NotFoundException e) {
            log.warn("Book not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid input while updating book: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while updating book", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    // ---------------- GET ALL AVAILABLE BOOKS ----------------
    @GetMapping("/available")
    public ResponseEntity<List<Book>> getAllAvailableBooks() {
        try {
            List<Book> books = bookService.getAvailableBooks();
            log.info("Retrieved {} available books", books.size());
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            log.error("Error retrieving available books", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ---------------- GET BOOK LINE CHART ----------------
    @GetMapping("/lineChart/{period}")
    public ResponseEntity<?> generateBookLineChart(@PathVariable String period) {
        try {
            return ResponseEntity.ok(bookService.generateBookLineChart(period));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid period for line chart: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error generating line chart", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    // ---------------- GET BOOK BAR CHART ----------------
    @GetMapping("/barChart/{period}")
    public ResponseEntity<?> generateBookBarChart(@PathVariable String period) {
        try {
            return ResponseEntity.ok(bookService.generateBookBarChart(period));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid period for bar chart: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error generating bar chart", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    // ---------------- GET BOOK DONUT CHART ----------------
    @GetMapping("/donutChart/{period}")
    public ResponseEntity<?> generateBookDonutChart(@PathVariable String period) {
        try {
            return ResponseEntity.ok(bookService.generateBookDonutChart(period));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid period for donut chart: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error generating donut chart", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }
}
