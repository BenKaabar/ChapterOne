package com.example.chapterone.L4_Model.Entites;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.chapterone.L4_Model.Enums.BorrowStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "borrowed")
public class BorrowedList {
    @Id
    private String idBorrow = UUID.randomUUID().toString();
    private String idUser;
    private String idBook;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private BorrowStatus status;
}