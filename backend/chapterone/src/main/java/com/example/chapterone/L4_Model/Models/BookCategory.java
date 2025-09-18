package com.example.chapterone.L4_Model.Models;

import java.util.UUID;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class BookCategory {
    @Id
    private String idBookCategorie = UUID.randomUUID().toString();
    private String name;
    private String color;
    private int code;
    private int booksCount;
}