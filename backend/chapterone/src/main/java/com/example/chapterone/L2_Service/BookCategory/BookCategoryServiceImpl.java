package com.example.chapterone.L2_Service.BookCategory;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.chapterone.L3_Repository.BookCategoryRepository;
import com.example.chapterone.L4_Model.Models.BookCategory;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BookCategoryServiceImpl implements BookCategoryService {
    @Autowired
    BookCategoryRepository bookCategoryRepository;

    @Override
    public void createCategory(BookCategory category) {
        boolean bookCategoryExists = bookCategoryRepository.findAll()
                .stream()
                .anyMatch(a -> a.getName().equalsIgnoreCase(category.getName()));

        if (bookCategoryExists) {
            throw new IllegalArgumentException("BookCategory with name '" + category.getName() + "' already exists.");
        }
        category.setBooksCount(0);
        bookCategoryRepository.save(category);
    }

    @Override
    public void updateCategory(BookCategory category, String idBookCategory) throws NotFoundException {
        log.info(idBookCategory);
        BookCategory existingBookCategory = bookCategoryRepository.findById(idBookCategory)
                .orElseThrow(() -> new NotFoundException("BookCategory not found with id: " + idBookCategory));

        Optional.ofNullable(category.getName()).ifPresent(existingBookCategory::setName);
        Optional.ofNullable(category.getColor()).ifPresent(existingBookCategory::setColor);
        Optional.ofNullable(category.getBooksCount()).ifPresent(existingBookCategory::setBooksCount);
        Optional.ofNullable(category.getCode()).ifPresent(existingBookCategory::setCode);
        bookCategoryRepository.save(existingBookCategory);
        log.info("BookCategory updated successfully: {}", existingBookCategory.getIdBookCategorie());
    }

    @Override
    public List<BookCategory> getAllBookCategories() {
        return bookCategoryRepository.findAll(Sort.by(Sort.Direction.ASC, "code"));
    }

}
