package com.example.chapterone.L2_Service.BookCollections;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chapterone.L3_Repository.BookCollectionsRepository;
import com.example.chapterone.L4_Model.Entites.BookCollections;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BookCollectionsServiceImpl implements BookCollectionsService {

    @Autowired
    private BookCollectionsRepository bookCollectionsRepository;

    @Override
    public void createBookCollection(BookCollections collection) {
        log.info("Adding new book collection: {}", collection.getName());
        boolean exists = bookCollectionsRepository.findAll()
                .stream()
                .anyMatch(bc -> bc.getName().equalsIgnoreCase(collection.getName()));
        if (exists) {
            throw new IllegalArgumentException("Collection with name '" + collection.getName() + "' already exists.");
        }
        BookCollections newCollection = new BookCollections();
        newCollection.setName(collection.getName());
        newCollection.setIdBooks(new ArrayList<>());
        newCollection.setBookCount(0);
        bookCollectionsRepository.save(newCollection);
        log.info("Book collection '{}' created successfully", collection.getName());
    }

    @Override
    public void updateBookCollection(BookCollections collection, String idBookCollection) throws NotFoundException {
        BookCollections existingCollection = bookCollectionsRepository.findById(idBookCollection)
                .orElseThrow(() -> new NotFoundException("Book collection not found with id: " + idBookCollection));
        Optional.ofNullable(collection.getName()).ifPresent(existingCollection::setName);
        if (existingCollection.getIdBooks() == null) {
            existingCollection.setIdBooks(new ArrayList<>());
        }
        for (String bookId : collection.getIdBooks()) {
            if (existingCollection.getIdBooks().contains(bookId)) {
                existingCollection.getIdBooks().remove(bookId);
                log.info("Removed book '{}' from collection '{}'", bookId, existingCollection.getName());
            } else {
                existingCollection.getIdBooks().add(bookId);
                log.info("Added book '{}' to collection '{}'", bookId, existingCollection.getName());
            }
        }
        existingCollection.setBookCount(existingCollection.getIdBooks().size());
        bookCollectionsRepository.save(existingCollection);
        log.info("Book collection '{}' updated successfully", existingCollection.getName());
    }

    @Override
    public void deleteBookCollection(String idBookCollection) throws NotFoundException {
        BookCollections existingCollection = bookCollectionsRepository.findById(idBookCollection)
                .orElseThrow(() -> new NotFoundException("Book collection not found with id: " + idBookCollection));
        if (existingCollection.getIdBooks() != null && !existingCollection.getIdBooks().isEmpty()) {
            throw new IllegalArgumentException("Cannot delete collection because it contains books");
        }
        bookCollectionsRepository.delete(existingCollection);
        log.info("Book collection '{}' deleted successfully", existingCollection.getName());
    }

    @Override
    public List<BookCollections> getAllBookCollections() {
        List<BookCollections> collections = bookCollectionsRepository.findAll();
        log.info("Retrieved {} book collections", collections.size());
        return collections;
    }

}
