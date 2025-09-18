package com.example.chapterone.L5_DTO;

import java.time.LocalDate;

import com.example.chapterone.L4_Model.Entites.Book;
import com.example.chapterone.L4_Model.Entites.User;
import com.example.chapterone.L4_Model.Enums.BorrowStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllBorrowedBooksResponseDTO {
    private Book book;
    private User user;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private BorrowStatus status;
}
