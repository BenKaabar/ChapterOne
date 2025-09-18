package com.example.chapterone.L2_Service.Author;

import java.util.List;

import com.example.chapterone.L4_Model.Entites.Author;
import com.example.chapterone.L6_Exception.NotFoundException;

public interface AuthorService {
    void createAuthor(Author author);

    void updateAuthor(Author author, String idAuthor) throws NotFoundException;

    void deleteAuthor(String idAuthor) throws NotFoundException;

    List<Author> getAllAuthors();

}
