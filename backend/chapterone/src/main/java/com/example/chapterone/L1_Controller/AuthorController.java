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

import com.example.chapterone.L2_Service.Author.AuthorService;
import com.example.chapterone.L4_Model.Entites.Author;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@RestController
@CrossOrigin("*")
@RequestMapping(path = "/authors")
@Slf4j
public class AuthorController {
    private final AuthorService authorService;

    // ---------------- CREATE AUTHOR ----------------
    @PostMapping
    public ResponseEntity<String> createAuthor(@RequestBody Author author) {
        try {
            authorService.createAuthor(author);
            log.info("Author created successfully: {}", author.getName());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Author created successfully: " + author.getName());
        } catch (IllegalArgumentException e) {
            log.warn("Failed to create author: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while creating author", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    // ---------------- UPDATE AUTHOR ----------------
    @PutMapping("/{idAuthor}")
    public ResponseEntity<String> updateAuthor(@RequestBody Author author, @PathVariable String idAuthor) {
        try {
            log.info("Author updated: {}", idAuthor);
            authorService.updateAuthor(author, idAuthor);
            return ResponseEntity.ok("Author updated successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- DELETE AUTHOR ----------------
    @DeleteMapping("/{idAuthor}")
    public ResponseEntity<String> deleteAuthor(@PathVariable String idAuthor) {
        try {
            log.info("Author deleted: {}", idAuthor);
            authorService.deleteAuthor(idAuthor);
            return ResponseEntity.ok("Author deleted successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // ---------------- GET ALL AUTHOR ----------------
    @GetMapping("/getAllAuthors")
    public ResponseEntity<?> getAllAuthors() {
        try {
            List<Author> authors = authorService.getAllAuthors();
            log.info("Retrieved {} authors", authors.size());
            return ResponseEntity.ok(authors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
