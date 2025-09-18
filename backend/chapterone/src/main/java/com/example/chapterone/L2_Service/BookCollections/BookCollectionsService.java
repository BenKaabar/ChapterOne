package com.example.chapterone.L2_Service.BookCollections;

import java.util.List;

import com.example.chapterone.L4_Model.Entites.BookCollections;
import com.example.chapterone.L6_Exception.NotFoundException;

public interface BookCollectionsService {
    void createBookCollection(BookCollections collection);

    void updateBookCollection(BookCollections collection, String idBookCollection) throws NotFoundException;

    void deleteBookCollection(String idBookCollections) throws NotFoundException;

    List<BookCollections> getAllBookCollections();
}
