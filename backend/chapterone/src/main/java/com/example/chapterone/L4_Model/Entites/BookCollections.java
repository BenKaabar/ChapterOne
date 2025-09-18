package com.example.chapterone.L4_Model.Entites;

import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "bookCollections")

public class BookCollections {
    @Id
    private String idBookCollections = UUID.randomUUID().toString();
    private String name;
    private int bookCount;
    private List<String> idBooks;
}