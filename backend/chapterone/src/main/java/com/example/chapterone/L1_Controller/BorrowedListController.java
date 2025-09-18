package com.example.chapterone.L1_Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.chapterone.L2_Service.BorrowedList.BorrowedListService;
import com.example.chapterone.L4_Model.Entites.BorrowedList;
import com.example.chapterone.L4_Model.Enums.BorrowStatus;
import com.example.chapterone.L5_DTO.AllBorrowedBooksResponseDTO;
import com.example.chapterone.L5_DTO.BorrowedBarChartResponseDTO;
import com.example.chapterone.L5_DTO.BorrowedDonutChartResponseDTO;
import com.example.chapterone.L5_DTO.BorrowedLineChartResponseDTO;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@RestController
@CrossOrigin("*")
@RequestMapping(path = "/borrowed")
@Slf4j
public class BorrowedListController {

    private final BorrowedListService borrowedListService;

    // ---------------- BORROW BOOK ----------------
    @PostMapping
    public ResponseEntity<String> borrowBook(@RequestBody BorrowedList borrow) {
        try {
            borrowedListService.borrowBook(borrow);
            log.info("Book {} borrowed by user {}", borrow.getIdBook(), borrow.getIdUser());
            return ResponseEntity.ok("Book borrowed successfully");
        } catch (NotFoundException e) {
            log.error("Borrow failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Borrow failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to borrow book");
        }
    }

    // ---------------- UPDATE BORROW ----------------
    @PutMapping("/update/{idBorrowedList}")
    public ResponseEntity<String> updateBorrowBook(
            @RequestBody BorrowedList borrow,
            @PathVariable String idBorrowedList) {
        try {
            borrowedListService.updateBorrowBook(borrow, idBorrowedList);
            log.info("Borrowed entry {} updated successfully", idBorrowedList);
            return ResponseEntity.ok("Borrowed entry updated successfully");
        } catch (NotFoundException e) {
            log.error("Update failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Update failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update borrowed entry");
        }
    }

    // ---------------- RETURN BOOK ----------------
    @PutMapping("/return/{idBorrow}")
    public ResponseEntity<String> returnBook(@PathVariable String idBorrow) {
        try {
            borrowedListService.returnBook(idBorrow);
            log.info("Book returned successfully for borrow id {}", idBorrow);
            return ResponseEntity.ok("Book returned successfully");
        } catch (NotFoundException e) {
            log.error("Return failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Return failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to return book");
        }
    }

    // ---------------- DEACTIVATE EXPIRED BOOKS ----------------
    @PutMapping("/deactivateExpired")
    public ResponseEntity<String> deactivateExpiredBooks() {
        try {
            borrowedListService.deactivateExpiredBooks();
            log.info("Expired borrowed books processed successfully");
            return ResponseEntity.ok("Expired borrowed books processed successfully");
        } catch (NotFoundException e) {
            log.error("Deactivation failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Deactivation failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to deactivate expired books");
        }
    }

    // ---------------- GET ALL BORROWED BOOKS BY STATUS ----------------
    @GetMapping("/getAllBorrowedBooks")
    public ResponseEntity<List<AllBorrowedBooksResponseDTO>> getAllBorrowedBooks(
            @RequestParam BorrowStatus status) {
        try {
            List<AllBorrowedBooksResponseDTO> result = borrowedListService.getAllBorrowedBooks(status);
            log.info("Retrieved {} borrowed books with status {}", result.size(), status);
            return ResponseEntity.ok(result);
        } catch (NotFoundException e) {
            log.error("No borrowed books found with status {}", status, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error retrieving borrowed books with status {}", status, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ---------------- GET BORROWED BAR CHART ----------------
    @GetMapping("/barChart/{period}")
    public ResponseEntity<List<BorrowedBarChartResponseDTO>> getBarChartBorrowedBooks(
            @PathVariable String period) {
        try {
            List<BorrowedBarChartResponseDTO> result = borrowedListService.getBarChartBorrowedBooks(period);
            log.info("Retrieved bar chart data for borrowed books for period '{}', {} entries", period, result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error retrieving bar chart data for period '{}'", period, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ---------------- GET BORROWED LINE CHART ----------------
    @GetMapping("/lineChart/{period}")
    public ResponseEntity<List<BorrowedLineChartResponseDTO>> getLineChartBorrowedBooks(
            @PathVariable String period) {
        try {
            List<BorrowedLineChartResponseDTO> result = borrowedListService.getLineChartBorrowedBooks(period);
            log.info("Retrieved line chart data for borrowed books for period '{}', {} entries", period, result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error retrieving line chart data for period '{}'", period, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ---------------- GET BORROWED DONUT CHART ----------------
    @GetMapping("/donutChart/{period}")
    public ResponseEntity<List<BorrowedDonutChartResponseDTO>> getDonutChartBorrowedBooks(
            @PathVariable String period) {
        try {
            List<BorrowedDonutChartResponseDTO> result = borrowedListService.getDonutChartBorrowedBooks(period);
            log.info("Retrieved donut chart data for borrowed books for period '{}', {} entries", period,
                    result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error retrieving donut chart data for period '{}'", period, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
