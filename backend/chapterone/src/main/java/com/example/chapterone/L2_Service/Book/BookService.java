package com.example.chapterone.L2_Service.Book;

import java.util.List;

import com.example.chapterone.L4_Model.Entites.Book;
import com.example.chapterone.L5_DTO.BookBarChartResponseDTO;
import com.example.chapterone.L5_DTO.BookDonutChartResponseDTO;
import com.example.chapterone.L5_DTO.BookLineChartResponseDTO;
import com.example.chapterone.L6_Exception.NotFoundException;

public interface BookService {

    void addBook(Book book) throws NotFoundException;

    void updateBook(Book book, String idBook) throws NotFoundException;

    List<Book> getAvailableBooks();

    List<BookLineChartResponseDTO> generateBookLineChart(String period);

    List<BookBarChartResponseDTO> generateBookBarChart(String period);

    List<BookDonutChartResponseDTO> generateBookDonutChart(String period);
}
