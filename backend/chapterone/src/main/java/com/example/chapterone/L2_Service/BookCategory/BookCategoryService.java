package com.example.chapterone.L2_Service.BookCategory;

import java.util.List;

import com.example.chapterone.L4_Model.Models.BookCategory;
import com.example.chapterone.L6_Exception.NotFoundException;

public interface BookCategoryService {
    void createCategory(BookCategory category);

    void updateCategory(BookCategory category, String BookCategory) throws NotFoundException;

    List<BookCategory> getAllBookCategories();
}
