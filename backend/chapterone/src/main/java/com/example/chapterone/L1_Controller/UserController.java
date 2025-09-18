package com.example.chapterone.L1_Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.chapterone.L2_Service.User.UserService;
import com.example.chapterone.L4_Model.Entites.User;
import com.example.chapterone.L4_Model.Enums.Status;
import com.example.chapterone.L5_DTO.UserBarChartResponseDTO;
import com.example.chapterone.L5_DTO.UserDonutChartResponseDTO;
import com.example.chapterone.L5_DTO.UserLineChartResponseDTO;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@RestController
@CrossOrigin("*")
@RequestMapping(path = "/users")
@Slf4j
public class UserController {
    private final UserService userService;

    // ---------------- CREATE USER ----------------
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        try {
            log.info("User created: {}", user.getUsername());
            userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- UPDATE USER ----------------
    @PutMapping("/{idUser}")
    public ResponseEntity<String> updateUser(@RequestBody User user, @PathVariable String idUser) {
        try {
            log.info("User updated: {}", idUser);
            userService.updateUser(user, idUser);
            return ResponseEntity.ok("User updated successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- UPDATE USER STATUS ----------------
    @PatchMapping("/_status/{idUser}")
    public ResponseEntity<String> updateUserStatus(@RequestParam Status status, @PathVariable String idUser) {
        try {
            log.info("User status updated: {} -> {}", idUser, status);
            userService.updateUserStatus(idUser, status);
            return ResponseEntity.ok("User status updated successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- UPDATE USER STATUSES AND CATEGORIES ----------------
    @PutMapping("/updateUserStatusAndCategories")
    public ResponseEntity<String> updateUserStatusesAndCategories() {
        try {
            log.info("Processing expired memberships and updating user categories...");
            userService.updateUserStatusesAndCategories();
            return ResponseEntity.ok("Updating user categories and expired users deactivated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- GET USERS BY STATUS ----------------
    @GetMapping("/getUsersByStatus")
    public ResponseEntity<?> getUsersByStatus(@RequestParam Status status) {
        try {
            List<User> users = userService.getUsersByStatus(status);
            log.info("Retrieved {} users{}", users.size(), status != null ? " with status " + status : "");
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- GET USERS LINE CHART ----------------
    @GetMapping("/lineChart/{period}")
    public ResponseEntity<?> getUserLineChart(@PathVariable String period) {
        try {
            List<UserLineChartResponseDTO> chartData = userService.getUserLineChart(period);
            return ResponseEntity.ok(chartData);
        } catch (IllegalArgumentException e) {
            log.error("Invalid period format: {}", period, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error fetching line chart for period {}", period, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve line chart data.");
        }
    }

    // ---------------- GET USERS BAR CHART ----------------
    @GetMapping("/barChart/{period}")
    public ResponseEntity<?> getUserBarChart(@PathVariable String period) {
        try {
            List<UserBarChartResponseDTO> chartData = userService.getUserBarChart(period);
            return ResponseEntity.ok(chartData);
        } catch (IllegalArgumentException e) {
            log.error("Invalid period format: {}", period, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error fetching bar chart for period {}", period, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve bar chart data.");
        }
    }

    // ---------------- GET USERS DONUT CHART ----------------
    @GetMapping("/donutChart/{period}")
    public ResponseEntity<?> getUserDonutChart(@PathVariable String period) {
        try {
            List<UserDonutChartResponseDTO> chartData = userService.getUserDonutChart(period);
            return ResponseEntity.ok(chartData);
        } catch (IllegalArgumentException e) {
            log.error("Invalid period format: {}", period, e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error fetching donut chart for period {}", period, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve donut chart data.");
        }
    }

}