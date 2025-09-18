package com.example.chapterone.L4_Model.Entites;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.chapterone.L4_Model.Enums.BookStatus;
import com.example.chapterone.L4_Model.Enums.Language;
import com.example.chapterone.L4_Model.Models.BookCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "books")

public class Book {
    @Id
    private String idBook = UUID.randomUUID().toString();
    private String title;
    private String description;
    private String isbn;
    private LocalDate publicationDate;
    private String publisher;
    private LocalDate createdAt;
    private Language language;
    private String location;
    private int pages;
    private int timesBorrowed;
    private Author primaryAuthor;
    private Author coAuthor;
    private BookStatus status;
    private BookCategory category;
}
