package com.example.chapterone.L2_Service.BorrowedList;

import java.util.List;

import com.example.chapterone.L4_Model.Entites.BorrowedList;
import com.example.chapterone.L4_Model.Enums.BorrowStatus;
import com.example.chapterone.L5_DTO.AllBorrowedBooksResponseDTO;
import com.example.chapterone.L5_DTO.BorrowedBarChartResponseDTO;
import com.example.chapterone.L5_DTO.BorrowedDonutChartResponseDTO;
import com.example.chapterone.L5_DTO.BorrowedLineChartResponseDTO;
import com.example.chapterone.L6_Exception.NotFoundException;

public interface BorrowedListService {
    void borrowBook(BorrowedList borrow) throws NotFoundException;

    void updateBorrowBook(BorrowedList borrow, String idBorrowedList) throws NotFoundException;

    void returnBook(String idBorrow) throws NotFoundException;

    void deactivateExpiredBooks() throws NotFoundException;

    List<AllBorrowedBooksResponseDTO> getAllBorrowedBooks(BorrowStatus status) throws NotFoundException;

    List<BorrowedBarChartResponseDTO> getBarChartBorrowedBooks(String period);

    List<BorrowedLineChartResponseDTO> getLineChartBorrowedBooks(String period);

    List<BorrowedDonutChartResponseDTO> getDonutChartBorrowedBooks(String period);

}
